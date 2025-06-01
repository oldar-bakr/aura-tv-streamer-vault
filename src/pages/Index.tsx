
import React, { useState } from 'react';
import AuthScreen from '../components/AuthScreen';
import Dashboard from '../components/Dashboard';
import ChannelViewer from '../components/ChannelViewer';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'viewer' | 'dashboard'>('viewer');

  const handleAdminAccess = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  if (!isAuthenticated && currentView === 'dashboard') {
    return <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {currentView === 'dashboard' && isAuthenticated ? (
        <Dashboard
          m3uLinks={[]}
          onAddLink={() => {}}
          onUpdateLink={() => {}}
          onDeleteLink={() => {}}
          onViewChannels={() => setCurrentView('viewer')}
          onLogout={() => setIsAuthenticated(false)}
        />
      ) : (
        <ChannelViewer onAdminAccess={handleAdminAccess} />
      )}
    </div>
  );
};

export default Index;
