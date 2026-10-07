import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { LUMINA_CONTRACT_ADDRESS } from "@/config/constants";
import { Inquiry, SourceData } from "./types";

/**
 * Initializes a public read client connecting directly to GenLayer StudioNet.
 */
export function getReadClient() {
  return createClient({
    chain: studionet,
  });
}

/**
 * Initializes a wallet-connected client for signing transactions on GenLayer.
 */
export function getWalletClient(accountAddress: string, provider?: unknown) {
  if (provider) {
    return createClient({
      chain: studionet,
      account: accountAddress as `0x${string}`,
      provider,
    } as never);
  }
  return createClient({
    chain: studionet,
    account: accountAddress as `0x${string}`,
  });
}

/**
 * Helper to call a view method on LuminaGuard contract
 */
export async function fetchInquiryFromChain(inquiryId: string): Promise<Partial<Inquiry> | null> {
  try {
    const client = getReadClient();
    const result = await client.readContract({
      address: LUMINA_CONTRACT_ADDRESS,
      functionName: "get_inquiry",
      args: [inquiryId],
    });
    return result as Partial<Inquiry>;
  } catch (err) {
    console.warn(`Chain read for inquiry ${inquiryId} failed or returned error:`, err);
    return null;
  }
}

/**
 * Send write transactions to LuminaGuard
 */
export async function executeContractWrite(
  client: ReturnType<typeof getWalletClient>,
  functionName: string,
  args: unknown[],
  value?: bigint
) {
  return await client.writeContract({
    address: LUMINA_CONTRACT_ADDRESS,
    functionName,
    args,
    value,
  } as never);
}
