
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { Channel } from '../types/M3ULink';
import FavoritesManager from './FavoritesManager';

interface ChannelGridProps {
  channels: Channel[];
  viewMode: 'grid' | 'list';
  favorites: Channel[];
  onChannelClick: (channel: Channel) => void;
  onToggleFavorite: (channel: Channel) => void;
}

const ChannelGrid: React.FC<ChannelGridProps> = ({
  channels,
  viewMode,
  favorites,
  onChannelClick,
  onToggleFavorite
}) => {
  if (channels.length === 0) {
    return (
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Channels Found</h3>
          <p className="text-purple-200">Add an M3U link to start watching channels</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={
      viewMode === 'grid'
        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
        : "flex flex-col gap-3"
    }>
      {channels.map((channel, index) => (
        <Card
          key={`${channel.name}-${index}`}
          className="bg-black/40 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 transform hover:scale-105 cursor-pointer group"
        >
          <CardContent className={viewMode === 'grid' ? "p-4 text-center" : "p-4 flex items-center gap-4"}>
            {viewMode === 'grid' ? (
              <>
                {channel.logo ? (
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="w-16 h-16 rounded-lg mx-auto mb-3 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg mx-auto mb-3 flex items-center justify-center ${channel.logo ? 'hidden' : ''}`}>
                  <Play className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white text-sm truncate mb-2">{channel.name}</h3>
                {channel.group && (
                  <p className="text-xs text-purple-300 mb-3">{channel.group}</p>
                )}
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={() => onChannelClick(channel)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </Button>
                  <FavoritesManager
                    channel={channel}
                    favorites={favorites}
                    onToggleFavorite={onToggleFavorite}
                  />
                </div>
              </>
            ) : (
              <>
                {channel.logo ? (
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center ${channel.logo ? 'hidden' : ''}`}>
                  <Play className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{channel.name}</h3>
                  {channel.group && (
                    <p className="text-sm text-purple-300">{channel.group}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <FavoritesManager
                    channel={channel}
                    favorites={favorites}
                    onToggleFavorite={onToggleFavorite}
                  />
                  <Button
                    onClick={() => onChannelClick(channel)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChannelGrid;
