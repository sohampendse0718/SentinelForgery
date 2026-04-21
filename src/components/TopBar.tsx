import { Search, Bell, Shield, Settings } from "lucide-react";

interface TopBarProps {
  onLogout: () => void;
}

export function TopBar({ onLogout }: TopBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] font-mono tracking-tight">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold tracking-widest text-primary drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
          SENTINEL FORGERY AI
        </span>
      </div>

      <div className="flex-1 flex justify-end px-8 hidden md:flex">
        <div className="relative w-64">
          <input 
            type="text"
            placeholder="Search parameters..."
            className="w-full bg-surface text-white font-mono border-b border-white/10 focus:border-primary py-2 pl-8 pr-4 outline-none transition-colors placeholder:text-zinc-600"
          />
          <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600" />
        </div>
      </div>

      <div className="flex items-center gap-4 text-zinc-500">
        <button className="hover:text-primary hover:bg-white/5 transition-all duration-300 p-2 rounded hidden sm:block outline-none">
          <Bell size={20} strokeWidth={1.5} />
        </button>
        <button className="hover:text-primary hover:bg-white/5 transition-all duration-300 p-2 rounded hidden sm:block outline-none">
          <Shield size={20} strokeWidth={1.5} />
        </button>
        <button className="text-primary border-b-2 border-primary hover:bg-white/5 transition-all duration-300 p-2 rounded outline-none">
          <Settings size={20} strokeWidth={1.5} />
        </button>
        
        <button onClick={onLogout} className="h-8 w-8 rounded bg-surface border border-white/10 overflow-hidden ml-2 flex items-center justify-center inner-glow-cyan hover:border-primary transition-colors outline-none cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="Profile" 
            className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
          />
        </button>
      </div>
    </header>
  );
}
