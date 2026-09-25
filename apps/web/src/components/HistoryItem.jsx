import React from 'react';
import { Eye, Copy, Printer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HistoryItem({ receipt, onView, onDuplicate, onPrint, onDelete }) {
  const { t } = useLanguage();

  const calculateTotal = () => {
    const subtotal = receipt.items.reduce((sum, item) => sum + (item.total || 0), 0);
    const discount = receipt.discountType === 'percentage' 
      ? (subtotal * parseFloat(receipt.discountValue || 0)) / 100
      : parseFloat(receipt.discountValue || 0);
    const afterDiscount = subtotal - discount;
    const vat = (afterDiscount * parseFloat(receipt.vat || 0)) / 100;
    const service = (afterDiscount * parseFloat(receipt.serviceCharge || 0)) / 100;
    return subtotal - discount + vat + service;
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-semibold text-base mb-1">{receipt.storeName || 'Unnamed Store'}</div>
            <div className="text-sm text-muted-foreground">{receipt.orderId || 'No Order ID'}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">${calculateTotal().toFixed(2)}</div>
            <div className={`text-xs font-medium ${receipt.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
              {receipt.isPaid ? t('form.paid') : t('form.unpaid')}
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-3">
          {receipt.date} {receipt.time}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(receipt)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            {t('history.view')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDuplicate(receipt)}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-1" />
            {t('history.duplicate')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPrint(receipt)}
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(receipt.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}