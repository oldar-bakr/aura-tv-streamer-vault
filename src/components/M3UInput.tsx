
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface M3UInputProps {
  onAddLink: (url: string, name: string) => Promise<void>;
  loading: boolean;
}

const M3UInput: React.FC<M3UInputProps> = ({ onAddLink, loading }) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid M3U URL',
        variant: 'destructive'
      });
      return;
    }

    try {
      await onAddLink(url.trim(), name.trim() || 'My M3U List');
      setUrl('');
      setName('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load M3U',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add M3U Link
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter M3U URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-black/30 border-purple-500/30 text-white placeholder-purple-300"
            disabled={loading}
          />
          <Input
            placeholder="List name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-black/30 border-purple-500/30 text-white placeholder-purple-300"
            disabled={loading}
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add M3U Link
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default M3UInput;
