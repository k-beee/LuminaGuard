"use client";

import React, { useState } from "react";
import { RuleSet } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Lock, X, Check, ShieldAlert } from "lucide-react";

interface LockParametersModalProps {
  inquiryId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedStage: string) => void;
}

export function LockParametersModal({ inquiryId, isOpen, onClose, onSuccess }: LockParametersModalProps) {
  const [ruleSet, setRuleSet] = useState<RuleSet>("DIVERSE_SOURCES");
  const [govDomains, setGovDomains] = useState("reuters.com, bloomberg.com");
  const [regDomains, setRegDomains] = useState("sec.gov");
  const [minTotal, setMinTotal] = useState(2);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate GenLayer transaction
      await new Promise((r) => setTimeout(r, 1000));
      onSuccess("GATHERING");
      onClose();
    } catch (err) {
      console.error("Lock parameters failed:", err);
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
            <h3 className="text-lg font-bold text-white">Lock Inquiry Parameters</h3>
            <p className="text-xs text-zinc-400 font-mono">Target: {inquiryId}</p>
          </div>
        </div>

        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-xs flex gap-2">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Irreversible Action:</strong> Once locked, no party can modify the verification policy or authorized domains. Evidence collection opens immediately.
          </span>
        </div>

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
              <Check className="w-4 h-4" />
              {loading ? "Locking on GenVM..." : "Lock Parameters Forever"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
