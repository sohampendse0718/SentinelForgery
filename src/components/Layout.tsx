import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface LayoutProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export function Layout({ children, currentView, onNavigate, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20 selection:text-primary">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <TopBar onLogout={onLogout} />
        <Sidebar currentView={currentView} onNavigate={onNavigate} />
        <main className="pt-16 md:pl-64 flex-1 flex flex-col p-6 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
