// Public Navigation Component
// For Landing Page and Public Routes

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  LogIn, 
  UserPlus, 
  ArrowRight,
  Sparkles,
  Shield,
  BarChart3,
  Languages
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PublicNavigationProps {
  className?: string;
}

export function PublicNavigation({ className = "" }: PublicNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language;
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ADPD
                </span>
                <span className="text-xs text-gray-500 -mt-1">
                  Ads Pro
                </span>
              </div>
            </Link>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              <Sparkles className="w-3 h-3 mr-1" />
              Beta
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link 
                to="/#features" 
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium"
              >
                {t('landing.nav.features')}
              </Link>
              <Link 
                to="/#pricing" 
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium"
              >
                {t('landing.nav.pricing')}
              </Link>
              <Link 
                to="/#about" 
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium"
              >
                {t('landing.nav.about')}
              </Link>
            </div>

            {/* Language Selector & Auth Buttons */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-950/30"
                  >
                    <Languages className="w-4 h-4 mr-1" />
                    {currentLanguage === 'el' ? 'ΕΛ' : 'EN'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => changeLanguage('en')}
                    className={currentLanguage === 'en' ? 'bg-blue-50 text-blue-700' : ''}
                  >
                    🇺🇸 English
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => changeLanguage('el')}
                    className={currentLanguage === 'el' ? 'bg-blue-50 text-blue-700' : ''}
                  >
                    🇬🇷 Ελληνικά
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="ghost" 
                onClick={handleLogin}
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-950/30"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {t('landing.nav.signIn')}
              </Button>
              
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {t('landing.nav.getStarted')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20">
            <div className="px-4 py-6 space-y-4">
              {/* Navigation Links */}
              <div className="space-y-4">
                <Link 
                  to="/#features" 
                  className="block text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('landing.nav.features')}
                </Link>
                <Link 
                  to="/#pricing" 
                  className="block text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('landing.nav.pricing')}
                </Link>
                <Link 
                  to="/#about" 
                  className="block text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('landing.nav.about')}
                </Link>
              </div>

              {/* Mobile Language Selector & Auth Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {/* Mobile Language Selector */}
                <div className="flex gap-2 mb-3">
                  <Button 
                    variant={currentLanguage === 'en' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => changeLanguage('en')}
                    className="flex-1"
                  >
                    🇺🇸 English
                  </Button>
                  <Button 
                    variant={currentLanguage === 'el' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => changeLanguage('el')}
                    className="flex-1"
                  >
                    🇬🇷 Ελληνικά
                  </Button>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleLogin();
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t('landing.nav.signIn')}
                </Button>
                
                <Button 
                  onClick={() => {
                    handleGetStarted();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('landing.nav.getStarted')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}