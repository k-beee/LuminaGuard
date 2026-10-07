"use client";

import React, { useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StageBadge, JudgementBadge, CategoryBadge, StanceBadge } from "@/components/InquiryBadges";
import { LockParametersModal } from "@/components/LockParametersModal";
import { DepositRewardModal } from "@/components/DepositRewardModal";
import { AddSourceModal } from "@/components/AddSourceModal";
import { ResolveInquiryModal } from "@/components/ResolveInquiryModal";
import { LUMINA_CONTRACT_ADDRESS, EXPLORER_URL } from "@/config/constants";
import {
  Shield,
  Lock,
  Coins,
  Globe,
  Flame,
  CheckCircle2,
  ExternalLink,
  Quote,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { Stage, Judgement, SourceData } from "@/lib/types";

function InquiryDetailContent() {
  const params = useParams();
  const id = (params?.id as string) || "INQ-00101";

  // Inquiry state
  const [stage, setStage] = useState<Stage>("HAS_SOURCES");
  const [judge, setJudge] = useState<Judgement | "">("VERIFIED");
  const [bounty, setBounty] = useState("25");

  // Evidence list state
  const [sources, setSources] = useState<SourceData[]>([
    {
      source_id: "SRC-001",
      inquiry_id: id,
      provider: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      url: "https://www.reuters.com/technology/space/spacex-starship-flight-8-landing-indian-ocean",
      url_hash: "reuters.com/spacex-flight-8",
      context_note: "Article explicitly quotes mission control reporting successful intact splashdown coordinates.",
      added_at: "2026-10-04T16:00:00Z",
      auth_level: "GENERAL_PUBLIC",
      stance: "BACKS",
      code: 200,
    },
    {
      source_id: "SRC-002",
      inquiry_id: id,
      provider: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      url: "https://www.spacex.com/updates/starship-flight-8-report",
      url_hash: "spacex.com/flight-8",
      context_note: "Official press statement declaring target objectives accomplished including soft splashdown.",
      added_at: "2026-10-04T16:15:00Z",
      auth_level: "GOVERNMENT",
      stance: "BACKS",
      code: 200,
    },
  ]);

  // Modal open states
  const [isLockOpen, setIsLockOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [isResolveOpen, setIsResolveOpen] = useState(false);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/inquiries" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Back to Explorer
        </Link>
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

      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-300 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
                {id}
              </span>
              <CategoryBadge category="EVENT_OCCURRENCE" />
              <StageBadge stage={stage} />
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              SpaceX Starship Flight 8 Splashdown
            </h1>

            <p className="text-zinc-300 text-base leading-relaxed">
              Starship Flight 8 achieved orbital speed, survived peak atmospheric heating, and landed upright before soft ocean impact in the Indian Ocean.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-zinc-400">
              <div>
                <span className="text-zinc-500">Target Value:</span>{" "}
                <strong className="text-zinc-200">Soft Splashdown Confirmed</strong>
              </div>
              <div>
                <span className="text-zinc-500">Observation Window:</span>{" "}
                <strong className="text-zinc-200">2026-10-04T00:00:00Z → 2026-10-06T23:59:59Z</strong>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Coins className="w-4 h-4" />
                <span>{bounty} GEN Escrowed</span>
              </div>
            </div>
          </div>

          {/* Action Center */}
          <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 min-w-[200px]">
            {stage === "PREP" && (
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
      {judge && (
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
              <JudgementBadge judge={judge} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800">
                <span className="text-zinc-500">Decisive Consensus Digest:</span>
                <p className="font-mono text-zinc-300 mt-1 truncate">
                  0x9f83a42b78103c8479e0a84d728519c0182479e18293847291a0c84728192841
                </p>
              </div>
              <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800">
                <span className="text-zinc-500">Source Corroboration:</span>
                <p className="font-semibold text-emerald-400 mt-1">
                  2/2 Independent Sources Agree
                </p>
              </div>
              <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800">
                <span className="text-zinc-500">Settlement Dispatch:</span>
                <p className="font-semibold text-zinc-200 mt-1">
                  Scheduled on=&quot;finalized&quot;
                </p>
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
      </div>

      {/* Modals */}
      <LockParametersModal
        inquiryId={id}
        isOpen={isLockOpen}
        onClose={() => setIsLockOpen(false)}
        onSuccess={(st) => setStage(st as Stage)}
      />

      <DepositRewardModal
        inquiryId={id}
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onSuccess={(amt) => setBounty(amt)}
      />

      <AddSourceModal
        inquiryId={id}
        isOpen={isAddSourceOpen}
        onClose={() => setIsAddSourceOpen(false)}
        onSuccess={(newUrl) => {
          setSources([
            ...sources,
            {
              source_id: `SRC-${(sources.length + 1).toString().padStart(3, "0")}`,
              inquiry_id: id,
              provider: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
              url: newUrl,
              url_hash: newUrl,
              context_note: "Community-submitted article verifying inquiry parameters.",
              added_at: new Date().toISOString(),
              auth_level: "GENERAL_PUBLIC",
              stance: "BACKS",
              code: 200,
            },
          ]);
        }}
      />

      <ResolveInquiryModal
        inquiryId={id}
        sourceCount={sources.length}
        isOpen={isResolveOpen}
        onClose={() => setIsResolveOpen(false)}
        onSuccess={(v) => {
          setJudge(v);
          setStage("AGREED");
        }}
      />
    </div>
  );
}

export default function InquiryDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500">Loading Inquiry Details...</div>}>
      <InquiryDetailContent />
    </Suspense>
  );
}
