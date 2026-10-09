"use client";

import React, { useState, useEffect } from "react";
import { Inquiry } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StageBadge, JudgementBadge, CategoryBadge } from "@/components/InquiryBadges";
import { fetchAllInquiryIds, fetchLiveContractInquiry } from "@/lib/genlayer";
import { Search, Filter, PlusCircle, ArrowRight, ShieldCheck, Flame, Coins, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";

export default function InquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState<string>("ALL");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      // Strictly canonical: fetch inquiry IDs and records directly from deployed contract
      const onChainIds = await fetchAllInquiryIds();
      const onChainInquiries: Inquiry[] = [];

      for (const id of onChainIds) {
        const item = await fetchLiveContractInquiry(id);
        if (item) {
          onChainInquiries.push(item);
        }
      }

      setInquiries(onChainInquiries);
    } catch (err) {
      console.warn("Failed loading live inquiries from contract:", err);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filtered = inquiries.filter((item) => {
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
            Live public claims registered on LuminaGuard and verified by GenVM validators.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={loadAll}
            disabled={loading}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 gap-1.5 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Chain
          </Button>
          <Link href="/create">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 text-xs">
              <PlusCircle className="w-4 h-4" />
              Declare Inquiry
            </Button>
          </Link>
        </div>
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
