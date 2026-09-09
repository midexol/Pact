import { z } from "zod";

/**
 * Validated environment configuration.
 *
 * DEMO_MODE=true (the default) lets the whole PACT flow run end-to-end with
 * deterministic, in-memory adapters — no live Sibyl / Virtuals / Base
 * credentials required. Flip DEMO_MODE=false and fill in the credentials
 * below once the verified Sibyl SDK, Virtuals ACP, and a funded Base wallet
 * are wired in (see lib/sibyl, lib/virtuals, lib/base).
 *
 * Never expose private keys or API secrets through NEXT_PUBLIC_ variables.
 */
const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("PACT"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),

  DEMO_MODE: z
    .string()
    .default("true")
    .transform((v) => v === "true"),

  LLM_API_KEY: z.string().optional(),

  // URL of the local sibyl-sidecar process (see sibyl-sidecar/README). Not a
  // hosted API — sibyl-memory-client is a local SQLite-backed SDK with no
  // remote endpoint of its own.
  SIBYL_SIDECAR_URL: z.string().optional(),

  VIRTUALS_API_KEY: z.string().optional(),
  VIRTUALS_API_URL: z.string().optional(),

  BASE_RPC_URL: z.string().optional(),
  BASE_PRIVATE_KEY: z.string().optional(),
  BASE_CHAIN_ID: z.string().optional(),

  USDC_CONTRACT_ADDRESS: z.string().optional(),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration");
  }
  return parsed.data;
}

export const env = loadEnv();
