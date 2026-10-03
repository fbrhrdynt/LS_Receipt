import React, { useState } from 'react';
import { HeartHandshake, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const DISMISS_KEY = 'receipt-support-banner-dismissed';

export default function SupportBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) !== '1';
    } catch {
      return true;
    }
  });

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Keep the banner dismissible even when sessionStorage is unavailable.
    }

    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      className="border-b border-border bg-muted/50"
      aria-label={t('support.ariaLabel')}
    >
      <div className="container mx-auto flex min-h-12 items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <HeartHandshake
          className="h-5 w-5 shrink-0 text-primary"
          aria-hidden="true"
        />

        <p className="min-w-0 flex-1 text-sm leading-5 text-foreground">
          <span className="font-medium">{t('support.title')}</span>
          <span className="ml-1 text-muted-foreground">
            {t('support.description')}
          </span>
        </p>

        <Button asChild size="sm" className="shrink-0">
          <a
            href="https://saweria.co/fbrhrdynt"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('support.button')}
          </a>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={dismiss}
          aria-label={t('support.dismiss')}
          title={t('support.dismiss')}
        >
          <X aria-hidden="true" />
        </Button>
      </div>
    </aside>
  );
}
