import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Download, Printer, FileImage, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReceiptForm from '@/components/ReceiptForm';
import ReceiptPreview from '@/components/ReceiptPreview';
import { useLanguage } from '@/contexts/LanguageContext';
import { exportAsJPG, exportAsPNG, exportAsPDF, printReceipt } from '@/utils/ReceiptExport';

export default function ReceiptGeneratorPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
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
      showWatermark: false
    },
    storeName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    orderId: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    cashier: '',
    customer: '',
    tableNumber: '',
    pumpNumber: '',
    stylistName: '',
    pickupDate: '',
    items: [
      { name: '', quantity: 1, unitPrice: 0, discount: 0, total: 0 }
    ],
    discountType: 'percentage',
    discountValue: 0,
    vat: 0,
    serviceCharge: 0,
    paymentMethod: 'cash',
    amountPaid: 0,
    isPaid: false,
    footerNote: ''
  });

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const receipts = JSON.parse(localStorage.getItem('receipts') || '[]');
      const newReceipt = {
        id: Date.now(),
        ...formData,
        savedAt: new Date().toISOString()
      };
      
      const existingIndex = receipts.findIndex(r => r.orderId === formData.orderId && formData.orderId);
      if (existingIndex >= 0) {
        receipts[existingIndex] = newReceipt;
      } else if (formData.storeName || formData.orderId) {
        receipts.unshift(newReceipt);
      }
      
      localStorage.setItem('receipts', JSON.stringify(receipts.slice(0, 100)));
    }, 2000);

    return () => clearTimeout(debounceTimer);
  }, [formData]);

  const handleExportJPG = async () => {
    try {
      await exportAsJPG('receipt-preview', `receipt-${formData.orderId || Date.now()}.jpg`);
      toast.success(t('messages.exportSuccess'));
    } catch (error) {
      toast.error(t('messages.exportError'));
    }
  };

  const handleExportPNG = async () => {
    try {
      await exportAsPNG('receipt-preview', `receipt-${formData.orderId || Date.now()}.png`);
      toast.success(t('messages.exportSuccess'));
    } catch (error) {
      toast.error(t('messages.exportError'));
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportAsPDF('receipt-preview', `receipt-${formData.orderId || Date.now()}.pdf`);
      toast.success(t('messages.exportSuccess'));
    } catch (error) {
      toast.error(t('messages.exportError'));
    }
  };

  const handlePrint = () => {
    try {
      printReceipt('receipt-preview');
      toast.success(t('messages.printSuccess'));
    } catch (error) {
      toast.error(t('messages.exportError'));
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${t('nav.generator')} - Receipt Generator by Febro Herdyanto`}</title>
        <meta name="description" content="Create professional thermal receipts with our easy-to-use generator. Real-time preview, currency selection, and instant export." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-muted/10">
        <Header />

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{t('nav.generator')}</h1>
                <p className="text-muted-foreground">Configure and customize your thermal receipt</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportJPG}
                  className="transition-all duration-200 hover:bg-background active:scale-[0.98]"
                >
                  <FileImage className="h-4 w-4 mr-2" />
                  {t('form.downloadJPG')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPNG}
                  className="transition-all duration-200 hover:bg-background active:scale-[0.98]"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('form.downloadPNG')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  className="transition-all duration-200 hover:bg-background active:scale-[0.98]"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {t('form.downloadPDF')}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handlePrint}
                  className="transition-all duration-200 active:scale-[0.98]"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  {t('form.print')}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
                <ReceiptForm formData={formData} setFormData={setFormData} />
              </div>

              <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2">
                <div className="sticky top-24">
                  <div className="bg-background border border-border shadow-xl p-4 sm:p-8 rounded-2xl flex items-start justify-center min-h-[600px] overflow-x-auto">
                    <div className="w-full max-w-[500px]">
                       <ReceiptPreview formData={formData} />
                    </div>
                  </div>
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