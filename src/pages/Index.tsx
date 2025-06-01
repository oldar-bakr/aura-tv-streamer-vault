
import React, { useState, useEffect } from 'react';
import AuthScreen from '../components/AuthScreen';
import Dashboard from '../components/Dashboard';
import ChannelViewer from '../components/ChannelViewer';
import { M3ULink } from '../types/M3ULink';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'viewer' | 'dashboard'>('viewer');
  const [m3uLinks, setM3uLinks] = useState<M3ULink[]>([]);

  useEffect(() => {
    // Load M3U links from localStorage
    const savedLinks = localStorage.getItem('m3u-links');
    if (savedLinks) {
      setM3uLinks(JSON.parse(savedLinks));
    } else {
      // Add working M3U links as default
      const demoLinks: M3ULink[] = [
        {
          id: '1',
          name: 'IPTV-ORG Global',
          url: 'https://iptv-org.github.io/iptv/index.m3u',
          category: 'Global',
          description: 'Global TV channels from IPTV-ORG',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Free-TV Sample',
          url: 'https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8',
          category: 'International',
          description: 'International free TV channels',
          createdAt: new Date().toISOString()
        }
      ];
      setM3uLinks(demoLinks);
      localStorage.setItem('m3u-links', JSON.stringify(demoLinks));
    }
  }, []);

  const saveLinks = (links: M3ULink[]) => {
    setM3uLinks(links);
    localStorage.setItem('m3u-links', JSON.stringify(links));
  };

  const addM3ULink = (link: Omit<M3ULink, 'id'>) => {
    const newLink: M3ULink = {
      ...link,
      id: Date.now().toString(),
    };
    const updatedLinks = [...m3uLinks, newLink];
    saveLinks(updatedLinks);
  };

  const updateM3ULink = (id: string, updatedLink: Omit<M3ULink, 'id'>) => {
    const updatedLinks = m3uLinks.map(link => 
      link.id === id ? { ...updatedLink, id } : link
    );
    saveLinks(updatedLinks);
  };

  const deleteM3ULink = (id: string) => {
    const updatedLinks = m3uLinks.filter(link => link.id !== id);
    saveLinks(updatedLinks);
  };

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
          m3uLinks={m3uLinks}
          onAddLink={addM3ULink}
          onUpdateLink={updateM3ULink}
          onDeleteLink={deleteM3ULink}
          onViewChannels={() => setCurrentView('viewer')}
          onLogout={() => setIsAuthenticated(false)}
        />
      ) : (
        <ChannelViewer
          m3uLinks={m3uLinks}
          onAdminAccess={handleAdminAccess}
        />
      )}
    </div>
  );
};

export default Index;
