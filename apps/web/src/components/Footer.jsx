import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Receipt } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="font-bold">Receipt Generator</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold">{t('footer.product')}</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link className="text-sm text-muted-foreground hover:text-foreground" to="/generator">
                  {t('nav.generator')}
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-foreground" to="/history">
                  {t('nav.history')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold">{t('support.footerTitle')}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {t('support.footerDescription')}
            </p>
            <a
              href="https://saweria.co/fbrhrdynt"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-foreground hover:bg-muted"
            >
              <HeartHandshake className="h-4 w-4 text-primary" aria-hidden="true" />
              {t('support.button')}
            </a>
          </div>

          <div>
            <h2 className="text-sm font-semibold">{t('footer.author')}</h2>
            <ul className="mt-3 space-y-2">
              <li className="text-sm text-muted-foreground">Febro Herdyanto</li>
              <li>
                <a
                  href="https://febro.id/"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('footer.portfolio')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
}
