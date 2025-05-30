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
      // Add some demo links if none exist
      const demoLinks: M3ULink[] = [
        {
          id: '1',
          name: 'Entertainment Package',
          url: 'https://demo.com/entertainment.m3u',
          category: 'Entertainment',
          description: 'Movies and TV Shows',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Sports Package',
          url: 'https://demo.com/sports.m3u',
          category: 'Sports',
          description: 'Live Sports Channels',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'News Package',
          url: 'https://demo.com/news.m3u',
          category: 'News',
          description: 'International News',
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
