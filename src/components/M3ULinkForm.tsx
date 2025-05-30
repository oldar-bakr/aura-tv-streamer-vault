
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, X } from 'lucide-react';
import { M3ULink } from '../types/M3ULink';

interface M3ULinkFormProps {
  link?: M3ULink | null;
  onSubmit: (link: Omit<M3ULink, 'id'>) => void;
  onCancel: () => void;
}

const M3ULinkForm: React.FC<M3ULinkFormProps> = ({ link, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: link?.name || '',
    url: link?.url || '',
    description: link?.description || '',
    category: link?.category || '',
    logo: link?.logo || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      createdAt: link?.createdAt || new Date().toISOString(),
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">
            {link ? 'Edit M3U Link' : 'Add New M3U Link'}
          </h1>
        </div>

        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              {link ? 'Update Link Details' : 'Link Information'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-purple-200">Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter link name"
                    className="bg-black/30 border-purple-500/30 text-white placeholder-purple-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-200">Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    placeholder="e.g., Sports, Movies, News"
                    className="bg-black/30 border-purple-500/30 text-white placeholder-purple-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-purple-200">M3U URL *</Label>
                <Input
                  type="url"
                  value={formData.url}
                  onChange={(e) => handleChange('url', e.target.value)}
                  placeholder="https://example.com/playlist.m3u"
                  className="bg-black/30 border-purple-500/30 text-white placeholder-purple-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-purple-200">Logo URL</Label>
                <Input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => handleChange('logo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="bg-black/30 border-purple-500/30 text-white placeholder-purple-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-purple-200">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Optional description of this M3U link"
                  rows={4}
                  className="bg-black/30 border-purple-500/30 text-white placeholder-purple-300"
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  onClick={onCancel}
                  variant="outline"
                  className="border-gray-500/30 text-gray-300 hover:bg-gray-500/20 px-6 py-3 h-auto"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-3 h-auto"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {link ? 'Update Link' : 'Save Link'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default M3ULinkForm;
