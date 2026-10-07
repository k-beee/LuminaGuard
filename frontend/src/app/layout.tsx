import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Shield, Home, List, PlusCircle, ExternalLink, Activity } from "lucide-react";
import { WalletProvider } from "@/context/WalletContext";
import { WalletControl } from "@/components/WalletControl";
import { LUMINA_CONTRACT_ADDRESS, EXPLORER_URL } from "@/config/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LuminaGuard | Intelligent Fact Adjudication",
  description: "Decentralized Truth Evaluation via GenVM and LLM Consensus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased`}>
        <WalletProvider>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="h-16 flex items-center px-6 border-b border-zinc-800">
                  <Shield className="w-6 h-6 text-emerald-500 mr-3" />
                  <span className="font-extrabold text-lg tracking-tight text-white">
                    Lumina<span className="text-emerald-400">Guard</span>
                  </span>
                </div>

                <nav className="py-6 px-4 space-y-1.5">
                  <Link
                    href="/"
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/60 font-medium text-sm transition-colors"
                  >
                    <Home className="w-4 h-4 text-emerald-400" />
                    <span>Command Center</span>
                  </Link>
                  <Link
                    href="/inquiries"
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/60 font-medium text-sm transition-colors"
                  >
                    <List className="w-4 h-4 text-blue-400" />
                    <span>Inquiries Explorer</span>
                  </Link>
                  <Link
                    href="/create"
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/60 font-medium text-sm transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 text-purple-400" />
                    <span>Declare Inquiry</span>
                  </Link>
                </nav>
              </div>

              <div className="p-4 border-t border-zinc-800 space-y-3">
                <a
                  href={`${EXPLORER_URL}/address/${LUMINA_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors text-xs text-zinc-400 group"
                >
                  <div>
                    <p className="font-semibold text-zinc-300 group-hover:text-emerald-400 transition-colors">
                      GenLayer Studio
                    </p>
                    <p className="font-mono text-[10px] text-zinc-500">
                      {LUMINA_CONTRACT_ADDRESS.slice(0, 6)}...{LUMINA_CONTRACT_ADDRESS.slice(-4)}
                    </p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
                </a>

                <div className="text-[11px] text-zinc-500 text-center font-mono">
                  v2.0.0 • StudioNet Live
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              {/* Global Persistent Top Header */}
              <header className="h-16 flex-shrink-0 bg-zinc-900/60 backdrop-blur border-b border-zinc-800 px-8 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>StudioNet (61999)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <WalletControl />
                </div>
              </header>

              {/* Scrollable Page Body */}
              <main className="flex-1 overflow-y-auto bg-zinc-950">
                {children}
              </main>
            </div>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
