"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useWallet } from "@/context/WalletContext";
import { getActiveWriteClient, liveAddSourceMaterial } from "@/lib/genlayer";
import { EXPLORER_URL } from "@/config/constants";
import { Globe, X, PlusCircle, Check, Loader2, ExternalLink } from "lucide-react";

interface AddSourceModalProps {
  inquiryId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newSourceUrl: string) => void;
}

export function AddSourceModal({ inquiryId, isOpen, onClose, onSuccess }: AddSourceModalProps) {
  const { address, provider, signerAccount } = useWallet();
  const [url, setUrl] = useState("");
  const [contextNote, setContextNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTxHash(null);

    if (!url.startsWith("https://")) {
      setError("Source URL must start with secure https:// protocol.");
      return;
    }

    setLoading(true);
    try {
      const activeAccount = signerAccount || address;
      const client = getActiveWriteClient(activeAccount, provider);

      const result = await liveAddSourceMaterial(client, inquiryId, url, contextNote);
      setTxHash(result.hash);

      setTimeout(() => {
        onSuccess(url);
        setUrl("");
        setContextNote("");
        onClose();
      }, 1500);
    } catch (err: unknown) {
      console.error("Evidence submission failed:", err);
      const errorMsg = (err as Error).message || "Failed to register evidence on GenLayer StudioNet";
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
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Attach Evidence on StudioNet</h3>
            <p className="text-xs text-zinc-400 font-mono">Inquiry: {inquiryId}</p>
          </div>
        </div>

        <p className="text-xs text-zinc-400 mb-4">
          Submitting this URL records a permanent reference on-chain. GenVM validator nodes will independently crawl this document during the consensus round.
        </p>

        {error && (
          <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 rounded text-rose-400 text-xs">
            {error}
          </div>
        )}

        {txHash && (
          <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-xs flex items-center justify-between">
            <span>Evidence Recorded on StudioNet!</span>
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
              Public URL (HTTPS)
            </label>
            <Input
              type="url"
              placeholder="https://www.reuters.com/business/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Context / Relevance Note
            </label>
            <Textarea
              placeholder="Explain where in the article the relevant statement or proof appears..."
              value={contextNote}
              onChange={(e) => setContextNote(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <Button type="button" variant="outline" onClick={onClose} className="border-zinc-700">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Recording on Chain..." : "Submit Source"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
