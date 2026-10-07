import { createClient } from "genlayer-js";
import { simulator } from "genlayer-js/chains";

export const client = createClient({
  chain: simulator,
});

export const LUMINA_CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

// Interface map mirroring our newly obfuscated python contract logic
export const contractConfig = {
  address: LUMINA_CONTRACT,
};
