
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Tv } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthScreenProps {
  onAuthenticated: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple password check (in production, use proper authentication)
    setTimeout(() => {
      if (password === 'admin123') {
        onAuthenticated();
        toast({
          title: "Access Granted",
          description: "Welcome to TV Stream Manager",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Incorrect password. Try 'admin123'",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-purple-500/30 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
            <Tv className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">TV Stream Manager</CardTitle>
          <p className="text-purple-200">Enter password to access dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder-purple-300 focus:border-purple-400 h-12"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
          </form>
          <p className="text-center text-purple-300 text-sm mt-4">
            Demo password: admin123
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;
