"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StageBadge, JudgementBadge, CategoryBadge, StanceBadge } from "@/components/InquiryBadges";
import { LockParametersModal } from "@/components/LockParametersModal";
import { DepositRewardModal } from "@/components/DepositRewardModal";
import { AddSourceModal } from "@/components/AddSourceModal";
import { ResolveInquiryModal } from "@/components/ResolveInquiryModal";
import { LUMINA_CONTRACT_ADDRESS, EXPLORER_URL } from "@/config/constants";
import { getLocalLiveInquiries, getLocalLiveSources, fetchLiveContractInquiry, fetchLiveContractEvidence } from "@/lib/genlayer";
import {
  Shield,
  Lock,
  Coins,
  Globe,
  Flame,
  CheckCircle2,
  ExternalLink,
  Quote,
  ArrowLeft,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { Stage, Judgement, SourceData, Inquiry } from "@/lib/types";

function InquiryDetailContent() {
  const params = useParams();
  const id = (params?.id as string) || "INQ-00001";

  const [inquiry, setInquiry] = useState<Partial<Inquiry>>({
    inquiry_id: id,
    topic: "Live Fact Adjudication Claim",
    human_desc: "Synchronizing state directly with GenLayer StudioNet...",
    stage: "PREP",
    final_judge: "",
    reward_wei: "0",
    target_metric: "Pending Verification",
    source_ids: [],
  });

  const [sources, setSources] = useState<SourceData[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [isLockOpen, setIsLockOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [isResolveOpen, setIsResolveOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Check local registry first for fast hydration
      const localInquiries = getLocalLiveInquiries();
      const match = localInquiries.find((i) => i.inquiry_id === id);
      if (match) {
        setInquiry(match);
      }

      // 2. Fetch directly from deployed contract on StudioNet
      const contractData = await fetchLiveContractInquiry(id);
      if (contractData) {
        setInquiry((prev) => ({
          ...prev,
          ...contractData,
        }));
      }

      // 3. Load canonical sources from deployed contract - NO hard-coded evidence
      const contractSources = await fetchLiveContractEvidence(id);
      const localSources = getLocalLiveSources(id);

      const mergedSources: SourceData[] = [...contractSources];
      for (const loc of localSources) {
        if (!mergedSources.some((s) => s.source_id === loc.source_id)) {
          mergedSources.push(loc);
        }
      }
      setSources(mergedSources);
    } catch (err) {
      console.warn("Failed loading live inquiry detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const bountyGEN = (Number(inquiry.reward_wei || "0") / 1e18).toFixed(0);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/inquiries" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Back to Explorer
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="border-zinc-800 text-xs text-zinc-400 gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            Sync Chain
          </Button>
          <a
            href={`${EXPLORER_URL}/address/${LUMINA_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-mono bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20"
          >
            <span>Contract: {LUMINA_CONTRACT_ADDRESS.slice(0, 8)}...{LUMINA_CONTRACT_ADDRESS.slice(-6)}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-300 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
                {inquiry.inquiry_id}
              </span>
              <CategoryBadge category={inquiry.category || "EVENT_OCCURRENCE"} />
              <StageBadge stage={inquiry.stage || "PREP"} />
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {inquiry.topic}
            </h1>

            <p className="text-zinc-300 text-base leading-relaxed">
              {inquiry.human_desc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-zinc-400">
              <div>
                <span className="text-zinc-500">Target Value:</span>{" "}
                <strong className="text-zinc-200">{inquiry.target_metric || "Target Defined"}</strong>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Coins className="w-4 h-4" />
                <span>{bountyGEN} GEN Escrowed</span>
              </div>
            </div>
          </div>

          {/* Action Center */}
          <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 min-w-[200px]">
            {inquiry.stage === "PREP" && (
              <Button
                onClick={() => setIsLockOpen(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white gap-2 text-xs font-semibold"
              >
                <Lock className="w-3.5 h-3.5" />
                Lock Parameters
              </Button>
            )}

            <Button
              onClick={() => setIsDepositOpen(true)}
              variant="outline"
              className="border-zinc-700 hover:bg-zinc-800 text-amber-400 gap-2 text-xs font-semibold"
            >
              <Coins className="w-3.5 h-3.5" />
              Fund Bounty Vault
            </Button>

            <Button
              onClick={() => setIsAddSourceOpen(true)}
              variant="outline"
              className="border-zinc-700 hover:bg-zinc-800 text-blue-400 gap-2 text-xs font-semibold"
            >
              <Globe className="w-3.5 h-3.5" />
              Attach Source
            </Button>

            <Button
              onClick={() => setIsResolveOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 text-xs font-semibold shadow-lg shadow-emerald-950"
            >
              <Flame className="w-3.5 h-3.5" />
              Ignite Adjudication
            </Button>
          </div>
        </div>
      </div>

      {/* Adjudication Outcome Card */}
      {inquiry.final_judge && (
        <Card className="border-emerald-500/30 bg-emerald-950/20 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Consensus Verdict Finalized
                </CardTitle>
                <CardDescription className="text-emerald-300/70">
                  Agreed by GenLayer validator panel through run_nondet_unsafe()
                </CardDescription>
              </div>
              <JudgementBadge judge={inquiry.final_judge} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800">
                <span className="text-zinc-500">Decisive Consensus Status:</span>
                <p className="font-semibold text-emerald-400 mt-1">
                  Accepted on GenLayer StudioNet
                </p>
              </div>
              <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800">
                <span className="text-zinc-500">Final Verdict:</span>
                <p className="font-bold text-white mt-1">
                  {inquiry.final_judge}
                </p>
              </div>
              <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800">
                <span className="text-zinc-500">Settlement Recipient:</span>
                {inquiry.final_judge === "VERIFIED" || inquiry.final_judge === "DEBUNKED" ? (
                  <p className="font-semibold text-emerald-300 mt-1 font-mono text-[11px] truncate" title={inquiry.decisive_submitter || inquiry.reward_sponsor}>
                    Bounty: {inquiry.decisive_submitter || inquiry.reward_sponsor || "Decisive Submitter"}
                  </p>
                ) : (
                  <p className="font-semibold text-amber-300 mt-1 font-mono text-[11px] truncate" title={inquiry.reward_sponsor}>
                    Refund: {inquiry.reward_sponsor || "Sponsor Refund"}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Source Evidence Materials */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Registered Source Evidence ({sources.length})
          </h2>
          <Button
            onClick={() => setIsAddSourceOpen(true)}
            size="sm"
            variant="outline"
            className="border-zinc-700 text-xs gap-1.5"
          >
            + Add Another Source
          </Button>
        </div>

        {sources.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-xl">
            <p className="text-zinc-400 text-sm mb-3">No sources attached to this inquiry yet.</p>
            <Button
              onClick={() => setIsAddSourceOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              Attach First Source
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((src, idx) => (
              <Card key={idx} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-5 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                        {src.source_id}
                      </span>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-blue-400 hover:underline flex items-center gap-1 truncate max-w-lg"
                      >
                        <span>{src.url}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 font-mono">HTTP {src.code}</span>
                      <StanceBadge stance={src.stance} />
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2">
                    <Quote className="w-4 h-4 text-zinc-600 flex-shrink-0 mt-0.5" />
                    <p className="italic text-zinc-300">
                      &ldquo;{src.context_note}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                    <span>Provider: {src.provider.slice(0, 10)}...</span>
                    <span>Registered: {new Date(src.added_at).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <LockParametersModal
        inquiryId={inquiry.inquiry_id || id}
        isOpen={isLockOpen}
        onClose={() => setIsLockOpen(false)}
        onSuccess={() => loadData()}
      />

      <DepositRewardModal
        inquiryId={inquiry.inquiry_id || id}
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onSuccess={() => loadData()}
      />

      <AddSourceModal
        inquiryId={inquiry.inquiry_id || id}
        isOpen={isAddSourceOpen}
        onClose={() => setIsAddSourceOpen(false)}
        onSuccess={() => loadData()}
      />

      <ResolveInquiryModal
        inquiryId={inquiry.inquiry_id || id}
        sourceCount={sources.length}
        isOpen={isResolveOpen}
        onClose={() => setIsResolveOpen(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
}

export default function InquiryDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500">Loading Live Inquiry...</div>}>
      <InquiryDetailContent />
    </Suspense>
  );
}
