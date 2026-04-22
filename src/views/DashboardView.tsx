import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ShieldAlert, FileCode, Search, CheckCircle2 } from "lucide-react";

export function DashboardView() {
  const chartData = [
    { time: '00', nominal: 20 },
    { time: '01', nominal: 25 },
    { time: '02', nominal: 22 },
    { time: '03', nominal: 40 },
    { time: '04', nominal: 58 },
    { time: '05', nominal: 45 },
    { time: '06', nominal: 30, anomaly: 0 },
    { time: '07', nominal: 18, anomaly: 20 },
    { time: '08', nominal: 55, anomaly: 85 },
    { time: '09', nominal: 90, anomaly: 35 },
    { time: '10', nominal: 60 },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-8">
      <section className="relative bg-[#121212] rounded border border-white/10 p-12 overflow-hidden flex flex-col justify-center items-start min-h-[300px]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-background to-background pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-heading text-5xl font-bold text-white mb-4">Uncover the <span className="text-primary drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">Unseen.</span></h1>
          <p className="font-sans text-lg text-zinc-400 mb-8 max-w-xl">
            Real-time deepfake detection and synthetic media analysis. Monitor digital frontiers with absolute precision.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-primary text-black font-mono font-bold text-sm uppercase rounded shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan-300 transition-colors tracking-widest outline-none">
              Initialize Analysis
            </button>
            <button className="px-8 py-4 border border-zinc-500 text-white font-mono font-bold text-sm uppercase rounded hover:border-primary hover:text-primary transition-colors inner-glow-cyan tracking-widest outline-none bg-transparent">
              View Logs
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121212] rounded border border-white/10 p-6 relative overflow-hidden group hover:bg-[#1A1A1A] transition-colors hover:border-primary/50 cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <span className="font-sans font-semibold text-xs uppercase tracking-wider text-zinc-500">Files Analyzed</span>
            <FileCode className="text-primary" size={20} />
          </div>
          <div className="font-mono text-4xl font-bold text-white mb-2 tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">142,893</div>
          <div className="flex items-center gap-2 font-mono text-xs text-primary">
            <span>+12.4% / 24h</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 group-hover:bg-primary/20 transition-colors"></div>
        </div>

        <div className="bg-[#121212] rounded border border-white/10 p-6 relative overflow-hidden group hover:bg-[#1A1A1A] transition-colors hover:border-error/50 cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <span className="font-sans font-semibold text-xs uppercase tracking-wider text-zinc-500">Threats Detected</span>
            <ShieldAlert className="text-error" size={20} />
          </div>
          <div className="font-mono text-4xl font-bold text-error mb-2 tracking-tighter drop-shadow-[0_0_8px_rgba(255,42,42,0.2)]">847</div>
          <div className="flex items-center gap-2 font-mono text-xs text-error">
            <span>Critical Alert: 3 Active</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 group-hover:bg-error/20 transition-colors"></div>
        </div>

        <div className="bg-[#121212] rounded border border-white/10 p-6 relative overflow-hidden group hover:bg-[#1A1A1A] transition-colors hover:border-success/50 cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <span className="font-sans font-semibold text-xs uppercase tracking-wider text-zinc-500">System Accuracy</span>
            <CheckCircle2 className="text-success" size={20} />
          </div>
          <div className="font-mono text-4xl font-bold text-success mb-2 tracking-tighter drop-shadow-[0_0_8px_rgba(0,255,102,0.2)]">99.8%</div>
          <div className="flex items-center gap-2 font-mono text-xs text-success">
            <span>Optimal Performance</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 group-hover:bg-success/20 transition-colors"></div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        <div className="lg:col-span-2 bg-[#121212] rounded border border-white/10 flex flex-col overflow-hidden relative">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-950/50">
            <h3 className="font-heading text-lg font-semibold text-white uppercase tracking-wide">Anomaly Detection Timeline</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 font-mono text-xs text-primary bg-primary/10 rounded border border-primary/30 outline-none">1H</button>
              <button className="px-3 py-1 font-mono text-xs text-zinc-500 hover:text-zinc-300 rounded outline-none border border-transparent hover:bg-white/5">24H</button>
              <button className="px-3 py-1 font-mono text-xs text-zinc-500 hover:text-zinc-300 rounded outline-none border border-transparent hover:bg-white/5">7D</button>
            </div>
          </div>
          <div className="flex-1 p-6 relative bg-[linear-gradient(to_bottom,rgba(0,240,255,0.05),transparent)]">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNominal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'Space Grotesk'}} />
                <Area type="monotone" dataKey="nominal" stroke="#00F0FF" strokeWidth={2} fillOpacity={1} fill="url(#colorNominal)" />
                <Area type="monotone" dataKey="anomaly" stroke="#FF2A2A" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#121212] rounded border border-white/10 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-950/50">
            <h3 className="font-heading text-lg font-semibold text-white uppercase tracking-wide">Live Intercepts</h3>
            <span className="flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_#00F0FF] animate-pulse"></span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            
            <div className="p-3 border border-error/30 bg-error/5 rounded flex gap-3 items-start hover:bg-error/10 transition-colors">
              <ShieldAlert className="text-error mt-0.5" size={18} />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs text-error font-bold tracking-wide">Deepfake Audio Detected</span>
                  <span className="font-mono text-[10px] text-zinc-500">NOW</span>
                </div>
                <p className="font-sans text-xs text-zinc-400 truncate">Target: Executive Voice Clone Attempt</p>
              </div>
            </div>

            <div className="p-3 border border-white/10 bg-white/5 rounded flex gap-3 items-start hover:bg-white/10 transition-colors">
              <Search className="text-primary mt-0.5" size={18} />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs text-primary font-bold tracking-wide">Metadata Anomaly</span>
                  <span className="font-mono text-[10px] text-zinc-500">-2m</span>
                </div>
                <p className="font-sans text-xs text-zinc-400 truncate">Source: Inbound Marketing Asset</p>
              </div>
            </div>

            <div className="p-3 border border-white/10 bg-white/5 rounded flex gap-3 items-start hover:bg-white/10 transition-colors">
              <CheckCircle2 className="text-zinc-500 mt-0.5" size={18} />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs text-white font-bold tracking-wide">Scan Complete</span>
                  <span className="font-mono text-[10px] text-zinc-500">-15m</span>
                </div>
                <p className="font-sans text-xs text-zinc-400 truncate">Batch 84-A processed successfully</p>
              </div>
            </div>

          </div>
          <div className="p-3 border-t border-white/10 bg-zinc-950 text-center">
            <button className="font-mono text-xs font-bold text-primary hover:text-cyan-300 uppercase tracking-widest outline-none transition-colors bg-transparent border-none">View All Logs</button>
          </div>
        </div>
      </section>
    </div>
  );
}
