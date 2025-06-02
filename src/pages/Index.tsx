
import React, { useState, useEffect } from 'react';
import AuthScreen from '../components/AuthScreen';
import Dashboard from '../components/Dashboard';
import TVInterface from '../components/TVInterface';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'tv' | 'dashboard'>('tv');
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome to Medoil IPTV! 🎉",
            description: "Enjoy your personalized streaming experience",
          });
        }
        
        if (event === 'SIGNED_OUT') {
          toast({
            title: "See you soon!",
            description: "You've been signed out successfully",
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleAdminAccess = () => {
    setCurrentView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-red-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Loading Medoil IPTV...</h2>
        </div>
      </div>
    );
  }

  if (!user && currentView === 'dashboard') {
    return <AuthScreen onBack={() => setCurrentView('tv')} />;
  }

  return (
    <>
      {currentView === 'dashboard' && user ? (
        <Dashboard
          user={user}
          onViewChannels={() => setCurrentView('tv')}
        />
      ) : (
        <TVInterface 
          user={user} 
          onAdminAccess={handleAdminAccess} 
        />
      )}
    </>
  );
};

export default Index;
