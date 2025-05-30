import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Play, Grid, List, Loader2, Settings, Globe } from 'lucide-react';
import { M3ULink, Channel } from '../types/M3ULink';
import { useToast } from '@/hooks/use-toast';

interface ChannelViewerProps {
  m3uLinks: M3ULink[];
  onAdminAccess: () => void;
}

const ChannelViewer: React.FC<ChannelViewerProps> = ({ m3uLinks, onAdminAccess }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const { toast } = useToast();

  const translations = {
    en: {
      title: 'TV Stream Manager',
      subtitle: 'channels available',
      searchPlaceholder: 'Search channels...',
      channelsLoaded: 'Channels Loaded',
      foundChannels: 'Found',
      channels: 'channels from',
      links: 'M3U links',
      errorLoading: 'Error Loading Channels',
      failedParse: 'Failed to parse M3U files',
      noChannelsFound: 'No Channels Found',
      adjustFilter: 'Try adjusting your search or category filter',
      playingChannel: 'Playing Channel',
      nowPlaying: 'Now playing:',
      adminDashboard: 'Admin Dashboard',
      manageLinks: 'Manage M3U Links',
      all: 'All'
    },
    ar: {
      title: 'مدير البث التلفزيوني',
      subtitle: 'قناة متاحة',
      searchPlaceholder: 'البحث عن القنوات...',
      channelsLoaded: 'تم تحميل القنوات',
      foundChannels: 'تم العثور على',
      channels: 'قناة من',
      links: 'روابط M3U',
      errorLoading: 'خطأ في تحميل القنوات',
      failedParse: 'فشل في تحليل ملفات M3U',
      noChannelsFound: 'لم يتم العثور على قنوات',
      adjustFilter: 'جرب تعديل البحث أو تصفية الفئة',
      playingChannel: 'تشغيل القناة',
      nowPlaying: 'الآن يتم تشغيل:',
      adminDashboard: 'لوحة تحكم المشرف',
      manageLinks: 'إدارة روابط M3U',
      all: 'الكل'
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadChannels();
  }, [m3uLinks]);

  useEffect(() => {
    filterChannels();
  }, [channels, searchQuery, selectedCategory]);

  const loadChannels = async () => {
    setLoading(true);
    try {
      const allChannels: Channel[] = [];
      
      m3uLinks.forEach((link) => {
        const demoChannels = generateDemoChannels(link.category || 'General');
        allChannels.push(...demoChannels);
      });

      setChannels(allChannels);
      toast({
        title: t.channelsLoaded,
        description: `${t.foundChannels} ${allChannels.length} ${t.channels} ${m3uLinks.length} ${t.links}`,
      });
    } catch (error) {
      toast({
        title: t.errorLoading,
        description: t.failedParse,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDemoChannels = (category: string): Channel[] => {
    const baseChannels = [
      { name: 'News Channel HD', url: 'https://demo.com/news', group: 'News' },
      { name: 'Sports Network', url: 'https://demo.com/sports', group: 'Sports' },
      { name: 'Movie Central', url: 'https://demo.com/movies', group: 'Movies' },
      { name: 'Music TV', url: 'https://demo.com/music', group: 'Music' },
      { name: 'Documentary HD', url: 'https://demo.com/docs', group: 'Educational' },
      { name: 'Kids Channel', url: 'https://demo.com/kids', group: 'Kids' },
      { name: 'Drama Series', url: 'https://demo.com/drama', group: 'Entertainment' },
      { name: 'Comedy Central', url: 'https://demo.com/comedy', group: 'Entertainment' },
    ];

    return baseChannels.map((channel, index) => ({
      ...channel,
      logo: `https://picsum.photos/64/64?random=${category}-${index}`,
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

  const categories = [t.all, ...new Set(channels.map(c => c.group).filter(Boolean))];

  const handleChannelClick = (channel: Channel) => {
    toast({
      title: t.playingChannel,
      description: `${t.nowPlaying} ${channel.name}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">{t.channelsLoaded}</h2>
          <p className="text-purple-200">Parsing M3U files...</p>
        </div>
      </div>
    );
  }

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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
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

      {/* Channels */}
      {filteredChannels.length === 0 ? (
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t.noChannelsFound}</h3>
            <p className="text-purple-200">{t.adjustFilter}</p>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
            : "flex flex-col gap-3"
        }>
          {filteredChannels.map((channel, index) => (
            <Card
              key={`${channel.name}-${index}`}
              className="bg-black/40 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 transform hover:scale-105 cursor-pointer"
              onClick={() => handleChannelClick(channel)}
            >
              <CardContent className={viewMode === 'grid' ? "p-4 text-center" : "p-4 flex items-center gap-4"}>
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

      {/* Footer with Admin Access */}
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
        <div className="text-center mt-4">
          <p className="text-purple-300 text-xs mb-2">
            {language === 'en' 
              ? 'TV Stream Manager - Access live channels from your M3U links' 
              : 'مدير البث التلفزيوني - الوصول إلى القنوات المباشرة من روابط M3U الخاصة بك'
            }
          </p>
          <p className="text-purple-400 text-xs">
            {language === 'en' 
              ? 'Note: This application provides channel access only. External player required for streaming.' 
              : 'ملاحظة: هذا التطبيق يوفر الوصول إلى القنوات فقط. مشغل خارجي مطلوب للبث.'
            }
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChannelViewer;
