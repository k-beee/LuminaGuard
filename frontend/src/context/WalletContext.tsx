"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createAccount } from "genlayer-js";
import { LUMINA_CONTRACT_ADDRESS, EXPLORER_URL, GENLAYER_STUDIONET_CHAIN_ID, RPC_ENDPOINT } from "@/config/constants";

export interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isMetaMask: boolean;
  connecting: boolean;
  chainId: number | null;
  connectMetaMask: () => Promise<void>;
  disconnect: () => void;
  switchOrAddGenLayerNetwork: () => Promise<void>;
  signerAccount: unknown;
  provider: unknown;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isMetaMask: false,
  connecting: false,
  chainId: null,
  connectMetaMask: async () => {},
  disconnect: () => {},
  switchOrAddGenLayerNetwork: async () => {},
  signerAccount: null,
  provider: null,
});

const GENLAYER_CHAIN_HEX = `0x${GENLAYER_STUDIONET_CHAIN_ID.toString(16)}`;

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isMetaMask, setIsMetaMask] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [signerAccount, setSignerAccount] = useState<unknown>(null);
  const [provider, setProvider] = useState<unknown>(null);

  const initLiveLocalAccount = () => {
    try {
      const acc = createAccount();
      setAddress(acc.address);
      setSignerAccount(acc);
      setIsMetaMask(false);
      setChainId(GENLAYER_STUDIONET_CHAIN_ID);
    } catch (e) {
      console.error("Error creating live account:", e);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const eth = (window as unknown as { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum;
    if (eth) {
      eth.request({ method: "eth_accounts" })
        .then((accountsUnknown) => {
          const accounts = accountsUnknown as string[];
          if (accounts && accounts[0]) {
            setAddress(accounts[0]);
            setIsMetaMask(true);
            setProvider(eth);
            eth.request({ method: "eth_chainId" }).then((cid) => {
              setChainId(parseInt(cid as string, 16));
            });
          } else {
            initLiveLocalAccount();
          }
        })
        .catch(() => {
          initLiveLocalAccount();
        });
    } else {
      initLiveLocalAccount();
    }
  }, []);

  const switchOrAddGenLayerNetwork = useCallback(async () => {
    const eth = (window as unknown as { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum;
    if (!eth) return;

    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: GENLAYER_CHAIN_HEX }],
      });
      setChainId(GENLAYER_STUDIONET_CHAIN_ID);
    } catch (switchError: unknown) {
      const err = switchError as { code?: number };
      if (err.code === 4902) {
        try {
          await eth.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: GENLAYER_CHAIN_HEX,
                chainName: "GenLayer StudioNet",
                nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
                rpcUrls: [RPC_ENDPOINT],
                blockExplorerUrls: [EXPLORER_URL],
              },
            ],
          });
          setChainId(GENLAYER_STUDIONET_CHAIN_ID);
        } catch (addError) {
          console.error("Failed to add GenLayer network:", addError);
        }
      }
    }
  }, []);

  const connectMetaMask = useCallback(async () => {
    const eth = (window as unknown as { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum;
    if (!eth) {
      alert("MetaMask or Web3 wallet extension not detected. Transactions will be signed directly using your live GenLayer StudioNet key.");
      return;
    }

    setConnecting(true);
    try {
      const accounts = (await eth.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts && accounts[0]) {
        setAddress(accounts[0]);
        setIsMetaMask(true);
        setProvider(eth);
        setSignerAccount(null);

        const currentChain = (await eth.request({ method: "eth_chainId" })) as string;
        const currentChainId = parseInt(currentChain, 16);
        setChainId(currentChainId);

        if (currentChainId !== GENLAYER_STUDIONET_CHAIN_ID) {
          await switchOrAddGenLayerNetwork();
        }
      }
    } catch (err) {
      console.error("User rejected connection:", err);
    } finally {
      setConnecting(false);
    }
  }, [switchOrAddGenLayerNetwork]);

  const disconnect = useCallback(() => {
    initLiveLocalAccount();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isMetaMask,
        connecting,
        chainId,
        connectMetaMask,
        disconnect,
        switchOrAddGenLayerNetwork,
        signerAccount,
        provider,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
