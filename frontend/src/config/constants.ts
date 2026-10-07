export const LUMINA_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x2C780dc5C4CAE3aBb17fb2A704a34B03D8ed0528") as `0x${string}`;

export const EXPLORER_URL =
  process.env.NEXT_PUBLIC_STUDIO_EXPLORER || "https://explorer-studio.genlayer.com";

export const GENLAYER_STUDIONET_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID || "61999"
);

export const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_RPC_URL || "https://studio.genlayer.com/api";
