
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Play, Settings, LogOut, Edit, Trash2, Tv } from 'lucide-react';
import { M3ULink } from '../types/M3ULink';
import M3ULinkForm from './M3ULinkForm';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  m3uLinks: M3ULink[];
  onAddLink: (link: Omit<M3ULink, 'id'>) => void;
  onUpdateLink: (id: string, link: Omit<M3ULink, 'id'>) => void;
  onDeleteLink: (id: string) => void;
  onViewChannels: () => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  m3uLinks,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onViewChannels,
  onLogout,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<M3ULink | null>(null);
  const { toast } = useToast();

  const handleEdit = (link: M3ULink) => {
    setEditingLink(link);
    setShowForm(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This action cannot be undone.`)) {
      onDeleteLink(id);
      toast({
        title: "Link Deleted",
        description: `"${name}" has been removed from your collection.`,
      });
    }
  };

  const handleFormSubmit = (linkData: Omit<M3ULink, 'id'>) => {
    if (editingLink) {
      onUpdateLink(editingLink.id, linkData);
      toast({
        title: "Link Updated",
        description: `"${linkData.name}" has been updated successfully.`,
      });
    } else {
      onAddLink(linkData);
      toast({
        title: "Link Added",
        description: `"${linkData.name}" has been added to your collection.`,
      });
    }
    setShowForm(false);
    setEditingLink(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingLink(null);
  };

  if (showForm) {
    return (
      <M3ULinkForm
        link={editingLink}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Tv className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">TV Stream Manager</h1>
            <p className="text-purple-200">Manage your M3U streaming links</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={onViewChannels}
            disabled={m3uLinks.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 h-auto"
          >
            <Play className="w-5 h-5 mr-2" />
            View Channels
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20 px-6 py-3 h-auto"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Total Links</p>
                <p className="text-3xl font-bold text-white">{m3uLinks.length}</p>
              </div>
              <Settings className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Categories</p>
                <p className="text-3xl font-bold text-white">
                  {new Set(m3uLinks.map(link => link.category || 'General')).size}
                </p>
              </div>
              <Play className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Status</p>
                <p className="text-xl font-bold text-green-400">Active</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* M3U Links Management */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">M3U Links</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-3 h-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Link
        </Button>
      </div>

      {/* Links Grid */}
      {m3uLinks.length === 0 ? (
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-12 text-center">
            <Tv className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No M3U Links Yet</h3>
            <p className="text-purple-200 mb-6">Get started by adding your first M3U streaming link</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-8 py-3 h-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Link
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {m3uLinks.map((link) => (
            <Card key={link.id} className="bg-black/40 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 transform hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-white truncate">{link.name}</CardTitle>
                    {link.category && (
                      <span className="inline-block px-2 py-1 text-xs bg-purple-600/30 text-purple-200 rounded-full mt-2">
                        {link.category}
                      </span>
                    )}
                  </div>
                  {link.logo && (
                    <img src={link.logo} alt={link.name} className="w-12 h-12 rounded-lg object-cover" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {link.description && (
                  <p className="text-purple-200 text-sm mb-4 line-clamp-2">{link.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEdit(link)}
                      size="sm"
                      variant="outline"
                      className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(link.id, link.name)}
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-purple-300">
                    {link.createdAt ? new Date(link.createdAt).toLocaleDateString() : 'No date'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
