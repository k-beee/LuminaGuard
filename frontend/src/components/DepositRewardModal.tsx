"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useWallet } from "@/context/WalletContext";
import { getActiveWriteClient, liveDepositReward } from "@/lib/genlayer";
import { EXPLORER_URL } from "@/config/constants";
import { Coins, X, Check, ArrowRight, Loader2, ExternalLink } from "lucide-react";

interface DepositRewardModalProps {
  inquiryId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: string) => void;
}

export function DepositRewardModal({ inquiryId, isOpen, onClose, onSuccess }: DepositRewardModalProps) {
  const { address, provider, signerAccount } = useWallet();
  const [bountyAmount, setBountyAmount] = useState("10");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const activeAccount = signerAccount || address;
      const client = getActiveWriteClient(activeAccount, provider);

      // Convert GEN to wei
      const amountWei = BigInt(Math.floor(parseFloat(bountyAmount) * 1e18));
      const result = await liveDepositReward(client, inquiryId, amountWei);

      setTxHash(result.hash);
      setTimeout(() => {
        onSuccess(bountyAmount);
        onClose();
      }, 1500);
    } catch (err: unknown) {
      console.error("Funding bounty failed:", err);
      const errorMsg = (err as Error).message || "Payable transaction failed on GenLayer StudioNet";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Sponsor Bounty on StudioNet</h3>
            <p className="text-xs text-zinc-400 font-mono">Inquiry: {inquiryId}</p>
          </div>
        </div>

        <p className="text-sm text-zinc-400 mb-4">
          Escrow native GEN tokens live into the contract vault. Escrowed bounties are released to the first decisive evidence provider on finalization.
        </p>

        {error && (
          <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 rounded text-rose-400 text-xs">
            {error}
          </div>
        )}

        {txHash && (
          <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-xs flex items-center justify-between">
            <span>Bounty Funded on StudioNet!</span>
            <a
              href={`${EXPLORER_URL}/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 underline font-mono text-[10px]"
            >
              <span>View Tx</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Bounty Amount (GEN)
            </label>
            <div className="relative">
              <Input
                type="number"
                min="1"
                step="1"
                value={bountyAmount}
                onChange={(e) => setBountyAmount(e.target.value)}
                required
                className="pr-16 text-lg font-mono"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                GEN
              </span>
            </div>
          </div>

          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs text-zinc-400 space-y-1">
            <div className="flex justify-between">
              <span>Vault Recipient:</span>
              <span className="text-zinc-200">First Decisive Evidence Provider</span>
            </div>
            <div className="flex justify-between">
              <span>Unsettled / Disputed:</span>
              <span className="text-zinc-200">Refunded to Sponsor</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <Button type="button" variant="outline" onClick={onClose} className="border-zinc-700">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Broadcasting Payable Tx..." : "Fund Bounty"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
