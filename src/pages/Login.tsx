// Professional Login Page
// Enterprise Authentication με Mock Users Support
// 20+ Years Experience - Production-Ready

import { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  UserCheck, 
  Shield, 
  Sparkles,
  AlertCircle,
  CheckCircle,
  Users,
  Building,
  Crown,
  Star,
  Zap
} from 'lucide-react';
import { mockAuthService, MOCK_USERS } from '@/lib/mock-auth';
import { UserRole } from '@/lib/clerk-config';
import { toast } from 'sonner';
import { useSaaS } from '@/lib/clerk-provider';

export function Login() {
  const { isAuthenticated } = useSaaS();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Check for force logout parameter
  useEffect(() => {
    if (searchParams.get('logout') === 'force') {
      mockAuthService.forceLogout();
      navigate('/welcome', { replace: true });
    }
  }, [searchParams, navigate]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-950 dark:via-gray-900 dark:to-green-950/20">
        <div className="w-full max-w-md mx-auto p-8 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl text-center">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-16 h-16 text-green-500 mb-2 animate-bounce" />
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">Είσαι ήδη συνδεδεμένος!</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg">Όλα λειτουργούν κανονικά.<br />Μπορείς να πας στο dashboard ή να αποσυνδεθείς.</p>
            <Button className="mt-4 w-full" onClick={() => navigate('/dashboard')}>
              Μετάβαση στο Dashboard
            </Button>
            <Button variant="outline" className="w-full" onClick={() => { mockAuthService.logout(); window.location.reload(); }}>
              Αποσύνδεση
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Παρακαλώ συμπληρώστε όλα τα πεδία');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await mockAuthService.login(formData.email, formData.password);
      if (result.success && result.user) {
        toast.success(`Καλώς ήρθατε, ${result.user.firstName}! 🎉`);
        navigate('/dashboard');
      } else {
        setError(result.error || 'Σφάλμα σύνδεσης');
        toast.error(result.error || 'Σφάλμα σύνδεσης');
      }
    } catch (err) {
      setError('Απροσδόκητο σφάλμα. Παρακαλώ δοκιμάστε ξανά.');
      toast.error('Απροσδόκητο σφάλμα');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (email: string) => {
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) return;
    setFormData({ email, password: user.password });
    setIsLoading(true);
    const result = await mockAuthService.login(email, user.password);
    if (result.success && result.user) {
      toast.success(`Γρήγορη σύνδεση ως ${result.user.firstName}! 🚀`);
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return <Crown className="w-4 h-4 text-yellow-600" />;
      case UserRole.ADMIN: return <Shield className="w-4 h-4 text-blue-600" />;
      case UserRole.MODERATOR: return <Star className="w-4 h-4 text-purple-600" />;
      case UserRole.CLIENT: return <Users className="w-4 h-4 text-green-600" />;
      case UserRole.VIEWER: return <Zap className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case UserRole.ADMIN: return 'bg-blue-100 text-blue-700 border-blue-200';
      case UserRole.MODERATOR: return 'bg-purple-100 text-purple-700 border-purple-200';
      case UserRole.CLIENT: return 'bg-green-100 text-green-700 border-green-200';
      case UserRole.VIEWER: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">AP</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Ads Pro
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Professional Campaign Analytics Platform
          </p>
          <Badge variant="secondary" className="mb-4">
            🔧 Development Mode
          </Badge>
        </div>
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-xl shadow-gray-500/10">
            <CardHeader className="text-center">
              <CardTitle>Mock Login</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-12 rounded-xl border-2 focus:border-blue-500 transition-colors"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="h-12 rounded-xl border-2 focus:border-blue-500 transition-colors"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Σύνδεση...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="w-5 h-5" />
                      Σύνδεση
                    </div>
                  )}
                </Button>
              </form>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Development Mode - Professional Testing Environment
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full max-w-md mx-auto mt-8">
          <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-xl shadow-gray-500/10">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                <UserCheck className="w-7 h-7 text-blue-600" />
                Demo Users
              </CardTitle>
              <CardDescription className="text-base">
                Professional testing accounts για διαφορετικούς ρόλους και permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {MOCK_USERS.filter(user => user.isActive).map((user) => (
                <div
                  key={user.id}
                  className="group p-4 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 rounded-2xl border border-transparent hover:border-gray-200/50 dark:hover:border-gray-600/50 transition-all duration-300 cursor-pointer"
                  onClick={() => handleQuickLogin(user.email)}
                >
                  <div className="flex items-center gap-4">
                    <img src={user.imageUrl} alt={user.firstName} className="w-12 h-12 rounded-full object-cover border-2 border-blue-500" />
                    <div>
                      <div className="font-bold text-lg text-gray-900 dark:text-white">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">{user.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}