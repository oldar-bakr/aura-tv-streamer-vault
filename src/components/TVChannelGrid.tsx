import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { Channel } from '../types/M3ULink';
import { useTVNavigation } from '@/hooks/use-tv-navigation';
import { useTVPlatform } from '@/hooks/use-tv-platform';

interface TVChannelGridProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
  focusKey?: string;
}

const TVChannelGrid: React.FC<TVChannelGridProps> = ({
  channels,
  onChannelSelect,
  focusKey = 'channel-grid'
}) => {
  const { addFocusable, setFocus } = useTVNavigation();
  const { platform } = useTVPlatform();

  React.useEffect(() => {
    // Set initial focus
    setFocus(focusKey);
  }, [focusKey, setFocus]);

  if (channels.length === 0) {
    return (
      <Card className="bg-black/40 backdrop-blur-xl border-white/20">
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
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {channels.map((channel, index) => (
        <Card
          key={`${channel.name}-${index}`}
          className={`
            bg-black/40 backdrop-blur-xl border-white/20 
            transition-all duration-200 cursor-pointer
            focus-visible:scale-105 focus-visible:border-white
            hover:border-white/40 hover:bg-white/5
          `}
          onClick={() => onChannelSelect(channel)}
          {...addFocusable({
            focusKey: `${focusKey}-${index}`,
            onEnterPress: () => onChannelSelect(channel)
          })}
          tabIndex={0}
        >
          <CardContent className="p-4 text-center">
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
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Play className="w-8 h-8 text-white" />
              </div>
            )}
            <h3 className="font-semibold text-white text-lg mb-2 truncate">{channel.name}</h3>
            {channel.group && (
              <p className="text-sm text-white/70 mb-4">{channel.group}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TVChannelGrid;