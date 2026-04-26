"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Layout } from '../components/Layout';
import { AuthView } from '../views/AuthView';
import { DashboardView } from '../views/DashboardView';
import { AnalysisLabView } from '../views/AnalysisLabView';
import { VaultView } from '../views/VaultView';
import {ForensicDropzone} from '../components/ForensicDropzone';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // 1. Check if they already have a key (e.g., right after Google redirects them back)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsCheckingAuth(false);
    });

    // 2. Keep an ear to the ground for any login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show a sleek terminal loading screen while we verify the keys
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020202] text-[#00f0ff] font-sans tracking-[0.2em] uppercase text-sm animate-pulse">
        Verifying Clearance...
      </div>
    );
  }

  // If no keys, bounce them to the login screen
  if (!isAuthenticated) return <AuthView onLogin={() => {}} />;

 const renderView = () => {
  switch (currentView) {
    case 'dashboard': 
      return <DashboardView />;
    case 'analysis': 
      return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
          {/* Your new tool sits at the top */}
        
          
          {/* Your original view sits below it */}
          <AnalysisLabView />
        </div>
      );
    case 'vault': 
      return <VaultView />;
    default: 
      return <div className="text-white">View not found</div>;
  }
};

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      onLogout={async () => { 
        await supabase.auth.signOut(); 
        setCurrentView('dashboard'); 
      }}
    >
      {renderView()}
    </Layout>
  );
}

