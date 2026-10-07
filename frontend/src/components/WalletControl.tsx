"use client";

import React, { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { Button } from "./ui/button";
import { Wallet, LogOut, ExternalLink, Check, Copy, ChevronDown } from "lucide-react";
import { EXPLORER_URL } from "@/config/constants";

export function WalletControl() {
  const {
    address,
    isConnected,
    isMetaMask,
    connecting,
    connectMetaMask,
    connectDirectSigner,
    disconnect,
    switchOrAddGenLayerNetwork,
  } = useWallet();

  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="relative">
        <div className="flex items-center gap-2">
          <Button
            onClick={connectMetaMask}
            disabled={connecting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold gap-2 shadow-sm"
          >
            <Wallet className="w-3.5 h-3.5" />
            {connecting ? "Connecting..." : "Connect MetaMask"}
          </Button>

          <Button
            onClick={connectDirectSigner}
            variant="outline"
            className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs"
          >
            Direct Key
          </Button>
        </div>
      </div>
    );
  }

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="flex items-center gap-2">
      {/* Account Info Pill */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
        <button
          onClick={copyAddress}
          className="font-mono text-zinc-200 font-semibold hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          title="Click to copy address"
        >
          <span>{shortAddress}</span>
          {copied ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3 text-zinc-500" />
          )}
        </button>

        <span
          className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
            isMetaMask
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
          }`}
        >
          {isMetaMask ? "MetaMask" : "StudioNet Key"}
        </span>
      </div>

      {/* Disconnect Button */}
      <Button
        onClick={disconnect}
        variant="outline"
        size="sm"
        className="border-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 text-xs gap-1.5 transition-colors"
        title="Disconnect current wallet"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Disconnect</span>
      </Button>
    </div>
  );
}
