import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Shield, Home, List, PlusCircle, Settings } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LuminaGuard | Intelligent Fact Adjudication",
  description: "Decentralized Truth Evaluation via GenVM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-zinc-800">
              <Shield className="w-6 h-6 text-emerald-500 mr-3" />
              <span className="font-bold text-lg tracking-tight">LuminaGuard</span>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              <Link href="/" className="flex items-center space-x-3 px-3 py-2.5 bg-zinc-800/50 rounded-lg text-emerald-400 font-medium">
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link href="/inquiries" className="flex items-center space-x-3 px-3 py-2.5 hover:bg-zinc-800/50 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors">
                <List className="w-5 h-5" />
                <span>All Inquiries</span>
              </Link>
              <Link href="/create" className="flex items-center space-x-3 px-3 py-2.5 hover:bg-zinc-800/50 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors">
                <PlusCircle className="w-5 h-5" />
                <span>New Inquiry</span>
              </Link>
            </nav>
            
            <div className="p-4 border-t border-zinc-800">
              <div className="flex items-center space-x-3 px-3 py-2 hover:bg-zinc-800/50 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-zinc-950">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
