"use client";

import React from "react";
import { Shield, Activity, Users, Zap, ExternalLink, ArrowRight, CheckCircle2, Flame, Scale, Lock, Wallet, LogOut } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LUMINA_CONTRACT_ADDRESS, EXPLORER_URL } from "@/config/constants";
import { useWallet } from "@/context/WalletContext";
import { WalletControl } from "@/components/WalletControl";
import { fetchAllInquiryIds, fetchLiveContractInquiry } from "@/lib/genlayer";
import { Inquiry } from "@/lib/types";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const { address, isConnected, isMetaMask, disconnect } = useWallet();
  const [liveActivities, setLiveActivities] = useState<Inquiry[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      try {
        const ids = await fetchAllInquiryIds();
        const onChain: Inquiry[] = [];
        for (const id of ids.slice(-5).reverse()) {
          const inq = await fetchLiveContractInquiry(id);
          if (inq) onChain.push(inq);
        }
        setLiveActivities(onChain.slice(0, 5));
      } catch (e) {
        console.warn("Could not load recent activities:", e);
        setLiveActivities([]);
      } finally {
        setLoadingActivities(false);
      }
    }
    loadActivities();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            GenLayer StudioNet Connected • Chain ID: 61999
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            LuminaGuard <span className="text-emerald-400">Command</span> Center
          </h1>
          <p className="text-zinc-400 text-base max-w-2xl leading-relaxed">
            Live decentralized fact adjudication powered by GenVM non-deterministic consensus, prompt fencing, and deterministic cryptographic settlement.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link href="/create">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 shadow-lg shadow-emerald-950">
              <Zap className="w-4 h-4" />
              Declare New Inquiry
            </Button>
          </Link>
          <a
            href={`${EXPLORER_URL}/address/${LUMINA_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 gap-2 w-full">
              <span>Inspect Contract</span>
              <ExternalLink className="w-4 h-4 text-emerald-400" />
            </Button>
          </a>
        </div>
      </div>

      {/* Live Wallet Connection Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-emerald-400 animate-ping" : "bg-zinc-600"}`}></div>
          <span className="text-zinc-400">Wallet Status:</span>
          {isConnected && address ? (
            <>
              <span className="font-mono text-zinc-200 font-semibold">{address}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${isMetaMask ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-purple-500/10 text-purple-300 border border-purple-500/20"}`}>
                {isMetaMask ? "MetaMask Web3" : "Direct StudioNet Signer"}
              </span>
            </>
          ) : (
            <span className="text-zinc-500 italic">No wallet connected</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <WalletControl />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Activity className="w-6 h-6 text-blue-400" />}
          title="Active Inquiries"
          value="Live"
          subtitle="Querying StudioNet contract"
        />
        <StatCard
          icon={<Shield className="w-6 h-6 text-emerald-400" />}
          title="Consensus Verified"
          value="100%"
          subtitle="GenVM quorum agreement"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-purple-400" />}
          title="GenVM Validators"
          value="5"
          subtitle="Multi-validator panel"
        />
        <StatCard
          icon={<Zap className="w-6 h-6 text-amber-400" />}
          title="Contract Vault"
          value={`${LUMINA_CONTRACT_ADDRESS.slice(0, 6)}...${LUMINA_CONTRACT_ADDRESS.slice(-4)}`}
          subtitle="StudioNet Escrow Active"
        />
      </div>

      {/* Interactive Dragon Flow Pipeline */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Flame className="w-5 h-5 text-emerald-400" />
            The LuminaGuard Adjudication Pipeline
          </CardTitle>
          <CardDescription>
            How unstructured web evidence becomes tamper-proof, finalized state on GenLayer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>01. Structure & Freeze</span>
                <Lock className="w-4 h-4" />
              </div>
              <p className="text-zinc-400">
                Claim is defined with subject, predicate, and target metric. Policy and authorized domains are locked permanently.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-blue-400 font-bold">
                <span>02. Evidence Gathering</span>
                <Shield className="w-4 h-4" />
              </div>
              <p className="text-zinc-400">
                Community attaches public HTTPS URLs. Anyone can participate and qualify for the escrow bounty.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-purple-400 font-bold">
                <span>03. Non-Det Consensus</span>
                <Users className="w-4 h-4" />
              </div>
              <p className="text-zinc-400">
                Validators independently crawl pages, extract quotes, enforce prompt fences, and hash decisive readings.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>04. Deterministic Settle</span>
                <Scale className="w-4 h-4" />
              </div>
              <p className="text-zinc-400">
                Deterministic code computes VERIFIED / REFUTED. Reward releases automatically once the appeal window closes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recent Protocol Activity</h2>
          <Link href="/inquiries" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
            View All Inquiries <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {loadingActivities ? (
            <div className="p-6 text-center text-xs text-zinc-500 font-mono bg-zinc-900 border border-zinc-800 rounded-xl">
              Querying GenLayer StudioNet contract state...
            </div>
          ) : liveActivities.length > 0 ? (
            liveActivities.map((inq) => {
              const isVerified = inq.final_judge === "VERIFIED";
              const isDebunked = inq.final_judge === "DEBUNKED";
              const badge = inq.final_judge || inq.stage;
              const badgeColor = isVerified
                ? "bg-emerald-500/10 text-emerald-400"
                : isDebunked
                ? "bg-rose-500/10 text-rose-400"
                : inq.stage === "HAS_SOURCES"
                ? "bg-purple-500/10 text-purple-400"
                : "bg-blue-500/10 text-blue-400";
              return (
                <Link key={inq.inquiry_id} href={`/inquiries/${inq.inquiry_id}`} className="block">
                  <ActivityRow
                    badge={badge}
                    badgeColor={badgeColor}
                    title={`${inq.inquiry_id}: ${inq.topic}`}
                    time={inq.stage === "COMPLETED" ? "Settled" : inq.stage === "AGREED" ? "Agreed" : "Active"}
                  />
                </Link>
              );
            })
          ) : (
            <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-xs">
              <p>No active inquiries registered on this contract yet.</p>
              <Link href="/create" className="text-emerald-400 hover:underline mt-2 inline-block font-semibold">
                Declare the first live inquiry &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
          <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">{icon}</div>
        </div>
        <p className="text-2xl font-black text-white tracking-tight">{value}</p>
        <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function ActivityRow({
  badge,
  badgeColor,
  title,
  time,
}: {
  badge: string;
  badgeColor: string;
  title: string;
  time: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
      <div className="flex items-center gap-3">
        <span className={`text-[10px] font-bold px-2 py-1 rounded font-mono uppercase tracking-wider ${badgeColor}`}>
          {badge}
        </span>
        <span className="text-sm text-zinc-200">{title}</span>
      </div>
      <span className="text-xs text-zinc-500 font-mono whitespace-nowrap">{time}</span>
    </div>
  );
}
