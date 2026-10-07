"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Coins, X, Check, ArrowRight } from "lucide-react";

interface DepositRewardModalProps {
  inquiryId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: string) => void;
}

export function DepositRewardModal({ inquiryId, isOpen, onClose, onSuccess }: DepositRewardModalProps) {
  const [bountyAmount, setBountyAmount] = useState("50");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate GenLayer payable transaction
      await new Promise((r) => setTimeout(r, 1100));
      onSuccess(bountyAmount);
      onClose();
    } catch (err) {
      console.error("Funding bounty failed:", err);
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
            <h3 className="text-lg font-bold text-white">Sponsor Bounty Vault</h3>
            <p className="text-xs text-zinc-400 font-mono">Inquiry: {inquiryId}</p>
          </div>
        </div>

        <p className="text-sm text-zinc-400 mb-4">
          Escrow native tokens to incentivize global researchers and community members to attach verified source evidence.
        </p>

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
              {loading ? "Confirming in Wallet..." : "Fund Bounty"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
