
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Play, Grid, List, Loader2 } from 'lucide-react';
import { M3ULink, Channel } from '../types/M3ULink';
import { useToast } from '@/hooks/use-toast';

interface ChannelViewerProps {
  m3uLinks: M3ULink[];
  onBackToDashboard: () => void;
}

const ChannelViewer: React.FC<ChannelViewerProps> = ({ m3uLinks, onBackToDashboard }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadChannels();
  }, [m3uLinks]);

  useEffect(() => {
    filterChannels();
  }, [channels, searchQuery, selectedCategory]);

  const loadChannels = async () => {
    setLoading(true);
    try {
      // Simulate loading M3U channels (in a real app, you'd parse the M3U files)
      const allChannels: Channel[] = [];
      
      m3uLinks.forEach((link, linkIndex) => {
        // Generate demo channels for each M3U link
        const demoChannels = generateDemoChannels(link.name, link.category || 'General');
        allChannels.push(...demoChannels);
      });

      setChannels(allChannels);
      toast({
        title: "Channels Loaded",
        description: `Found ${allChannels.length} channels from ${m3uLinks.length} M3U links`,
      });
    } catch (error) {
      toast({
        title: "Error Loading Channels",
        description: "Failed to parse M3U files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDemoChannels = (linkName: string, category: string): Channel[] => {
    const baseChannels = [
      { name: 'News Channel', url: 'https://demo.com/news', group: 'News' },
      { name: 'Sports Network', url: 'https://demo.com/sports', group: 'Sports' },
      { name: 'Movie Central', url: 'https://demo.com/movies', group: 'Movies' },
      { name: 'Music TV', url: 'https://demo.com/music', group: 'Music' },
      { name: 'Documentary HD', url: 'https://demo.com/docs', group: 'Educational' },
      { name: 'Kids Channel', url: 'https://demo.com/kids', group: 'Kids' },
    ];

    return baseChannels.map((channel, index) => ({
      ...channel,
      name: `${linkName} - ${channel.name}`,
      logo: `https://picsum.photos/64/64?random=${linkName}-${index}`,
      group: category === 'General' ? channel.group : category,
    }));
  };

  const filterChannels = () => {
    let filtered = channels;

    if (searchQuery) {
      filtered = filtered.filter(channel =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (channel.group && channel.group.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(channel => channel.group === selectedCategory);
    }

    setFilteredChannels(filtered);
  };

  const categories = ['All', ...new Set(channels.map(c => c.group).filter(Boolean))];

  const handleChannelClick = (channel: Channel) => {
    toast({
      title: "Playing Channel",
      description: `Now playing: ${channel.name}`,
    });
    // In a real app, you would open the stream in a video player
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Loading Channels</h2>
          <p className="text-purple-200">Parsing M3U files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onBackToDashboard}
            variant="outline"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Channel Viewer</h1>
            <p className="text-purple-200">{filteredChannels.length} channels available</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            variant="outline"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
          <Input
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder-purple-300"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={
                selectedCategory === category
                  ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white whitespace-nowrap"
                  : "border-purple-500/30 text-purple-200 hover:bg-purple-500/20 whitespace-nowrap"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Channels */}
      {filteredChannels.length === 0 ? (
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Channels Found</h3>
            <p className="text-purple-200">Try adjusting your search or category filter</p>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
            : "space-y-3"
        }>
          {filteredChannels.map((channel, index) => (
            <Card
              key={`${channel.name}-${index}`}
              className="bg-black/40 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 transform hover:scale-105 cursor-pointer"
              onClick={() => handleChannelClick(channel)}
            >
              <CardContent className={viewMode === 'grid' ? "p-4 text-center" : "p-4 flex items-center space-x-4"}>
                {viewMode === 'grid' ? (
                  <>
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-16 h-16 rounded-lg mx-auto mb-3 object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <h3 className="font-semibold text-white text-sm truncate">{channel.name}</h3>
                    {channel.group && (
                      <p className="text-xs text-purple-300 mt-1">{channel.group}</p>
                    )}
                  </>
                ) : (
                  <>
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                        <Play className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{channel.name}</h3>
                      {channel.group && (
                        <p className="text-sm text-purple-300">{channel.group}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChannelViewer;
