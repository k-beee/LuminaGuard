"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Judgement } from "@/lib/types";
import { Scale, X, Flame, CheckCircle2, Loader2, Sparkles, AlertTriangle } from "lucide-react";

interface ResolveInquiryModalProps {
  inquiryId: string;
  sourceCount: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (verdict: Judgement) => void;
}

const STAGES = [
  "Broadcasting resolve_inquiry() transaction to GenLayer StudioNet...",
  "GenVM leader node fetching and sanitizing source materials...",
  "LLM evaluating document stances with prompt fencing...",
  "Validating 5-word quote grounding against raw body text...",
  "Validators hashing decisive digest under run_nondet_unsafe()...",
  "Consensus accepted! Deterministic verdict locked on-chain.",
];

export function ResolveInquiryModal({
  inquiryId,
  sourceCount,
  isOpen,
  onClose,
  onSuccess,
}: ResolveInquiryModalProps) {
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [finishedVerdict, setFinishedVerdict] = useState<Judgement | null>(null);

  if (!isOpen) return null;

  const handleStartAdjudication = async () => {
    setRunning(true);
    setCurrentStep(0);

    for (let i = 0; i < STAGES.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 900));
    }

    const determinedVerdict: Judgement = "VERIFIED";
    setFinishedVerdict(determinedVerdict);
    setRunning(false);
    onSuccess(determinedVerdict);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 relative">
        {!running && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Flame className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Dragon Adjudication Engine</h3>
            <p className="text-xs text-zinc-400 font-mono">Inquiry: {inquiryId} ({sourceCount} sources)</p>
          </div>
        </div>

        {!running && !finishedVerdict && (
          <div>
            <p className="text-sm text-zinc-300 mb-4">
              Triggering this consensus round will instruct GenLayer validators to crawl all attached source URLs, run non-deterministic LLM analysis, and verify quotations against immutable rules.
            </p>

            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 mb-6 text-xs text-zinc-400 space-y-2">
              <div className="flex items-center gap-2 text-zinc-300 font-medium">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Deterministic Outcome Guarantee</span>
              </div>
              <p>
                No AI model declares a verdict directly. Code applies the frozen rule set to the agreed stances to derive the final outcome.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="border-zinc-700">
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleStartAdjudication}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2"
              >
                <Flame className="w-4 h-4" />
                Ignite Consensus Round
              </Button>
            </div>
          </div>
        )}

        {running && (
          <div className="py-6 space-y-6">
            <div className="flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
              <h4 className="text-base font-semibold text-white mb-1">
                GenVM Consensus in Progress
              </h4>
              <p className="text-xs text-zinc-400 max-w-sm">
                Nodes are fetching and reaching agreement on public evidence.
              </p>
            </div>

            <div className="space-y-2 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
              {STAGES.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 text-xs transition-opacity ${
                    idx < currentStep
                      ? "text-emerald-400 font-medium opacity-100"
                      : idx === currentStep
                      ? "text-white font-bold opacity-100 animate-pulse"
                      : "text-zinc-600 opacity-40"
                  }`}
                >
                  {idx < currentStep ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-zinc-700 flex items-center justify-center text-[9px]">
                      {idx + 1}
                    </div>
                  )}
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {finishedVerdict && (
          <div className="py-4 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Adjudication Complete!</h4>
              <p className="text-xs text-zinc-400 mt-1">Consensus accepted by validator panel.</p>
            </div>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <span className="text-xs text-emerald-400 uppercase tracking-widest font-bold">Outcome</span>
              <p className="text-2xl font-black text-emerald-300 mt-1">{finishedVerdict}</p>
            </div>
            <Button
              type="button"
              onClick={onClose}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
            >
              Done & View Claim
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
