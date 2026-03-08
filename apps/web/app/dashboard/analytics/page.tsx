import { BarChart2, TrendingUp, TrendingDown, MousePointer2, UserPlus, Zap } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
    const stats = [
        { label: "Total Scans", val: "4,821", icon: BarChart2, trend: "+12.4%", up: true },
        { label: "Click Through Rate", val: "3.2%", icon: MousePointer2, trend: "-0.5%", up: false },
        { label: "Qualified Leads", val: "182", icon: UserPlus, trend: "+22.1%", up: true },
    ];

    const barData = [40, 60, 45, 90, 70, 50, 85, 95, 60, 40, 30];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];

    const sourceLog = [
        { source: "reddit/r/startups", time: "2m ago", status: "OK" },
        { source: "news.ycombinator.com", time: "14m ago", status: "OK" },
        { source: "reddit/r/SaaS", time: "28m ago", status: "OK" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-lg font-semibold text-white">Analytics</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Performance overview — last 30 days</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-[#111113] border border-zinc-800 rounded-lg p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{stat.label}</p>
                                <p className="text-2xl font-semibold text-white mt-2">{stat.val}</p>
                            </div>
                            <stat.icon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        </div>
                        <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${stat.up ? "text-green-400" : "text-red-400"}`}>
                            {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {stat.trend} vs last month
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart + Sidebar */}
            <div className="grid lg:grid-cols-3 gap-4">
                {/* Bar chart */}
                <div className="lg:col-span-2 bg-[#111113] border border-zinc-800 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-white">Opportunity Volume</h2>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                                <span className="w-2 h-2 rounded-sm bg-amber-500" /> Reddit
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                                <span className="w-2 h-2 rounded-sm bg-zinc-600" /> HN
                            </span>
                        </div>
                    </div>
                    <div className="flex items-end justify-between gap-1.5 h-40">
                        {barData.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex flex-col justify-end" style={{ height: "100%" }}>
                                    <div
                                        className="w-full bg-amber-600/80 hover:bg-amber-500 transition-colors rounded-sm"
                                        style={{ height: `${h}%` }}
                                    />
                                </div>
                                <span className="text-[9px] text-zinc-700 font-mono">{days[i]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
                        <div className="text-center">
                            <p className="text-xs text-zinc-600 uppercase tracking-wider">Total</p>
                            <p className="text-sm font-semibold text-white mt-1">14,204</p>
                        </div>
                        <div className="w-px h-8 bg-zinc-800" />
                        <div className="text-center">
                            <p className="text-xs text-zinc-600 uppercase tracking-wider">Conversion</p>
                            <p className="text-sm font-semibold text-white mt-1">2.4%</p>
                        </div>
                        <div className="w-px h-8 bg-zinc-800" />
                        <div className="text-center">
                            <p className="text-xs text-zinc-600 uppercase tracking-wider">Scan Accuracy</p>
                            <p className="text-sm font-semibold text-amber-400 mt-1">92%</p>
                        </div>
                    </div>
                </div>

                {/* Source log + upsell */}
                <div className="space-y-4">
                    <div className="bg-[#111113] border border-zinc-800 rounded-lg p-5">
                        <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">Source Log</h3>
                        <div className="space-y-3">
                            {sourceLog.map((log) => (
                                <div key={log.source} className="flex items-center justify-between text-xs">
                                    <span className="font-mono text-zinc-400 truncate max-w-[140px]">{log.source}</span>
                                    <span className="text-zinc-600 mx-2 shrink-0">{log.time}</span>
                                    <span className="text-green-400 font-medium shrink-0">{log.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-5">
                        <Zap className="h-5 w-5 text-amber-500 mb-3" />
                        <h3 className="text-sm font-semibold text-white mb-1">Scale your reach</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                            Enterprise plan includes real-time scanning, dedicated support, and team access.
                        </p>
                        <button className="w-full h-8 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-md transition-colors">
                            Request Upgrade
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
