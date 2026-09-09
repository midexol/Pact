import { nanoid } from "nanoid";
import {
  createPublicClient,
  createWalletClient,
  http,
  parseUnits,
  encodeFunctionData,
  type Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { env } from "@/lib/env";
import type { BasePaymentClient, BaseSettlementRequest, BaseSettlementResult } from "./client";

const ERC20_ABI = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

/**
 * Demo settlement client: deterministic, instant, clearly not a real
 * transaction (txHash is prefixed "demo_"). This is what keeps the
 * three-minute judging demo from depending on a live RPC call or a funded
 * wallet, per the build plan's fallback strategy — while still exercising
 * the exact same BasePaymentClient interface the real adapter will use.
 */
class DemoPaymentClient implements BasePaymentClient {
  async settle(_request: BaseSettlementRequest): Promise<BaseSettlementResult> {
    return {
      status: "SETTLED",
      txHash: `demo_${nanoid(16)}`,
    };
  }

  async getTransaction(txHash: string): Promise<BaseSettlementResult> {
    return { status: "SETTLED", txHash };
  }
}

/**
 * Live Base adapter: signs and broadcasts a real USDC transfer on Base
 * Sepolia. USDC uses 6 decimals on every network it's deployed to, so the
 * request's decimal-string amount ("10") is scaled with parseUnits(..., 6)
 * rather than trusting a per-chain lookup.
 */
class LiveBasePaymentClient implements BasePaymentClient {
  private account = privateKeyToAccount(env.BASE_PRIVATE_KEY as `0x${string}`);
  private publicClient = createPublicClient({ chain: baseSepolia, transport: http(env.BASE_RPC_URL) });
  private walletClient = createWalletClient({
    account: this.account,
    chain: baseSepolia,
    transport: http(env.BASE_RPC_URL),
  });

  async settle(request: BaseSettlementRequest): Promise<BaseSettlementResult> {
    try {
      const data = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [request.toAddress as Address, parseUnits(request.amount, 6)],
      });

      const hash = await this.walletClient.sendTransaction({
        to: env.USDC_CONTRACT_ADDRESS as Address,
        data,
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

      return {
        status: receipt.status === "success" ? "SETTLED" : "FAILED",
        txHash: hash,
      };
    } catch (err) {
      return {
        status: "FAILED",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  async getTransaction(txHash: string): Promise<BaseSettlementResult> {
    const receipt = await this.publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` });
    return {
      status: receipt.status === "success" ? "SETTLED" : "FAILED",
      txHash,
    };
  }
}

let client: BasePaymentClient | null = null;

export function getPaymentClient(): BasePaymentClient {
  if (client) return client;
  const canGoLive = !env.DEMO_MODE && env.BASE_RPC_URL && env.BASE_PRIVATE_KEY;
  client = canGoLive ? new LiveBasePaymentClient() : new DemoPaymentClient();
  return client;
}
