import { Terminal, LayoutDashboard, Microscope, Archive, FileTerminal, HelpCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'analysis', label: 'Analysis Lab', icon: Microscope },
    { id: 'vault', label: 'The Vault', icon: Archive },
  ];

  return (
    <nav className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 z-40 hidden md:flex flex-col pt-8 bg-zinc-950/90 backdrop-blur-2xl border-r border-white/10 inner-glow-cyan font-mono font-medium">
      <div className="px-6 mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded border border-white/20 overflow-hidden bg-surface-bright flex items-center justify-center inner-glow-cyan">
             <Terminal className="text-primary" size={24} />
          </div>
          <div>
            <div className="text-white text-sm font-bold">Core Terminal</div>
            <div className="text-primary/70 text-xs">Vigilance Level 4</div>
          </div>
        </div>
        <button
           onClick={() => onNavigate('analysis')}
           className="mt-4 w-full py-2 bg-transparent border border-primary text-primary text-sm hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] hover:bg-primary/5 transition-all uppercase tracking-wider font-bold">
          Initialize Scan
        </button>
      </div>

      <div className="flex flex-col gap-1 flex-grow">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 transition-all outline-none",
                isActive 
                  ? "bg-primary/10 text-primary border-r-2 border-primary shadow-[0_0_15px_rgba(0,240,255,0.2)] translate-x-1" 
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 border-r-2 border-transparent"
              )}
            >
              <item.icon size={20} className={isActive ? "text-primary" : ""} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-1 pb-6 mt-auto border-t border-white/10 pt-4">
        <div className="px-6 py-2 text-xs text-zinc-600 font-bold uppercase tracking-wider">System</div>
        <button className="flex items-center gap-3 px-6 py-3 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-all text-left outline-none">
          <FileTerminal size={18} />
          <span className="text-xs uppercase tracking-wider">Security Log</span>
        </button>
        <button className="flex items-center gap-3 px-6 py-3 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-all text-left outline-none">
          <HelpCircle size={18} />
          <span className="text-xs uppercase tracking-wider">Support</span>
        </button>
      </div>
    </nav>
  );
}
