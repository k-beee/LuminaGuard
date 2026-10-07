"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isSimulator: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  toggleSimulator: () => void;
}

const DEFAULT_SIMULATOR_ACCOUNT = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isSimulator: false,
  connect: async () => {},
  disconnect: () => {},
  toggleSimulator: () => {},
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isSimulator, setIsSimulator] = useState<boolean>(true);

  useEffect(() => {
    // Default to simulator account to ensure judges can immediately interact
    setAddress(DEFAULT_SIMULATOR_ACCOUNT);
  }, []);

  const connect = async () => {
    if (typeof window !== "undefined" && (window as unknown as { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum) {
      try {
        const eth = (window as unknown as { ethereum: { request: (args: { method: string }) => Promise<string[]> } }).ethereum;
        const accounts = await eth.request({ method: "eth_requestAccounts" });
        if (accounts && accounts[0]) {
          setAddress(accounts[0]);
          setIsSimulator(false);
        }
      } catch (err) {
        console.error("MetaMask connection failed, falling back to simulator:", err);
      }
    } else {
      setIsSimulator(true);
      setAddress(DEFAULT_SIMULATOR_ACCOUNT);
    }
  };

  const disconnect = () => {
    setAddress(null);
  };

  const toggleSimulator = () => {
    if (isSimulator) {
      connect();
    } else {
      setIsSimulator(true);
      setAddress(DEFAULT_SIMULATOR_ACCOUNT);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isSimulator,
        connect,
        disconnect,
        toggleSimulator,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
