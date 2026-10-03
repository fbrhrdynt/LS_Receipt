import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, HeartHandshake, Menu, Moon, Receipt, Sun, X } from 'lucide-react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/generator', label: t('nav.generator') },
    { to: '/history', label: t('nav.history') },
  ];

  const navClass = (path) =>
    `text-sm font-medium border-b-2 py-1 transition-colors ${
      isActive(path)
        ? 'border-primary text-foreground'
        : 'border-transparent text-muted-foreground hover:text-foreground'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-7">
            <Link
              to="/"
              className="flex min-w-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setMenuOpen(false)}
            >
              <Receipt className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate text-base font-bold tracking-tight">
                Receipt Generator
              </span>
            </Link>

            <nav className="hidden items-center gap-5 md:flex" aria-label={t('nav.primaryNavigation')}>
              {navItems.map((item) => (
                <Link key={item.to} to={item.to} className={navClass(item.to)}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={changeLanguage}>
              <SelectTrigger className="hidden w-[118px] sm:flex" aria-label={t('nav.language')}>
                <Globe className="mr-2 h-4 w-4" aria-hidden="true" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="id">Bahasa</SelectItem>
              </SelectContent>
            </Select>

            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <a
                href="https://saweria.co/fbrhrdynt"
                target="_blank"
                rel="noopener noreferrer"
              >
                <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                {t('support.button')}
              </a>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? t('nav.switchToDark') : t('nav.switchToLight')}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Sun className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-navigation" className="border-t border-border py-3 md:hidden">
            <nav className="grid gap-1" aria-label={t('nav.primaryNavigation')}>
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-11 items-center rounded-md px-3 text-sm font-medium ${
                    isActive(item.to)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <a
              href="https://saweria.co/fbrhrdynt"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-foreground hover:bg-muted sm:hidden"
            >
              <HeartHandshake className="h-4 w-4 text-primary" aria-hidden="true" />
              {t('support.mobileLink')}
            </a>

            <div className="mt-3 sm:hidden">
              <Select value={language} onValueChange={changeLanguage}>
                <SelectTrigger aria-label={t('nav.language')}>
                  <Globe className="mr-2 h-4 w-4" aria-hidden="true" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="id">Bahasa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
