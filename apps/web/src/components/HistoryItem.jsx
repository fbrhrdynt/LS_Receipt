import React from 'react';
import { Copy, Eye, Printer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency } from '@/utils/CurrencySystem';

export default function HistoryItem({ receipt, onView, onDuplicate, onPrint, onDelete }) {
  const { t } = useLanguage();

  const calculateTotal = () => {
    const subtotal = (receipt.items || []).reduce(
      (sum, item) => sum + (Number(item.total) || 0),
      0
    );
    const discount =
      receipt.discountType === 'percentage'
        ? (subtotal * (Number(receipt.discountValue) || 0)) / 100
        : Number(receipt.discountValue) || 0;
    const afterDiscount = Math.max(0, subtotal - discount);
    const vat = (afterDiscount * (Number(receipt.vat) || 0)) / 100;
    const service = (afterDiscount * (Number(receipt.serviceCharge) || 0)) / 100;

    return afterDiscount + vat + service;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="truncate font-semibold">
              {receipt.storeName || t('history.unnamedStore')}
            </div>
            <div className="mt-1 truncate text-sm text-muted-foreground">
              {receipt.orderId || t('history.noOrderId')}
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-bold">
              {formatCurrency(calculateTotal(), receipt.currency || 'IDR')}
            </div>
            <div
              className={`mt-1 text-xs font-medium ${
                receipt.isPaid ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
              }`}
            >
              {receipt.isPaid ? t('form.paid') : t('form.unpaid')}
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          {receipt.date} {receipt.time}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
          <Button variant="outline" size="sm" onClick={() => onView(receipt)}>
            <Eye aria-hidden="true" />
            {t('history.view')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDuplicate(receipt)}>
            <Copy aria-hidden="true" />
            {t('history.duplicate')}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPrint(receipt)}
            aria-label={t('history.printAgain')}
          >
            <Printer aria-hidden="true" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(receipt.id)}
            aria-label={t('history.delete')}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
