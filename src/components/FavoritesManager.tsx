
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, HeartOff } from 'lucide-react';
import { Channel } from '../types/M3ULink';
import { useToast } from '@/hooks/use-toast';

interface FavoritesManagerProps {
  channel: Channel;
  favorites: Channel[];
  onToggleFavorite: (channel: Channel) => void;
}

const FavoritesManager: React.FC<FavoritesManagerProps> = ({
  channel,
  favorites,
  onToggleFavorite
}) => {
  const { toast } = useToast();
  
  const isFavorite = favorites.some(fav => 
    fav.name === channel.name && fav.url === channel.url
  );

  const handleToggle = () => {
    onToggleFavorite(channel);
    toast({
      title: isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      description: `${channel.name} ${isFavorite ? 'removed from' : 'added to'} your favorites`,
    });
  };

  return (
    <Button
      onClick={handleToggle}
      variant="outline"
      size="sm"
      className={`
        border-purple-500/30 transition-all duration-200
        ${isFavorite 
          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
          : 'text-purple-200 hover:bg-purple-500/20'
        }
      `}
    >
      {isFavorite ? (
        <Heart className="w-4 h-4 fill-current" />
      ) : (
        <HeartOff className="w-4 h-4" />
      )}
    </Button>
  );
};

export default FavoritesManager;
