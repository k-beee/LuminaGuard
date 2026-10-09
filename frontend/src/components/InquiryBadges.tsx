import React from "react";
import { Badge } from "./ui/badge";
import { Stage, Judgement, Stance, Category } from "@/lib/types";
import { ShieldCheck, ShieldAlert, Scale, Clock, Lock, CheckCircle2, AlertCircle } from "lucide-react";

export function StageBadge({ stage }: { stage: Stage }) {
  switch (stage) {
    case "PREP":
      return (
        <Badge variant="secondary" className="gap-1 font-mono">
          <Clock className="w-3 h-3 text-zinc-400" /> PREP (DRAFT)
        </Badge>
      );
    case "GATHERING":
      return (
        <Badge variant="warning" className="gap-1 font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Clock className="w-3 h-3" /> GATHERING
        </Badge>
      );
    case "HAS_SOURCES":
      return (
        <Badge variant="default" className="gap-1 font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Lock className="w-3 h-3" /> SOURCES READY
        </Badge>
      );
    case "AGREED":
    case "COMPLETED":
      return (
        <Badge variant="success" className="gap-1 font-mono">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> FINALIZED
        </Badge>
      );
    case "ABORTED":
      return (
        <Badge variant="destructive" className="gap-1 font-mono">
          <AlertCircle className="w-3 h-3" /> VOIDED
        </Badge>
      );
    default:
      return <Badge variant="outline">{stage}</Badge>;
  }
}

export function JudgementBadge({ judge }: { judge: Judgement | "" }) {
  if (!judge) return <span className="text-zinc-500 text-xs italic">Pending Adjudication</span>;

  switch (judge) {
    case "VERIFIED":
      return (
        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 gap-1.5 py-1 px-3 text-sm font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> VERIFIED TRUTH
        </Badge>
      );
    case "DEBUNKED":
      return (
        <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 gap-1.5 py-1 px-3 text-sm font-bold">
          <ShieldAlert className="w-4 h-4 text-rose-400" /> REFUTED / DEBUNKED
        </Badge>
      );
    case "CLASHING":
      return (
        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 gap-1.5 py-1 px-3 text-sm font-bold">
          <Scale className="w-4 h-4 text-purple-400" /> CONFLICTED
        </Badge>
      );
    case "LACKING":
      return (
        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 gap-1.5 py-1 px-3 text-sm font-bold">
          INSUFFICIENT EVIDENCE
        </Badge>
      );
    default:
      return <Badge variant="secondary">{judge}</Badge>;
  }
}

export function StanceBadge({ stance }: { stance: Stance | "" }) {
  switch (stance) {
    case "BACKS":
      return <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-xs">SUPPORTS</span>;
    case "DENIES":
      return <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded text-xs">CONTRADICTS</span>;
    case "QUIET":
      return <span className="text-zinc-400 font-medium bg-zinc-800 px-2 py-0.5 rounded text-xs">SILENT</span>;
    default:
      return <span className="text-zinc-500 text-xs italic bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">PENDING CONSENSUS</span>;
  }
}

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 border border-zinc-800 bg-zinc-900/90 px-2 py-0.5 rounded">
      {category.replace("_", " ")}
    </span>
  );
}
