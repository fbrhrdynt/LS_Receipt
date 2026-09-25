import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HistoryItem from '@/components/HistoryItem';
import ReceiptPreview from '@/components/ReceiptPreview';
import { useLanguage } from '@/contexts/LanguageContext';
import { printReceipt } from '@/utils/ReceiptExport';

export default function ReceiptHistory() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    loadReceipts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredReceipts(receipts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = receipts.filter(receipt => 
        receipt.storeName?.toLowerCase().includes(query) ||
        receipt.orderId?.toLowerCase().includes(query) ||
        receipt.customer?.toLowerCase().includes(query)
      );
      setFilteredReceipts(filtered);
    }
  }, [searchQuery, receipts]);

  const loadReceipts = () => {
    const stored = JSON.parse(localStorage.getItem('receipts') || '[]');
    setReceipts(stored);
    setFilteredReceipts(stored);
  };

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
      toast.success(t('messages.printSuccess'));
    } catch (error) {
      toast.error(t('messages.exportError'));
    }
  };

  const handlePrintInline = (receipt) => {
    // If not open in modal, we can open it briefly or just navigate
    setSelectedReceipt(receipt);
    setIsPreviewOpen(true);
    setTimeout(() => {
      handlePrintModal();
    }, 500);
  };

  const handleDelete = (id) => {
    const updated = receipts.filter(r => r.id !== id);
    localStorage.setItem('receipts', JSON.stringify(updated));
    setReceipts(updated);
    toast.success(t('history.deleted'));
    if (selectedReceipt?.id === id) {
      setIsPreviewOpen(false);
      setSelectedReceipt(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${t('history.title')} - Receipt Generator`}</title>
        <meta name="description" content="View and manage your thermal receipt history. Search, filter, duplicate, and print previous receipts." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{t('history.title')}</h1>
              <p className="text-muted-foreground">View and manage your saved thermal receipts</p>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('history.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-foreground"
                />
              </div>
              <Button variant="outline" className="transition-all duration-200 active:scale-[0.98]">
                <Filter className="h-4 w-4 mr-2" />
                {t('history.filter')}
              </Button>
            </div>

            {filteredReceipts.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">{t('history.noReceipts')}</h3>
                <p className="text-muted-foreground mb-6">{t('history.noReceiptsDescription')}</p>
                <Button asChild className="transition-all duration-200 active:scale-[0.98]">
                  <a href="/generator">{t('home.cta')}</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </main>

        <Footer />
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[400px] p-0 bg-muted/10">
          <DialogHeader className="p-4 bg-background border-b">
            <DialogTitle>{t('history.view')} Receipt</DialogTitle>
          </DialogHeader>
          <div className="p-6 flex justify-center bg-gray-100 overflow-y-auto max-h-[60vh]">
            {selectedReceipt && (
               <div className="shadow-lg drop-shadow-md">
                 <ReceiptPreview formData={selectedReceipt} />
               </div>
            )}
          </div>
          <div className="p-4 bg-background border-t flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              {t('history.close')}
            </Button>
            <Button onClick={handlePrintModal}>
              {t('form.print')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}