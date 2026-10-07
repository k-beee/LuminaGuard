"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Category } from "@/lib/types";
import { useWallet } from "@/context/WalletContext";
import { Shield, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateInquiryPage() {
  const router = useRouter();
  const { address } = useWallet();

  const [category, setCategory] = useState<Category>("EVENT_OCCURRENCE");
  const [topic, setTopic] = useState("");
  const [action, setAction] = useState("");
  const [targetMetric, setTargetMetric] = useState("");
  const [humanDesc, setHumanDesc] = useState("");
  const [timeContext, setTimeContext] = useState("2026-10-01T12:00:00Z");
  const [windowStart, setWindowStart] = useState("2026-09-28T00:00:00Z");
  const [windowEnd, setWindowEnd] = useState("2026-10-05T23:59:59Z");

  const [loading, setLoading] = useState(false);
  const [txSuccess, setTxSuccess] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const applyPreset = () => {
    setCategory("EVENT_OCCURRENCE");
    setTopic("SpaceX Starship Orbital Test Flight 8");
    setAction("Successfully achieved soft splashdown in the Indian Ocean");
    setTargetMetric("Soft Splashdown Confirmed");
    setHumanDesc("SpaceX launched Starship Flight 8 from Starbase Texas, successfully achieving payload deploy and intact Indian Ocean ocean landing.");
    setTimeContext("2026-10-04T14:30:00Z");
    setWindowStart("2026-10-04T00:00:00Z");
    setWindowEnd("2026-10-06T23:59:59Z");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTxError(null);
    setTxSuccess(null);

    try {
      // Execute the inquiry declaration
      await new Promise((r) => setTimeout(r, 1200)); // Simulate StudioNet mining confirmation
      const simulatedInquiryId = `INQ-${Math.floor(10000 + Math.random() * 90000)}`;
      setTxSuccess(simulatedInquiryId);
    } catch (err: unknown) {
      const error = err as Error;
      setTxError(error.message || "Failed to broadcast transaction to GenLayer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-emerald-500" />
            Declare Fact Inquiry
          </h1>
          <p className="text-zinc-400">
            Define an atomic, falsifiable claim structure to be frozen and adjudicated by GenVM.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={applyPreset}
          className="border-zinc-700 hover:bg-zinc-800 text-zinc-300 gap-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Load Demo Preset
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Claim Structure</CardTitle>
            <CardDescription>
              Public evidence is evaluated strictly against these atomic parameters, not open prose.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="EVENT_OCCURRENCE">EVENT_OCCURRENCE (Real-world action or outcome)</option>
                <option value="ENTITY_STATUS">ENTITY_STATUS (Status, merger, leadership change)</option>
                <option value="PUBLIC_DECLARATION">PUBLIC_DECLARATION (Official speech, filing, policy)</option>
                <option value="TIME_SENSITIVE_FACT">TIME_SENSITIVE_FACT (Dated metric or threshold)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Topic / Subject
              </label>
              <Input
                placeholder="e.g. Federal Reserve Benchmark Rate"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Action / Predicate
                </label>
                <Input
                  placeholder="e.g. Cut rates by 25 basis points"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Target Metric / Value
                </label>
                <Input
                  placeholder="e.g. 4.75%"
                  value={targetMetric}
                  onChange={(e) => setTargetMetric(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Detailed Human Statement
              </label>
              <Textarea
                placeholder="Describe the claim in full context for human reviewers..."
                value={humanDesc}
                onChange={(e) => setHumanDesc(e.target.value)}
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Temporal Bounds (UTC)</CardTitle>
            <CardDescription>
              GenVM validators reject any source whose publication timestamp falls outside this verified window.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Event Reference Time
              </label>
              <Input
                value={timeContext}
                onChange={(e) => setTimeContext(e.target.value)}
                placeholder="YYYY-MM-DDTHH:MM:SSZ"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Observation Window Start
              </label>
              <Input
                value={windowStart}
                onChange={(e) => setWindowStart(e.target.value)}
                placeholder="YYYY-MM-DDTHH:MM:SSZ"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Observation Window End
              </label>
              <Input
                value={windowEnd}
                onChange={(e) => setWindowEnd(e.target.value)}
                placeholder="YYYY-MM-DDTHH:MM:SSZ"
                required
              />
            </div>
          </CardContent>
        </Card>

        {txError && (
          <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{txError}</p>
          </div>
        )}

        {txSuccess && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">Inquiry successfully declared on GenLayer!</p>
                <p className="text-xs text-emerald-300/80 font-mono">ID: {txSuccess}</p>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => router.push(`/inquiries`)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
            >
              View Inquiries
            </Button>
          </div>
        )}

        <div className="flex items-center justify-end gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-8"
          >
            {loading ? "Broadcasting to GenVM..." : "Submit to GenLayer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
