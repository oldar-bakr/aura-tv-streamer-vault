
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Maximize, Volume2 } from 'lucide-react';
import { Channel } from '../types/M3ULink';

interface VideoPlayerProps {
  channel: Channel | null;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ channel, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (channel && videoRef.current) {
      const video = videoRef.current;
      video.src = channel.url;
      video.load();
      video.play().catch(console.error);
    }
  }, [channel]);

  if (!channel) return null;

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <Card className="fixed inset-4 z-50 bg-black/95 backdrop-blur-xl border-purple-500/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          {channel.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleFullscreen}
            variant="outline"
            size="sm"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
          >
            <Maximize className="w-4 h-4" />
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            autoPlay
            poster={channel.logo}
          >
            <source src={channel.url} type="application/x-mpegURL" />
            <source src={channel.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Channel info overlay */}
          <div className="absolute bottom-4 left-4 bg-black/80 rounded-lg p-3 text-white">
            <div className="flex items-center gap-2 text-sm">
              <Volume2 className="w-4 h-4 text-green-400" />
              <span>Live • {channel.group || 'General'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
