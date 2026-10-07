"use client";

import React, { useState } from "react";
import { RuleSet } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useWallet } from "@/context/WalletContext";
import { getActiveWriteClient, liveLockParameters } from "@/lib/genlayer";
import { EXPLORER_URL } from "@/config/constants";
import { Lock, X, Check, ShieldAlert, Loader2, ExternalLink } from "lucide-react";

interface LockParametersModalProps {
  inquiryId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedStage: string) => void;
}

export function LockParametersModal({ inquiryId, isOpen, onClose, onSuccess }: LockParametersModalProps) {
  const { address, provider, signerAccount } = useWallet();
  const [ruleSet, setRuleSet] = useState<RuleSet>("DIVERSE_SOURCES");
  const [govDomains, setGovDomains] = useState("spacex.com, nasa.gov");
  const [regDomains, setRegDomains] = useState("faa.gov");
  const [minTotal, setMinTotal] = useState(2);
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

      const govList = govDomains.split(",").map((d) => d.trim()).filter(Boolean);
      const regList = regDomains.split(",").map((d) => d.trim()).filter(Boolean);

      const result = await liveLockParameters(
        client,
        inquiryId,
        ruleSet,
        govList,
        regList,
        minTotal
      );

      setTxHash(result.hash);
      setTimeout(() => {
        onSuccess("GATHERING");
        onClose();
      }, 1500);
    } catch (err: unknown) {
      console.error("Lock parameters failed:", err);
      const errorMsg = (err as Error).message || "Transaction failed on GenLayer StudioNet";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Lock Parameters on GenLayer</h3>
            <p className="text-xs text-zinc-400 font-mono">Target: {inquiryId}</p>
          </div>
        </div>

        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-xs flex gap-2">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Live On-Chain Action:</strong> This calls the deployed contract method <code>lock_parameters()</code>. Once confirmed, source policies and domains cannot be modified.
          </span>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 rounded text-rose-400 text-xs">
            {error}
          </div>
        )}

        {txHash && (
          <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-xs flex items-center justify-between">
            <span>Transaction Accepted on StudioNet!</span>
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
              Source Rule Policy
            </label>
            <select
              value={ruleSet}
              onChange={(e) => setRuleSet(e.target.value as RuleSet)}
              className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            >
              <option value="DIVERSE_SOURCES">DIVERSE_SOURCES (Multi-origin corroboration)</option>
              <option value="STRICT_OFFICIAL">STRICT_OFFICIAL (Official entity press only)</option>
              <option value="REGULATOR_ONLY">REGULATOR_ONLY (Regulatory body only)</option>
              <option value="PRIMARY_AND_SUPPORT">PRIMARY_AND_SUPPORT (Primary announcement + report)</option>
              <option value="ANY_EVIDENCE">ANY_EVIDENCE (Open public evidence)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Authorized Entity / News Domains (comma separated)
            </label>
            <Input
              value={govDomains}
              onChange={(e) => setGovDomains(e.target.value)}
              placeholder="e.g. spacex.com, reuters.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Regulatory Domains (comma separated)
            </label>
            <Input
              value={regDomains}
              onChange={(e) => setRegDomains(e.target.value)}
              placeholder="e.g. sec.gov, faa.gov"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Minimum Required Sources
            </label>
            <Input
              type="number"
              min={1}
              max={10}
              value={minTotal}
              onChange={(e) => setMinTotal(Number(e.target.value))}
            />
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
              {loading ? "Confirming on StudioNet..." : "Lock Parameters Forever"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
