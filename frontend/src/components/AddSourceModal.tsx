"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Globe, X, PlusCircle, Check } from "lucide-react";

interface AddSourceModalProps {
  inquiryId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newSourceUrl: string) => void;
}

export function AddSourceModal({ inquiryId, isOpen, onClose, onSuccess }: AddSourceModalProps) {
  const [url, setUrl] = useState("");
  const [contextNote, setContextNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.startsWith("https://")) {
      setError("Source URL must start with secure https:// protocol.");
      return;
    }

    setLoading(true);
    try {
      // Simulate GenLayer transaction
      await new Promise((r) => setTimeout(r, 1000));
      onSuccess(url);
      setUrl("");
      setContextNote("");
      onClose();
    } catch (err) {
      console.error("Evidence submission failed:", err);
      setError("Failed to register evidence on GenLayer.");
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
            <h3 className="text-lg font-bold text-white">Attach Evidence Source</h3>
            <p className="text-xs text-zinc-400 font-mono">Inquiry: {inquiryId}</p>
          </div>
        </div>

        <p className="text-xs text-zinc-400 mb-4">
          Provide a publicly accessible web document. GenVM nodes will independently crawl this page, extract quotes, and evaluate stance.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Public URL (HTTPS)
            </label>
            <Input
              type="url"
              placeholder="https://www.reuters.com/business/aerospace-defense/..."
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

          {error && <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <Button type="button" variant="outline" onClick={onClose} className="border-zinc-700">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {loading ? "Recording on GenLayer..." : "Submit Source"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
