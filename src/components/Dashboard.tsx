
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Play, Settings, LogOut, Edit, Trash2, Globe, Users, TrendingUp, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface DashboardProps {
  user: User;
  onViewChannels: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onViewChannels }) => {
  const [stats, setStats] = useState({
    totalChannels: 0,
    totalUsers: 0,
    totalFavorites: 0,
    totalWatchTime: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Get total channels
      const { count: channelsCount } = await supabase
        .from('channels')
        .select('*', { count: 'exact', head: true });

      // Get total users (profiles)
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total favorites
      const { count: favoritesCount } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true });

      // Get watch history count as proxy for watch time
      const { count: watchHistoryCount } = await supabase
        .from('watch_history')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalChannels: channelsCount || 0,
        totalUsers: usersCount || 0,
        totalFavorites: favoritesCount || 0,
        totalWatchTime: watchHistoryCount || 0
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "See you soon!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2">
            <img 
              src="/lovable-uploads/ad949cec-30d7-4c18-af96-017ab163ef46.png" 
              alt="MEDOIL Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Medoil IPTV Dashboard</h1>
            <p className="text-purple-200">Welcome back, {user.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={onViewChannels}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 h-auto"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch TV
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/20 px-6 py-3 h-auto"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Total Channels</p>
                <p className="text-3xl font-bold text-white">{stats.totalChannels}</p>
              </div>
              <Play className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Total Favorites</p>
                <p className="text-3xl font-bold text-white">{stats.totalFavorites}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Watch Sessions</p>
                <p className="text-3xl font-bold text-white">{stats.totalWatchTime}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Play className="w-5 h-5 mr-2 text-green-400" />
              Channel Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-200 mb-4">Manage your IPTV channels and playlists</p>
            <Button
              onClick={onViewChannels}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Go to TV Interface
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              User Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-200 mb-4">View user engagement and statistics</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Settings className="w-5 h-5 mr-2 text-purple-400" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-200 mb-4">Configure system preferences and settings</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Open Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-purple-500/30 pt-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center p-1">
              <img 
                src="/lovable-uploads/ad949cec-30d7-4c18-af96-017ab163ef46.png" 
                alt="MEDOIL Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-purple-200 text-sm">MEDOIL Istanbul - Mediterranean Oil Services</span>
          </div>
          <p className="text-purple-300 text-xs mb-2">
            Advanced IPTV Management Dashboard - Powered by Supabase
          </p>
          <p className="text-purple-400 text-xs">
            Professional streaming platform with cloud-based user management and analytics
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
