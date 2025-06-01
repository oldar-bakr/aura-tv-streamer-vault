
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Grid, List, Loader2, Settings, Globe, Heart } from 'lucide-react';
import { Channel } from '../types/M3ULink';
import { useToast } from '@/hooks/use-toast';
import { fetchM3U } from '../utils/m3uParser';
import M3UInput from './M3UInput';
import VideoPlayer from './VideoPlayer';
import ChannelGrid from './ChannelGrid';

interface ChannelViewerProps {
  onAdminAccess: () => void;
}

const ChannelViewer: React.FC<ChannelViewerProps> = ({ onAdminAccess }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
  const [favorites, setFavorites] = useState<Channel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const translations = {
    en: {
      title: 'TV Stream Manager',
      subtitle: 'channels available',
      searchPlaceholder: 'Search channels...',
      channelsLoaded: 'Channels Loaded',
      foundChannels: 'Found',
      channels: 'channels',
      errorLoading: 'Error Loading Channels',
      failedParse: 'Failed to parse M3U file',
      adminDashboard: 'Admin Dashboard',
      all: 'All',
      favorites: 'Favorites',
      loading: 'Loading channels...',
      addM3U: 'Add M3U'
    },
    ar: {
      title: 'مدير البث التلفزيوني',
      subtitle: 'قناة متاحة',
      searchPlaceholder: 'البحث عن القنوات...',
      channelsLoaded: 'تم تحميل القنوات',
      foundChannels: 'تم العثور على',
      channels: 'قناة',
      errorLoading: 'خطأ في تحميل القنوات',
      failedParse: 'فشل في تحليل ملف M3U',
      adminDashboard: 'لوحة تحكم المشرف',
      all: 'الكل',
      favorites: 'المفضلة',
      loading: 'جاري تحميل القنوات...',
      addM3U: 'إضافة M3U'
    }
  };

  const t = translations[language];

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('channel-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Load channels from localStorage
    const savedChannels = localStorage.getItem('parsed-channels');
    if (savedChannels) {
      setChannels(JSON.parse(savedChannels));
    }
  }, []);

  useEffect(() => {
    filterChannels();
  }, [channels, favorites, searchQuery, selectedCategory, activeTab]);

  const addM3ULink = async (url: string, name: string) => {
    setLoading(true);
    try {
      console.log(`Loading M3U from: ${url}`);
      const parsedChannels = await fetchM3U(url);
      
      // Convert ParsedChannel to Channel
      const convertedChannels: Channel[] = parsedChannels.map(pc => ({
        name: pc.name,
        url: pc.url,
        logo: pc.logo,
        group: pc.group || 'General'
      }));

      const updatedChannels = [...channels, ...convertedChannels];
      setChannels(updatedChannels);
      localStorage.setItem('parsed-channels', JSON.stringify(updatedChannels));

      toast({
        title: t.channelsLoaded,
        description: `${t.foundChannels} ${parsedChannels.length} ${t.channels}`,
      });
    } catch (error) {
      console.error('Error loading M3U:', error);
      toast({
        title: t.errorLoading,
        description: error instanceof Error ? error.message : t.failedParse,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (channel: Channel) => {
    const isFavorite = favorites.some(fav => 
      fav.name === channel.name && fav.url === channel.url
    );

    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => 
        !(fav.name === channel.name && fav.url === channel.url)
      );
    } else {
      updatedFavorites = [...favorites, channel];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('channel-favorites', JSON.stringify(updatedFavorites));
  };

  const filterChannels = () => {
    let channelsToFilter = activeTab === 'favorites' ? favorites : channels;

    if (searchQuery) {
      channelsToFilter = channelsToFilter.filter(channel =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (channel.group && channel.group.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'All') {
      channelsToFilter = channelsToFilter.filter(channel => channel.group === selectedCategory);
    }

    setFilteredChannels(channelsToFilter);
  };

  const categories = ['All', ...new Set(channels.map(c => c.group).filter(Boolean))];

  return (
    <div className="min-h-screen p-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2">
            <img 
              src="/lovable-uploads/f5a7e76e-1a14-41df-99e1-340e49412af4.png" 
              alt="MEDOIL Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{t.title}</h1>
            <p className="text-purple-200">{filteredChannels.length} {t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            variant="outline"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
          >
            <Globe className="w-5 h-5 mr-2" />
            {language === 'en' ? 'العربية' : 'English'}
          </Button>
          <Button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            variant="outline"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* M3U Input */}
      <div className="mb-8">
        <M3UInput onAddLink={addM3ULink} loading={loading} />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-black/40 border-purple-500/30">
          <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
            {t.all}
          </TabsTrigger>
          <TabsTrigger value="favorites" className="data-[state=active]:bg-purple-600">
            <Heart className="w-4 h-4 mr-2" />
            {t.favorites} ({favorites.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-purple-400`} />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${language === 'ar' ? 'pr-10' : 'pl-10'} bg-black/30 border-purple-500/30 text-white placeholder-purple-300`}
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

          <ChannelGrid
            channels={filteredChannels}
            viewMode={viewMode}
            favorites={favorites}
            onChannelClick={setCurrentChannel}
            onToggleFavorite={toggleFavorite}
          />
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          {/* Filters for favorites */}
          <div className="relative">
            <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-purple-400`} />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${language === 'ar' ? 'pr-10' : 'pl-10'} bg-black/30 border-purple-500/30 text-white placeholder-purple-300`}
            />
          </div>

          <ChannelGrid
            channels={filteredChannels}
            viewMode={viewMode}
            favorites={favorites}
            onChannelClick={setCurrentChannel}
            onToggleFavorite={toggleFavorite}
          />
        </TabsContent>
      </Tabs>

      {/* Video Player */}
      <VideoPlayer
        channel={currentChannel}
        onClose={() => setCurrentChannel(null)}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-purple-500/30 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center p-1">
              <img 
                src="/lovable-uploads/f5a7e76e-1a14-41df-99e1-340e49412af4.png" 
                alt="MEDOIL Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-purple-200 text-sm">MEDOIL Istanbul - Mediterranean Oil Services</span>
          </div>
          <Button
            onClick={onAdminAccess}
            variant="outline"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
          >
            <Settings className="w-4 h-4 mr-2" />
            {t.adminDashboard}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ChannelViewer;
