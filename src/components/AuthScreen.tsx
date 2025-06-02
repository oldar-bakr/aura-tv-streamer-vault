
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthScreenProps {
  onAuthenticated: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>(() => {
    return (localStorage.getItem('user-language') as 'en' | 'ar') || 'en';
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check if user should be remembered
    const rememberedAuth = localStorage.getItem('remember-auth');
    if (rememberedAuth === 'true') {
      onAuthenticated();
    }
  }, [onAuthenticated]);

  const translations = {
    en: {
      title: 'TV Stream Manager',
      subtitle: 'Enter password to access dashboard',
      passwordPlaceholder: 'Enter password',
      loginButton: 'Access Dashboard',
      authenticating: 'Authenticating...',
      demoPassword: 'Demo password: admin123',
      accessGranted: 'Access Granted',
      welcomeMessage: 'Welcome to TV Stream Manager',
      accessDenied: 'Access Denied',
      incorrectPassword: "Incorrect password. Try 'admin123'",
      rememberMe: 'Remember me for 30 days',
    },
    ar: {
      title: 'مدير البث التلفزيوني',
      subtitle: 'أدخل كلمة المرور للوصول إلى لوحة التحكم',
      passwordPlaceholder: 'أدخل كلمة المرور',
      loginButton: 'الوصول إلى لوحة التحكم',
      authenticating: 'جاري المصادقة...',
      demoPassword: 'كلمة المرور التجريبية: admin123',
      accessGranted: 'تم منح الوصول',
      welcomeMessage: 'مرحباً بك في مدير البث التلفزيوني',
      accessDenied: 'تم رفض الوصول',
      incorrectPassword: "كلمة مرور خاطئة. جرب 'admin123'",
      rememberMe: 'تذكرني لمدة 30 يوماً',
    }
  };

  const t = translations[language];

  const handleLanguageChange = (newLanguage: 'en' | 'ar') => {
    setLanguage(newLanguage);
    localStorage.setItem('user-language', newLanguage);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple password check (in production, use proper authentication)
    setTimeout(() => {
      if (password === 'admin123') {
        if (rememberMe) {
          // Remember for 30 days
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          localStorage.setItem('remember-auth', 'true');
          localStorage.setItem('remember-auth-expiry', expiryDate.toISOString());
        }
        
        onAuthenticated();
        toast({
          title: t.accessGranted,
          description: t.welcomeMessage,
        });
      } else {
        toast({
          title: t.accessDenied,
          description: t.incorrectPassword,
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={() => handleLanguageChange(language === 'en' ? 'ar' : 'en')}
          variant="outline"
          size="sm"
          className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
        >
          <Globe className="w-4 h-4 mr-2" />
          {language === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>

      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-purple-500/30 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center p-2">
            <img 
              src="/lovable-uploads/f5a7e76e-1a14-41df-99e1-340e49412af4.png" 
              alt="MEDOIL Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white">{t.title}</CardTitle>
          <p className="text-purple-200">{t.subtitle}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Lock className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-purple-400`} />
              <Input
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${language === 'ar' ? 'pr-10' : 'pl-10'} bg-black/30 border-purple-500/30 text-white placeholder-purple-300 focus:border-purple-400 h-12`}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-purple-500/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
              />
              <label htmlFor="remember-me" className="text-purple-200 text-sm cursor-pointer">
                {t.rememberMe}
              </label>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? t.authenticating : t.loginButton}
            </Button>
          </form>
          <p className="text-center text-purple-300 text-sm mt-4">
            {t.demoPassword}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;
