
import React, { useState, useEffect } from 'react';
import AuthScreen from '../components/AuthScreen';
import Dashboard from '../components/Dashboard';
import ChannelViewer from '../components/ChannelViewer';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'viewer' | 'dashboard'>('viewer');

  useEffect(() => {
    // Check if user should be remembered
    const rememberedAuth = localStorage.getItem('remember-auth');
    const expiryDate = localStorage.getItem('remember-auth-expiry');
    
    if (rememberedAuth === 'true' && expiryDate) {
      const expiry = new Date(expiryDate);
      const now = new Date();
      
      if (now < expiry) {
        // Still within remember period
        setIsAuthenticated(true);
      } else {
        // Expired, clear remember data
        localStorage.removeItem('remember-auth');
        localStorage.removeItem('remember-auth-expiry');
      }
    }
  }, []);

  const handleAdminAccess = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Clear remember data on explicit logout
    localStorage.removeItem('remember-auth');
    localStorage.removeItem('remember-auth-expiry');
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
          onLogout={handleLogout}
        />
      ) : (
        <ChannelViewer onAdminAccess={handleAdminAccess} />
      )}
    </div>
  );
};

export default Index;
