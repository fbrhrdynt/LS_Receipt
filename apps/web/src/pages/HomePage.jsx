import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{`${t('home.title')} ${t('home.author')}`}</title>
        <meta name="description" content={t('home.subtitle')} />
        <link rel="canonical" href="https://receipt.febro.id/" />
      </Helmet>

      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />

        <main className="container mx-auto flex-1 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ReceiptText className="h-5 w-5 text-primary" aria-hidden="true" />
                <span>{t('home.utilityLabel')}</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                {t('home.title')}
              </h1>

              <p className="mt-3 text-lg font-medium text-muted-foreground">
                {t('home.author')}
              </p>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {t('home.subtitle')}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link to="/generator">{t('home.cta')}</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/history">{t('home.historyCta')}</Link>
                </Button>
              </div>
            </div>

            <aside className="border-y border-dashed border-border py-6 lg:border-x lg:px-8">
              <dl className="space-y-5">
                <div>
                  <dt className="text-sm font-semibold">{t('home.workflow.inputTitle')}</dt>
                  <dd className="mt-1 text-sm leading-6 text-muted-foreground">
                    {t('home.workflow.inputText')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold">{t('home.workflow.previewTitle')}</dt>
                  <dd className="mt-1 text-sm leading-6 text-muted-foreground">
                    {t('home.workflow.previewText')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold">{t('home.workflow.outputTitle')}</dt>
                  <dd className="mt-1 text-sm leading-6 text-muted-foreground">
                    {t('home.workflow.outputText')}
                  </dd>
                </div>
              </dl>
            </aside>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
