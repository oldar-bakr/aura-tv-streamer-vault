
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2, Upload, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface M3UInputProps {
  onAddLink: (url: string, name: string) => Promise<void>;
  onAddFile: (content: string, name: string) => Promise<void>;
  loading: boolean;
}

const M3UInput: React.FC<M3UInputProps> = ({ onAddLink, onAddFile, loading }) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleUrlSubmit = async (e: React.FormEvent) => {
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

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Please select an M3U file',
        variant: 'destructive'
      });
      return;
    }

    try {
      const content = await selectedFile.text();
      const fileName = selectedFile.name.replace('.m3u', '').replace('.m3u8', '');
      await onAddFile(content, name.trim() || fileName || 'My M3U File');
      setSelectedFile(null);
      setName('');
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to read M3U file',
        variant: 'destructive'
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is M3U
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

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add M3U Source
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/30">
            <TabsTrigger value="url" className="data-[state=active]:bg-purple-600">
              <Link className="w-4 h-4 mr-2" />
              URL
            </TabsTrigger>
            <TabsTrigger value="file" className="data-[state=active]:bg-purple-600">
              <Upload className="w-4 h-4 mr-2" />
              File
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4 mt-4">
            <form onSubmit={handleUrlSubmit} className="space-y-4">
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
                    <Link className="w-4 h-4 mr-2" />
                    Add M3U URL
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="file" className="space-y-4 mt-4">
            <form onSubmit={handleFileSubmit} className="space-y-4">
              <div className="space-y-2">
                <label 
                  htmlFor="file-input" 
                  className="block text-sm font-medium text-purple-200"
                >
                  Select M3U File
                </label>
                <Input
                  id="file-input"
                  type="file"
                  accept=".m3u,.m3u8"
                  onChange={handleFileChange}
                  className="bg-black/30 border-purple-500/30 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                  disabled={loading}
                />
                {selectedFile && (
                  <p className="text-sm text-purple-300">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
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
                disabled={loading || !selectedFile}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload M3U File
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default M3UInput;
