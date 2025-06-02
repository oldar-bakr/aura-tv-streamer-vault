
import React, { useState, useEffect } from 'react';
import AuthScreen from '../components/AuthScreen';
import Dashboard from '../components/Dashboard';
import TVInterface from '../components/TVInterface';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'tv' | 'dashboard'>('tv');

  useEffect(() => {
    // Check if user should be remembered
    const rememberedAuth = localStorage.getItem('medoil-remember-auth');
    const expiryDate = localStorage.getItem('medoil-remember-auth-expiry');
    
    if (rememberedAuth === 'true' && expiryDate) {
      const expiry = new Date(expiryDate);
      const now = new Date();
      
      if (now < expiry) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('medoil-remember-auth');
        localStorage.removeItem('medoil-remember-auth-expiry');
      }
    }
  }, []);

  const handleAdminAccess = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('medoil-remember-auth');
    localStorage.removeItem('medoil-remember-auth-expiry');
  };

  if (!isAuthenticated && currentView === 'dashboard') {
    return <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <>
      {currentView === 'dashboard' && isAuthenticated ? (
        <Dashboard
          m3uLinks={[]}
          onAddLink={() => {}}
          onUpdateLink={() => {}}
          onDeleteLink={() => {}}
          onViewChannels={() => setCurrentView('tv')}
          onLogout={handleLogout}
        />
      ) : (
        <TVInterface onAdminAccess={handleAdminAccess} />
      )}
    </>
  );
};

export default Index;
