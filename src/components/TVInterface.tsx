
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Heart, Grid, Settings, Upload, Link, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { Channel } from '../types/M3ULink';
import { useToast } from '@/hooks/use-toast';
import { fetchM3U, parseM3U } from '../utils/m3uParser';

interface TVInterfaceProps {
  onAdminAccess: () => void;
}

const TVInterface: React.FC<TVInterfaceProps> = ({ onAdminAccess }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [favorites, setFavorites] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentView, setCurrentView] = useState<'channels' | 'favorites' | 'input'>('channels');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isPlaying, setIsPlaying] = useState(false);
  const [m3uInput, setM3uInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved data
    const savedChannels = localStorage.getItem('medoil-channels');
    const savedFavorites = localStorage.getItem('medoil-favorites');
    
    if (savedChannels) {
      const parsedChannels = JSON.parse(savedChannels);
      setChannels(parsedChannels);
      updateCategories(parsedChannels);
    }
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handleNavigation('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleNavigation('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleNavigation('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNavigation('right');
          break;
        case 'Enter':
          e.preventDefault();
          handleSelect();
          break;
        case 'Escape':
          e.preventDefault();
          if (isPlaying) {
            setIsPlaying(false);
            setCurrentChannel(null);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, currentView, channels, isPlaying]);

  const updateCategories = (channelList: Channel[]) => {
    const cats = ['All', ...new Set(channelList.map(c => c.group).filter(Boolean))];
    setCategories(cats);
  };

  const filteredChannels = currentView === 'favorites' 
    ? favorites 
    : selectedCategory === 'All' 
      ? channels 
      : channels.filter(c => c.group === selectedCategory);

  const handleNavigation = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (currentView === 'input') return;
    
    const itemsPerRow = 6;
    const totalItems = filteredChannels.length;
    
    switch (direction) {
      case 'up':
        setSelectedIndex(prev => Math.max(0, prev - itemsPerRow));
        break;
      case 'down':
        setSelectedIndex(prev => Math.min(totalItems - 1, prev + itemsPerRow));
        break;
      case 'left':
        setSelectedIndex(prev => Math.max(0, prev - 1));
        break;
      case 'right':
        setSelectedIndex(prev => Math.min(totalItems - 1, prev + 1));
        break;
    }
  };

  const handleSelect = () => {
    if (currentView === 'channels' || currentView === 'favorites') {
      const channel = filteredChannels[selectedIndex];
      if (channel) {
        playChannel(channel);
      }
    }
  };

  const playChannel = (channel: Channel) => {
    setCurrentChannel(channel);
    setIsPlaying(true);
    
    if (videoRef.current) {
      videoRef.current.src = channel.url;
      videoRef.current.load();
      videoRef.current.play().catch(console.error);
    }
  };

  const toggleFavorite = (channel: Channel) => {
    const isFavorite = favorites.some(fav => fav.name === channel.name && fav.url === channel.url);
    
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => !(fav.name === channel.name && fav.url === channel.url));
    } else {
      updatedFavorites = [...favorites, channel];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('medoil-favorites', JSON.stringify(updatedFavorites));
  };

  const addM3ULink = async () => {
    if (!m3uInput.trim()) return;
    
    try {
      const parsedChannels = await fetchM3U(m3uInput);
      const convertedChannels: Channel[] = parsedChannels.map(pc => ({
        name: pc.name,
        url: pc.url,
        logo: pc.logo,
        group: pc.group || 'General'
      }));

      const updatedChannels = [...channels, ...convertedChannels];
      setChannels(updatedChannels);
      updateCategories(updatedChannels);
      localStorage.setItem('medoil-channels', JSON.stringify(updatedChannels));
      
      setM3uInput('');
      setCurrentView('channels');
      
      toast({
        title: "Channels Loaded",
        description: `Added ${convertedChannels.length} channels from URL`,
      });
    } catch (error) {
      console.error('Error loading M3U from URL:', error);
      toast({
        title: "Error",
        description: "Failed to load M3U playlist from URL",
        variant: "destructive",
      });
    }
  };

  const addM3UFile = async () => {
    if (!selectedFile) return;
    
    try {
      const content = await selectedFile.text();
      console.log('Processing M3U file:', selectedFile.name);
      const parsedChannels = parseM3U(content);
      const convertedChannels: Channel[] = parsedChannels.map(pc => ({
        name: pc.name,
        url: pc.url,
        logo: pc.logo,
        group: pc.group || 'General'
      }));

      const updatedChannels = [...channels, ...convertedChannels];
      setChannels(updatedChannels);
      updateCategories(updatedChannels);
      localStorage.setItem('medoil-channels', JSON.stringify(updatedChannels));
      
      setSelectedFile(null);
      setCurrentView('channels');
      
      toast({
        title: "Channels Loaded",
        description: `Added ${convertedChannels.length} channels from file: ${selectedFile.name}`,
      });
    } catch (error) {
      console.error('Error processing M3U file:', error);
      toast({
        title: "Error",
        description: "Failed to process M3U file",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.m3u') && !file.name.toLowerCase().endsWith('.m3u8')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select a valid .m3u or .m3u8 file',
          variant: 'destructive'
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  if (isPlaying && currentChannel) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Video Player */}
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            controls
            autoPlay
            poster={currentChannel.logo}
          >
            <source src={currentChannel.url} type="application/x-mpegURL" />
            <source src={currentChannel.url} type="video/mp4" />
          </video>
          
          {/* Channel Info Overlay */}
          <div className="absolute top-6 left-6 bg-black/80 rounded-lg p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div>
                <h2 className="text-xl font-bold">{currentChannel.name}</h2>
                <p className="text-sm text-gray-300">{currentChannel.group}</p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <Button
            onClick={() => {
              setIsPlaying(false);
              setCurrentChannel(null);
            }}
            className="absolute top-6 right-6 bg-red-600 hover:bg-red-700"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-red-600 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-8 border-b border-white/20">
        <div className="flex items-center gap-6">
          <img 
            src="/lovable-uploads/ad949cec-30d7-4c18-af96-017ab163ef46.png" 
            alt="Medoil Logo" 
            className="w-16 h-16 object-contain"
          />
          <div>
            <h1 className="text-4xl font-bold">Medoil IPTV</h1>
            <p className="text-xl text-blue-200">Mediterranean Oil Services</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setCurrentView('input')}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/20"
            size="lg"
          >
            <Link className="w-5 h-5 mr-2" />
            Add M3U
          </Button>
          <Button
            onClick={onAdminAccess}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/20"
            size="lg"
          >
            <Settings className="w-5 h-5 mr-2" />
            Admin
          </Button>
        </div>
      </div>

      {currentView === 'input' ? (
        /* M3U Input View */
        <div className="p-8">
          <Card className="max-w-2xl mx-auto bg-black/40 border-white/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Add M3U Playlist</h2>
              
              {/* URL Input */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-center text-blue-200">From URL</h3>
                <input
                  type="text"
                  value={m3uInput}
                  onChange={(e) => setM3uInput(e.target.value)}
                  placeholder="Enter M3U URL..."
                  className="w-full p-4 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                />
                <Button
                  onClick={addM3ULink}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Link className="w-5 h-5 mr-2" />
                  Add from URL
                </Button>
              </div>

              {/* File Upload */}
              <div className="space-y-4 mb-8 border-t border-white/20 pt-8">
                <h3 className="text-lg font-semibold text-center text-blue-200">From File</h3>
                <input
                  type="file"
                  accept=".m3u,.m3u8"
                  onChange={handleFileChange}
                  className="w-full p-4 text-lg bg-white/10 border border-white/20 rounded-lg text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2 file:mr-4"
                />
                {selectedFile && (
                  <p className="text-center text-blue-200">
                    Selected: {selectedFile.name}
                  </p>
                )}
                <Button
                  onClick={addM3UFile}
                  disabled={!selectedFile}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
                  size="lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload File
                </Button>
              </div>

              <Button
                onClick={() => setCurrentView('channels')}
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/20"
                size="lg"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="p-8">
          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-8">
            <Button
              onClick={() => {
                setCurrentView('channels');
                setSelectedIndex(0);
              }}
              variant={currentView === 'channels' ? "default" : "outline"}
              className={currentView === 'channels' 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "border-white/30 text-white hover:bg-white/20"
              }
              size="lg"
            >
              <Grid className="w-5 h-5 mr-2" />
              Channels ({channels.length})
            </Button>
            <Button
              onClick={() => {
                setCurrentView('favorites');
                setSelectedIndex(0);
              }}
              variant={currentView === 'favorites' ? "default" : "outline"}
              className={currentView === 'favorites' 
                ? "bg-red-600 hover:bg-red-700" 
                : "border-white/30 text-white hover:bg-white/20"
              }
              size="lg"
            >
              <Heart className="w-5 h-5 mr-2" />
              Favorites ({favorites.length})
            </Button>
          </div>

          {/* Category Filter */}
          {currentView === 'channels' && categories.length > 1 && (
            <div className="flex gap-3 mb-8 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedIndex(0);
                  }}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={selectedCategory === category
                    ? "bg-white/20 text-white whitespace-nowrap"
                    : "border-white/30 text-white hover:bg-white/20 whitespace-nowrap"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          )}

          {/* Channels Grid */}
          {filteredChannels.length === 0 ? (
            <Card className="bg-black/40 border-white/20">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">No Channels Available</h3>
                <p className="text-xl text-white/70 mb-6">Add an M3U playlist to start watching</p>
                <Button
                  onClick={() => setCurrentView('input')}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Link className="w-5 h-5 mr-2" />
                  Add M3U Playlist
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-6 gap-6">
              {filteredChannels.map((channel, index) => (
                <Card
                  key={`${channel.name}-${index}`}
                  className={`bg-black/40 border-white/20 cursor-pointer transition-all duration-200 ${
                    index === selectedIndex 
                      ? 'border-white scale-105 bg-white/10' 
                      : 'hover:border-white/40 hover:bg-white/5'
                  }`}
                  onClick={() => playChannel(channel)}
                >
                  <CardContent className="p-6 text-center">
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-20 h-20 rounded-lg mx-auto mb-4 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-20 h-20 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg mx-auto mb-4 flex items-center justify-center ${channel.logo ? 'hidden' : ''}`}>
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2 truncate">{channel.name}</h3>
                    {channel.group && (
                      <p className="text-sm text-white/70 mb-4">{channel.group}</p>
                    )}
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          playChannel(channel);
                        }}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                        size="sm"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(channel);
                        }}
                        variant="outline"
                        className={`border-white/30 ${
                          favorites.some(fav => fav.name === channel.name && fav.url === channel.url)
                            ? 'bg-red-600 text-white border-red-600'
                            : 'text-white hover:bg-white/20'
                        }`}
                        size="sm"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Navigation Instructions */}
          <div className="mt-8 text-center text-white/60">
            <p className="text-lg">Use arrow keys to navigate • Enter to play • Escape to go back</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TVInterface;
