export interface BaseSettlementRequest {
  toAddress: string;
  amount: string;
  currency: "USDC";
  reference: string;
}

export interface BaseSettlementResult {
  status: "SETTLED" | "FAILED";
  txHash?: string;
  error?: string;
}

/**
 * Base payment adapter interface. lib/base/payments.ts provides the
 * DEMO_MODE-aware implementation: a deterministic, clearly-labeled demo
 * settlement while a live USDC transaction is still being pursued, per the
 * build plan's fallback strategy — never blocking the rest of the app on a
 * live chain call.
 */
export interface BasePaymentClient {
  settle(request: BaseSettlementRequest): Promise<BaseSettlementResult>;
  getTransaction(txHash: string): Promise<BaseSettlementResult>;
}
