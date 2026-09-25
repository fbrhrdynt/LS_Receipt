import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Globe, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 dark:border-white/10 glass-panel">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 transition-all duration-200 hover:opacity-80">
              <Receipt className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-tight hidden sm:inline-block text-balance">Receipt Generator <span className="text-sm font-medium text-muted-foreground ml-1">by Febro Herdyanto</span></span>
              <span className="text-lg font-bold tracking-tight sm:hidden">Receipt Generator</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/generator"
                className={`text-sm font-medium transition-all duration-200 ${
                  isActive('/generator') 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {t('nav.generator')}
              </Link>
              <Link
                to="/history"
                className={`text-sm font-medium transition-all duration-200 ${
                  isActive('/history') 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {t('nav.history')}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={changeLanguage}>
              <SelectTrigger className="w-[110px] h-9 bg-transparent border-white/20 dark:border-white/10">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="id">Bahasa</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}