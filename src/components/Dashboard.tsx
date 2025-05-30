import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Play, Settings, LogOut, Edit, Trash2, Globe } from 'lucide-react';
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
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const { toast } = useToast();

  const translations = {
    en: {
      title: 'TV Stream Manager',
      subtitle: 'Manage your M3U streaming links',
      viewChannels: 'View Channels',
      logout: 'Logout',
      totalLinks: 'Total Links',
      categories: 'Categories',
      status: 'Status',
      active: 'Active',
      m3uLinks: 'M3U Links',
      addNewLink: 'Add New Link',
      noLinksYet: 'No M3U Links Yet',
      getStarted: 'Get started by adding your first M3U streaming link',
      addFirstLink: 'Add Your First Link',
      linkDeleted: 'Link Deleted',
      linkRemoved: 'has been removed from your collection.',
      linkUpdated: 'Link Updated',
      linkUpdatedSuccess: 'has been updated successfully.',
      linkAdded: 'Link Added',
      linkAddedSuccess: 'has been added to your collection.',
      deleteConfirm: 'Delete',
      deleteAction: 'This action cannot be undone.',
      general: 'General',
      noDate: 'No date',
    },
    ar: {
      title: 'مدير البث التلفزيوني',
      subtitle: 'إدارة روابط البث M3U الخاصة بك',
      viewChannels: 'عرض القنوات',
      logout: 'تسجيل الخروج',
      totalLinks: 'إجمالي الروابط',
      categories: 'الفئات',
      status: 'الحالة',
      active: 'نشط',
      m3uLinks: 'روابط M3U',
      addNewLink: 'إضافة رابط جديد',
      noLinksYet: 'لا توجد روابط M3U حتى الآن',
      getStarted: 'ابدأ بإضافة أول رابط بث M3U الخاص بك',
      addFirstLink: 'أضف رابطك الأول',
      linkDeleted: 'تم حذف الرابط',
      linkRemoved: 'تمت إزالته من مجموعتك.',
      linkUpdated: 'تم تحديث الرابط',
      linkUpdatedSuccess: 'تم تحديثه بنجاح.',
      linkAdded: 'تم إضافة الرابط',
      linkAddedSuccess: 'تم إضافته إلى مجموعتك.',
      deleteConfirm: 'حذف',
      deleteAction: 'لا يمكن التراجع عن هذا الإجراء.',
      general: 'عام',
      noDate: 'لا يوجد تاريخ',
    }
  };

  const t = translations[language];

  const handleEdit = (link: M3ULink) => {
    setEditingLink(link);
    setShowForm(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`${t.deleteConfirm} "${name}"? ${t.deleteAction}`)) {
      onDeleteLink(id);
      toast({
        title: t.linkDeleted,
        description: `"${name}" ${t.linkRemoved}`,
      });
    }
  };

  const handleFormSubmit = (linkData: Omit<M3ULink, 'id'>) => {
    if (editingLink) {
      onUpdateLink(editingLink.id, linkData);
      toast({
        title: t.linkUpdated,
        description: `"${linkData.name}" ${t.linkUpdatedSuccess}`,
      });
    } else {
      onAddLink(linkData);
      toast({
        title: t.linkAdded,
        description: `"${linkData.name}" ${t.linkAddedSuccess}`,
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
    <div className="min-h-screen p-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2">
            <img 
              src="/lovable-uploads/f5a7e76e-1a14-41df-99e1-340e49412af4.png" 
              alt="MEDOIL Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{t.title}</h1>
            <p className="text-purple-200">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            variant="outline"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20 px-4 py-3 h-auto"
          >
            <Globe className="w-5 h-5 mr-2" />
            {language === 'en' ? 'العربية' : 'English'}
          </Button>
          <Button
            onClick={onViewChannels}
            disabled={m3uLinks.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 h-auto"
          >
            <Play className="w-5 h-5 mr-2" />
            {t.viewChannels}
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20 px-6 py-3 h-auto"
          >
            <LogOut className="w-5 h-5 mr-2" />
            {t.logout}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">{t.totalLinks}</p>
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
                <p className="text-purple-200 text-sm">{t.categories}</p>
                <p className="text-3xl font-bold text-white">
                  {new Set(m3uLinks.map(link => link.category || t.general)).size}
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
                <p className="text-purple-200 text-sm">{t.status}</p>
                <p className="text-xl font-bold text-green-400">{t.active}</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* M3U Links Management */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t.m3uLinks}</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-3 h-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t.addNewLink}
        </Button>
      </div>

      {/* Links Grid */}
      {m3uLinks.length === 0 ? (
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2 mx-auto mb-4">
              <img 
                src="/lovable-uploads/f5a7e76e-1a14-41df-99e1-340e49412af4.png" 
                alt="MEDOIL Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t.noLinksYet}</h3>
            <p className="text-purple-200 mb-6">{t.getStarted}</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-8 py-3 h-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t.addFirstLink}
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
                    {link.createdAt ? new Date(link.createdAt).toLocaleDateString() : t.noDate}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer with Admin Dashboard Note */}
      <footer className="mt-16 border-t border-purple-500/30 pt-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center p-1">
              <img 
                src="/lovable-uploads/f5a7e76e-1a14-41df-99e1-340e49412af4.png" 
                alt="MEDOIL Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-purple-200 text-sm">MEDOIL Istanbul - Mediterranean Oil Services</span>
          </div>
          <p className="text-purple-300 text-xs mb-2">
            {language === 'en' 
              ? 'Admin Dashboard - Manage M3U streaming links for TV applications' 
              : 'لوحة تحكم المشرف - إدارة روابط البث M3U لتطبيقات التلفزيون'
            }
          </p>
          <p className="text-purple-400 text-xs">
            {language === 'en' 
              ? 'Note: This application manages streaming links only. No built-in media player included.' 
              : 'ملاحظة: هذا التطبيق يدير روابط البث فقط. لا يتضمن مشغل وسائط مدمج.'
            }
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
