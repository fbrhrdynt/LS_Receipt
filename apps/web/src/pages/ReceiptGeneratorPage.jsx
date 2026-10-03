import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { Download, FileImage, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportBanner from '@/components/SupportBanner';
import ReceiptForm from '@/components/ReceiptForm';
import ReceiptPreview from '@/components/ReceiptPreview';
import LocalReceiptGenerator from '@/components/LocalReceiptGenerator';
import { useLanguage } from '@/contexts/LanguageContext';
import { exportAsJPG, exportAsPNG, exportAsPDF, printReceipt } from '@/utils/ReceiptExport';
import { createReceiptId, readReceipts, writeReceipts } from '@/utils/ReceiptStorage';

function createInitialFormData() {
  return {
    currency: 'IDR',
    template: 'warungMakan',
    visibility: {
      showStoreName: true,
      showAddress: true,
      showCustomer: true,
      showCashier: true,
      showTax: true,
      showDiscount: true,
      showFooterNote: true,
      showPaymentMethod: true,
      showWatermark: false,
    },
    storeName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    orderId: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    }),
    cashier: '',
    customer: '',
    tableNumber: '',
    pumpNumber: '',
    stylistName: '',
    pickupDate: '',
    items: [{ name: '', quantity: 1, unitPrice: 0, discount: 0, total: 0 }],
    discountType: 'percentage',
    discountValue: 0,
    vat: 0,
    serviceCharge: 0,
    paymentMethod: 'cash',
    amountPaid: 0,
    isPaid: false,
    footerNote: '',
  };
}

export default function ReceiptGeneratorPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const [receiptId, setReceiptId] = useState(createReceiptId);
  const [storageError, setStorageError] = useState('');
  const [formData, setFormData] = useState(createInitialFormData);

  useEffect(() => {
    const duplicated = location.state?.formData;
    if (!duplicated) return;

    const { id, savedAt, ...copy } = duplicated;
    setReceiptId(createReceiptId());
    setFormData((current) => ({
      ...current,
      ...copy,
      visibility: {
        ...current.visibility,
        ...(copy.visibility || {}),
      },
      items:
        Array.isArray(copy.items) && copy.items.length
          ? copy.items
          : current.items,
    }));
  }, [location.state]);

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      if (!formData.storeName && !formData.orderId) return;

      const { receipts, error } = readReceipts();

      if (error) {
        setStorageError(t('history.storageError'));
      }

      const nextReceipt = {
        id: receiptId,
        ...formData,
        savedAt: new Date().toISOString(),
      };

      const existingIndex = receipts.findIndex((receipt) => receipt.id === receiptId);
      const nextReceipts = [...receipts];

      if (existingIndex >= 0) {
        nextReceipts[existingIndex] = nextReceipt;
      } else {
        nextReceipts.unshift(nextReceipt);
      }

      const result = writeReceipts(nextReceipts.slice(0, 100));

      if (!result.ok) {
        setStorageError(t('history.saveError'));
      } else if (!error) {
        setStorageError('');
      }
    }, 1200);

    return () => window.clearTimeout(debounceTimer);
  }, [formData, receiptId, t]);

  const handleLocalGenerate = (generatedFormData) => {
    setReceiptId(createReceiptId());
    setStorageError('');
    setFormData((current) => ({
      ...current,
      ...generatedFormData,
      visibility: {
        ...current.visibility,
        ...(generatedFormData.visibility || {}),
      },
      items:
        Array.isArray(generatedFormData.items) && generatedFormData.items.length
          ? generatedFormData.items
          : current.items,
    }));
  };

  const exportWithToast = async (action) => {
    try {
      await action();
      toast.success(t('messages.exportSuccess'));
    } catch {
      toast.error(t('messages.exportError'));
    }
  };

  const handlePrint = () => {
    try {
      printReceipt('receipt-preview');
    } catch {
      toast.error(t('messages.exportError'));
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${t('nav.generator')} | Receipt Generator`}</title>
        <meta name="description" content={t('generator.description')} />
        <link rel="canonical" href="https://receipt.febro.id/generator" />
      </Helmet>

      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <SupportBanner />

        <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t('nav.generator')}</h1>
              <p className="mt-2 text-muted-foreground">{t('generator.subtitle')}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  exportWithToast(() =>
                    exportAsJPG(
                      'receipt-preview',
                      `receipt-${formData.orderId || Date.now()}.jpg`
                    )
                  )
                }
              >
                <FileImage aria-hidden="true" />
                {t('form.downloadJPG')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  exportWithToast(() =>
                    exportAsPNG(
                      'receipt-preview',
                      `receipt-${formData.orderId || Date.now()}.png`
                    )
                  )
                }
              >
                <Download aria-hidden="true" />
                {t('form.downloadPNG')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  exportWithToast(() =>
                    exportAsPDF(
                      'receipt-preview',
                      `receipt-${formData.orderId || Date.now()}.pdf`
                    )
                  )
                }
              >
                <FileText aria-hidden="true" />
                {t('form.downloadPDF')}
              </Button>
              <Button size="sm" onClick={handlePrint}>
                <Printer aria-hidden="true" />
                {t('form.print')}
              </Button>
            </div>
          </div>

          {storageError && (
            <div
              role="alert"
              className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground"
            >
              {storageError}
            </div>
          )}

          <LocalReceiptGenerator onGenerate={handleLocalGenerate} />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="order-2 lg:order-1 lg:col-span-7 xl:col-span-8">
              <ReceiptForm formData={formData} setFormData={setFormData} />
            </div>

            <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-4">
              <div className="sticky top-24 rounded-lg border border-border bg-card p-4 sm:p-6">
                <div className="mx-auto w-full max-w-[500px] overflow-x-auto">
                  <ReceiptPreview formData={formData} />
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
