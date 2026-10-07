import { Shield, Activity, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">LuminaGuard Command Center</h1>
        <p className="text-zinc-400 text-lg">Monitor, verify, and resolve claims with consensus-driven AI.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<Activity className="w-6 h-6 text-blue-500" />} title="Active Inquiries" value="24" />
        <StatCard icon={<Shield className="w-6 h-6 text-emerald-500" />} title="Resolved Safely" value="156" />
        <StatCard icon={<Users className="w-6 h-6 text-purple-500" />} title="Validators" value="12" />
        <StatCard icon={<Zap className="w-6 h-6 text-amber-500" />} title="Total Bounties" value="$12.4k" />
      </div>

      {/* Main Panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-3 animate-pulse"></span>
          Live Network Activity
        </h2>
        <div className="space-y-4">
          <ActivityRow type="NEW_INQUIRY" title="Global Interest Rates Shift" time="2m ago" />
          <ActivityRow type="SOURCE_ADDED" title="Reuters API Data attached to INQ-00145" time="15m ago" />
          <ActivityRow type="RESOLVED" title="Tech Merger Finalized (INQ-00142) → VERIFIED" time="1h ago" />
          <ActivityRow type="BOUNTY" title="500 GL funded to INQ-00146" time="3h ago" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-start hover:border-zinc-700 transition-colors">
      <div className="p-3 bg-zinc-950 rounded-lg mb-4">{icon}</div>
      <p className="text-zinc-400 font-medium text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
    </div>
  )
}

function ActivityRow({ type, title, time }: { type: string, title: string, time: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className={`text-xs font-bold px-2 py-1 rounded ${type === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500' : type === 'NEW_INQUIRY' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-800 text-zinc-300'}`}>
          {type}
        </div>
        <span className="text-zinc-200">{title}</span>
      </div>
      <span className="text-zinc-500 text-sm">{time}</span>
    </div>
  )
}
