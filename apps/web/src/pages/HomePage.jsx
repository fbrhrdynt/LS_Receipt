import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
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
      </Helmet>

      <div className="min-h-screen flex flex-col mesh-bg relative overflow-hidden">
        <Header />

        <main className="flex-1 flex flex-col justify-center relative z-10 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl mx-auto glass-panel p-10 sm:p-16 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden"
            >
              {/* Decorative top gradient inside the card */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
              
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-8">
                <Sparkles className="w-6 h-6" />
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                {t('home.title')}
                <span className="block text-2xl md:text-3xl font-medium text-foreground/70 mt-2">{t('home.author')}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-xl mx-auto leading-relaxed">
                {t('home.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="h-14 px-8 text-base font-semibold rounded-2xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95">
                  <Link to="/generator">
                    {t('home.cta')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}