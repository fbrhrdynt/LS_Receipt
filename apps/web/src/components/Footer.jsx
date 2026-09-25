import React from 'react';
import { Link } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/20 dark:border-white/10 glass-panel backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Receipt Generator</span>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Professional receipt generation made simple. By Febro Herdyanto.
            </p>
          </div>

          <div>
            <span className="text-sm font-semibold mb-4 block">Product</span>
            <ul className="space-y-2">
              <li>
                <Link to="/generator" className="text-sm text-foreground/70 hover:text-primary transition-all duration-200">
                  {t('nav.generator')}
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-sm text-foreground/70 hover:text-primary transition-all duration-200">
                  {t('nav.history')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-sm font-semibold mb-4 block">Author</span>
            <ul className="space-y-2">
              <li>
                <a href="https://linkedin.com/in/FebroHerdyanto" className="text-sm text-foreground/70 hover:text-primary transition-all duration-200">
                  Febro Herdyanto
                </a>
              </li>
              <li>
                <a href="https://febroherdyanto.web.id/" className="text-sm text-foreground/70 hover:text-primary transition-all duration-200">
                  Portfolio
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 dark:border-white/10">
          <p className="text-sm text-foreground/60 text-center">
            2026 Receipt Generator by Febro Herdyanto. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}