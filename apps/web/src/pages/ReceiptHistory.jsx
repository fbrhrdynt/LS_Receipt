import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HistoryItem from '@/components/HistoryItem';
import ReceiptPreview from '@/components/ReceiptPreview';
import { useLanguage } from '@/contexts/LanguageContext';
import { printReceipt } from '@/utils/ReceiptExport';
import { clearReceipts, readReceipts, writeReceipts } from '@/utils/ReceiptStorage';

export default function ReceiptHistory() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState('');

  const loadReceipts = () => {
    setLoading(true);
    const result = readReceipts();

    setReceipts(result.receipts);
    setFilteredReceipts(result.receipts);
    setStorageError(result.error ? t('history.storageError') : '');
    setLoading(false);
  };

  useEffect(() => {
    loadReceipts();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setFilteredReceipts(receipts);
      return;
    }

    setFilteredReceipts(
      receipts.filter(
        (receipt) =>
          receipt.storeName?.toLowerCase().includes(query) ||
          receipt.orderId?.toLowerCase().includes(query) ||
          receipt.customer?.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, receipts]);

  const handleView = (receipt) => {
    setSelectedReceipt(receipt);
    setIsPreviewOpen(true);
  };

  const handleDuplicate = (receipt) => {
    navigate('/generator', { state: { formData: receipt } });
    toast.success(t('history.duplicated'));
  };

  const handlePrintModal = () => {
    try {
      printReceipt('receipt-preview');
    } catch {
      toast.error(t('messages.exportError'));
    }
  };

  const handlePrintInline = (receipt) => {
    setSelectedReceipt(receipt);
    setIsPreviewOpen(true);
    window.setTimeout(handlePrintModal, 250);
  };

  const handleDelete = (id) => {
    const updated = receipts.filter((receipt) => receipt.id !== id);
    const result = writeReceipts(updated);

    if (!result.ok) {
      setStorageError(t('history.saveError'));
      return;
    }

    setReceipts(updated);
    toast.success(t('history.deleted'));

    if (selectedReceipt?.id === id) {
      setIsPreviewOpen(false);
      setSelectedReceipt(null);
    }
  };

  const handleClearDamagedHistory = () => {
    const result = clearReceipts();

    if (!result.ok) {
      setStorageError(t('history.clearError'));
      return;
    }

    setStorageError('');
    setReceipts([]);
    setFilteredReceipts([]);
  };

  return (
    <>
      <Helmet>
        <title>{`${t('history.title')} | Receipt Generator`}</title>
        <meta name="description" content={t('history.description')} />
        <link rel="canonical" href="https://receipt.febro.id/history" />
      </Helmet>

      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />

        <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{t('history.title')}</h1>
            <p className="mt-2 text-muted-foreground">{t('history.subtitle')}</p>
          </div>

          {storageError ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6" role="alert">
              <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
              <h2 className="mt-3 font-semibold">{t('history.storageErrorTitle')}</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{storageError}</p>
              <Button className="mt-4" variant="destructive" onClick={handleClearDamagedHistory}>
                {t('history.clearDamagedHistory')}
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 max-w-xl">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    placeholder={t('history.search')}
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="pl-10"
                    aria-label={t('history.search')}
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-16 text-center text-sm text-muted-foreground" role="status">
                  {t('history.loading')}
                </div>
              ) : filteredReceipts.length === 0 ? (
                <div className="border-y border-dashed border-border py-16 text-center">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
                  <h2 className="mt-4 text-xl font-semibold">{t('history.noReceipts')}</h2>
                  <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                    {t('history.noReceiptsDescription')}
                  </p>
                  <Button asChild className="mt-6">
                    <Link to="/generator">{t('home.cta')}</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredReceipts.map((receipt) => (
                    <HistoryItem
                      key={receipt.id}
                      receipt={receipt}
                      onView={handleView}
                      onDuplicate={handleDuplicate}
                      onPrint={() => handlePrintInline(receipt)}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        <Footer />
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[420px] overflow-hidden p-0">
          <DialogHeader className="border-b border-border bg-background p-4">
            <DialogTitle>{t('history.previewTitle')}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[65vh] overflow-y-auto bg-muted/40 p-6">
            {selectedReceipt && (
              <div className="mx-auto flex justify-center">
                <ReceiptPreview formData={selectedReceipt} />
              </div>
            )}
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-border bg-background p-4 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              {t('history.close')}
            </Button>
            <Button onClick={handlePrintModal}>{t('form.print')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
