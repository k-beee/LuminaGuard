"use client";

import React, { useState } from "react";
import { Inquiry } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StageBadge, JudgementBadge, CategoryBadge } from "@/components/InquiryBadges";
import { Search, Filter, PlusCircle, ArrowRight, ShieldCheck, Flame, Coins } from "lucide-react";
import Link from "next/link";

const SAMPLE_INQUIRIES: Inquiry[] = [
  {
    inquiry_id: "INQ-00101",
    owner: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    category: "EVENT_OCCURRENCE",
    topic: "SpaceX Starship Flight 8 Splashdown",
    action: "Intact controlled splashdown in Indian Ocean",
    target_metric: "Intact Splashdown",
    human_desc: "Starship Flight 8 achieved orbital speed, survived peak atmospheric heating, and landed upright before ocean impact.",
    time_context: "2026-10-04T14:30:00Z",
    window_start: "2026-10-04T00:00:00Z",
    window_end: "2026-10-06T23:59:59Z",
    rule_set: "DIVERSE_SOURCES",
    gov_domains: ["spacex.com", "nasa.gov"],
    reg_domains: ["faa.gov"],
    min_total: 2,
    min_distinct: 2,
    stage: "AGREED",
    final_judge: "VERIFIED",
    created_at: "2026-10-04T15:00:00Z",
    locked_at: "2026-10-04T15:10:00Z",
    resolved_at: "2026-10-05T09:00:00Z",
    completed_at: "2026-10-05T09:30:00Z",
    source_ids: ["SRC-001", "SRC-002"],
    reward_wei: "25000000000000000000",
    reward_held: "25000000000000000000",
    reward_sponsor: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  },
  {
    inquiry_id: "INQ-00102",
    owner: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    category: "PUBLIC_DECLARATION",
    topic: "European Central Bank Rate Decision",
    action: "Reduced deposit facility rate by 25 bps to 3.25%",
    target_metric: "3.25%",
    human_desc: "ECB Governing Council decided to cut the key interest rate in response to falling inflation data.",
    time_context: "2026-10-02T12:15:00Z",
    window_start: "2026-10-02T00:00:00Z",
    window_end: "2026-10-04T23:59:59Z",
    rule_set: "STRICT_OFFICIAL",
    gov_domains: ["ecb.europa.eu"],
    reg_domains: [],
    min_total: 1,
    min_distinct: 1,
    stage: "HAS_SOURCES",
    final_judge: "",
    created_at: "2026-10-02T13:00:00Z",
    locked_at: "2026-10-02T13:15:00Z",
    resolved_at: "",
    completed_at: "",
    source_ids: ["SRC-003"],
    reward_wei: "10000000000000000000",
    reward_held: "10000000000000000000",
    reward_sponsor: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  },
  {
    inquiry_id: "INQ-00103",
    owner: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    category: "ENTITY_STATUS",
    topic: "Global Chipmaker Merger Approval",
    action: "Antitrust approval finalized without condition concessions",
    target_metric: "Unconditional Clearance",
    human_desc: "European Commission issues unconditional clearance for the semiconductor conglomerate acquisition.",
    time_context: "2026-09-30T10:00:00Z",
    window_start: "2026-09-30T00:00:00Z",
    window_end: "2026-10-05T23:59:59Z",
    rule_set: "REGULATOR_ONLY",
    gov_domains: [],
    reg_domains: ["ec.europa.eu"],
    min_total: 1,
    min_distinct: 1,
    stage: "GATHERING",
    final_judge: "",
    created_at: "2026-09-30T10:30:00Z",
    locked_at: "2026-09-30T11:00:00Z",
    resolved_at: "",
    completed_at: "",
    source_ids: [],
    reward_wei: "5000000000000000000",
    reward_held: "5000000000000000000",
    reward_sponsor: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  },
];

export default function InquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState<string>("ALL");

  const filtered = SAMPLE_INQUIRIES.filter((item) => {
    const matchesSearch =
      item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.inquiry_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.human_desc.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStage === "ALL") return true;
    if (filterStage === "FINALIZED") return item.stage === "AGREED" || item.stage === "COMPLETED";
    if (filterStage === "HAS_SOURCES") return item.stage === "HAS_SOURCES";
    if (filterStage === "GATHERING") return item.stage === "GATHERING" || item.stage === "PREP";
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Inquiries Explorer
          </h1>
          <p className="text-zinc-400">
            Browse and inspect all public claims registered on LuminaGuard and GenVM.
          </p>
        </div>
        <Link href="/create">
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
            <PlusCircle className="w-4 h-4" />
            Declare Inquiry
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
          <Input
            placeholder="Search inquiries by topic, keywords, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-zinc-900 border-zinc-800"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {["ALL", "HAS_SOURCES", "GATHERING", "FINALIZED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStage(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStage === tab
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiry Cards List */}
      <div className="space-y-4">
        {filtered.map((inq) => (
          <Card
            key={inq.inquiry_id}
            className="hover:border-zinc-700 transition-all hover:bg-zinc-900/90"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                      {inq.inquiry_id}
                    </span>
                    <CategoryBadge category={inq.category} />
                    <StageBadge stage={inq.stage} />
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {inq.topic}
                  </h3>

                  <p className="text-sm text-zinc-400 line-clamp-2">
                    {inq.human_desc}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-1">
                    <span>Target: <strong className="text-zinc-300">{inq.target_metric}</strong></span>
                    <span>•</span>
                    <span>Sources Attached: <strong className="text-zinc-300">{inq.source_ids.length}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Coins className="w-3.5 h-3.5" />
                      {(Number(inq.reward_wei) / 1e18).toFixed(0)} GEN Bounty
                    </span>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-800/80">
                  <JudgementBadge judge={inq.final_judge} />
                  <Link href={`/inquiries/${inq.inquiry_id}`}>
                    <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-zinc-300 gap-1.5 text-xs">
                      Inspect Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <p className="text-zinc-400 text-sm">No inquiries found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
