"use client";

import { useState } from 'react';
import { Layout } from '../components/Layout';
import { AuthView } from '../views/AuthView';
import { DashboardView } from '../views/DashboardView';
import { AnalysisLabView } from '../views/AnalysisLabView';
import { VaultView } from '../views/VaultView';
import {ForensicDropzone} from '../components/ForensicDropzone';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  if (!isAuthenticated) return <AuthView onLogin={() => setIsAuthenticated(true)} />;

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
    <Layout currentView={currentView} onNavigate={setCurrentView} onLogout={() => { setIsAuthenticated(false); setCurrentView('dashboard'); }}>
      {renderView()}
    </Layout>
  );
}

