import React from 'react';
import { Plus, RefreshCw, Store, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { CURRENCY_CONFIG, formatCurrency } from '@/utils/CurrencySystem';
import {
  CLASSIC_RECEIPT_TEMPLATES,
  REACT_RECEIPT_TEMPLATES,
} from '@/templates/ReceiptTemplateRegistry';
import {
  generateRandomCashierName,
  generateRandomCustomerName,
  generateRandomFooter,
  generateRandomOrderId,
  generateRandomStoreName,
} from '@/utils/RandomGenerators';

function Section({ title, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export default function ReceiptForm({ formData, setFormData }) {
  const { t } = useLanguage();

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateVisibility = (field, value) => {
    setFormData((current) => ({
      ...current,
      visibility: { ...current.visibility, [field]: value },
    }));
  };

  const updateItem = (index, field, value) => {
    const nextItems = [...formData.items];
    const nextItem = { ...nextItems[index], [field]: value };

    if (['quantity', 'unitPrice', 'discount'].includes(field)) {
      const quantity = Number(nextItem.quantity) || 0;
      const price = Number(nextItem.unitPrice) || 0;
      const discount = Number(nextItem.discount) || 0;
      nextItem.total = Math.max(0, quantity * price - discount);
    }

    nextItems[index] = nextItem;
    updateField('items', nextItems);
  };

  const addItem = () => {
    updateField('items', [
      ...formData.items,
      { name: '', quantity: 1, unitPrice: 0, discount: 0, total: 0 },
    ]);
  };

  const removeItem = (index) => {
    updateField(
      'items',
      formData.items.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const subtotal = formData.items.reduce(
    (sum, item) => sum + (Number(item.total) || 0),
    0
  );

  const globalDiscount =
    formData.discountType === 'percentage'
      ? (subtotal * (Number(formData.discountValue) || 0)) / 100
      : Number(formData.discountValue) || 0;

  const afterDiscount = Math.max(0, subtotal - globalDiscount);
  const vatAmount = afterDiscount * ((Number(formData.vat) || 0) / 100);
  const serviceAmount =
    afterDiscount * ((Number(formData.serviceCharge) || 0) / 100);
  const grandTotal = afterDiscount + vatAmount + serviceAmount;
  const change = Math.max(0, (Number(formData.amountPaid) || 0) - grandTotal);

  const randomButton = (label, action) => (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={action}
      aria-label={label}
      title={label}
      className="shrink-0"
    >
      <RefreshCw aria-hidden="true" />
    </Button>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Store className="h-5 w-5 text-primary" aria-hidden="true" />
            {t('form.selectTemplate')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-7 pt-5 sm:pt-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold">{t('form.reactTemplates')}</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {REACT_RECEIPT_TEMPLATES.map((template, index) => (
                <button
                  key={template.id}
                  type="button"
                  aria-pressed={formData.template === template.id}
                  onClick={() => updateField('template', template.id)}
                  className={`min-h-16 rounded-md border px-3 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    formData.template === template.id
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'border-border bg-background hover:bg-muted'
                  }`}
                >
                  <span className="block text-xs text-muted-foreground">{index + 1}</span>
                  <span className="mt-1 block font-medium leading-tight">
                    {t(`templates.${template.id}`)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="border-t border-border pt-6">
            <h2 className="mb-3 text-sm font-semibold">{t('form.classicTemplates')}</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7">
              {CLASSIC_RECEIPT_TEMPLATES.map((template, index) => (
                <button
                  key={template.id}
                  type="button"
                  aria-pressed={formData.template === template.id}
                  onClick={() => updateField('template', template.id)}
                  className={`min-h-14 rounded-md border px-2 py-2 text-center text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    formData.template === template.id
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'border-border bg-background hover:bg-muted'
                  }`}
                >
                  <span className="block text-[11px] text-muted-foreground">{index + 1}</span>
                  <span className="font-medium">{template.name}</span>
                </button>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>

      <Section title={t('form.configuration')}>
        <div className="space-y-2">
          <Label>{t('form.currency')}</Label>
          <Select value={formData.currency} onValueChange={(value) => updateField('currency', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(CURRENCY_CONFIG).map((code) => (
                <SelectItem key={code} value={code}>
                  {t(`currencies.${code}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Section title={t('form.storeInfo')}>
        <div className="space-y-2">
          <Label htmlFor="storeName">{t('form.storeName')}</Label>
          <div className="flex gap-2">
            <Input
              id="storeName"
              value={formData.storeName}
              onChange={(event) => updateField('storeName', event.target.value)}
            />
            {randomButton(t('form.randomStore'), () =>
              updateField('storeName', generateRandomStoreName())
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">{t('form.address')}</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(event) => updateField('address', event.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">{t('form.phone')}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(event) => updateField('phone', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('form.email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">{t('form.website')}</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(event) => updateField('website', event.target.value)}
            placeholder="https://example.com"
          />
        </div>
      </Section>

      <Section title={t('form.orderInfo')}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="orderId">{t('form.orderId')}</Label>
            <div className="flex gap-2">
              <Input
                id="orderId"
                value={formData.orderId}
                onChange={(event) => updateField('orderId', event.target.value)}
              />
              {randomButton(t('form.randomOrderId'), () =>
                updateField('orderId', generateRandomOrderId())
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">{t('form.invoiceNumber')}</Label>
            <Input
              id="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={(event) => updateField('invoiceNumber', event.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">{t('form.date')}</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(event) => updateField('date', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">{t('form.time')}</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(event) => updateField('time', event.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cashier">{t('form.cashier')}</Label>
            <div className="flex gap-2">
              <Input
                id="cashier"
                value={formData.cashier}
                onChange={(event) => updateField('cashier', event.target.value)}
              />
              {randomButton(t('form.randomCashier'), () =>
                updateField('cashier', generateRandomCashierName())
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer">{t('form.customer')}</Label>
            <div className="flex gap-2">
              <Input
                id="customer"
                value={formData.customer}
                onChange={(event) => updateField('customer', event.target.value)}
              />
              {randomButton(t('form.randomCustomer'), () =>
                updateField('customer', generateRandomCustomerName())
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tableNumber">{t('form.tableNumber')}</Label>
            <Input
              id="tableNumber"
              value={formData.tableNumber || ''}
              onChange={(event) => updateField('tableNumber', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pumpNumber">{t('form.pumpNumber')}</Label>
            <Input
              id="pumpNumber"
              value={formData.pumpNumber || ''}
              onChange={(event) => updateField('pumpNumber', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stylistName">{t('form.stylistName')}</Label>
            <Input
              id="stylistName"
              value={formData.stylistName || ''}
              onChange={(event) => updateField('stylistName', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickupDate">{t('form.pickupDate')}</Label>
            <Input
              id="pickupDate"
              type="date"
              value={formData.pickupDate || ''}
              onChange={(event) => updateField('pickupDate', event.target.value)}
            />
          </div>
        </div>
      </Section>

      <Section title={t('form.items')}>
        {formData.items.map((item, index) => (
          <div key={index} className="rounded-md border border-border p-4">
            <div className="space-y-2">
              <Label htmlFor={`item-name-${index}`}>{t('form.itemName')}</Label>
              <Input
                id={`item-name-${index}`}
                value={item.name}
                onChange={(event) => updateItem(index, 'name', event.target.value)}
              />
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor={`item-qty-${index}`}>{t('form.qty')}</Label>
                <Input
                  id={`item-qty-${index}`}
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(event) => updateItem(index, 'quantity', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`item-price-${index}`}>{t('form.unitPrice')}</Label>
                <Input
                  id={`item-price-${index}`}
                  type="number"
                  value={item.unitPrice}
                  min="0"
                  step="0.01"
                  onChange={(event) => updateItem(index, 'unitPrice', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`item-discount-${index}`}>{t('form.discount')}</Label>
                <Input
                  id={`item-discount-${index}`}
                  type="number"
                  value={item.discount}
                  min="0"
                  step="0.01"
                  onChange={(event) => updateItem(index, 'discount', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('form.total')}</Label>
                <div className="flex min-h-11 items-center rounded-md border border-input bg-muted px-3 text-sm">
                  {formatCurrency(item.total, formData.currency)}
                </div>
              </div>
            </div>

            {formData.items.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="mt-3"
                onClick={() => removeItem(index)}
              >
                <Trash2 aria-hidden="true" />
                {t('form.removeItem')}
              </Button>
            )}
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addItem}>
          <Plus aria-hidden="true" />
          {t('form.addItem')}
        </Button>
      </Section>

      <Section title={t('form.pricing')}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t('form.discountType')}</Label>
            <Select
              value={formData.discountType}
              onValueChange={(value) => updateField('discountType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">{t('form.percentage')}</SelectItem>
                <SelectItem value="fixed">{t('form.fixedAmount')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountValue">{t('form.discount')}</Label>
            <Input
              id="discountValue"
              type="number"
              value={formData.discountValue}
              min="0"
              step="0.01"
              onChange={(event) => updateField('discountValue', event.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vat">{t('form.vat')}</Label>
            <Input
              id="vat"
              type="number"
              value={formData.vat}
              min="0"
              max="100"
              step="0.1"
              onChange={(event) => updateField('vat', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serviceCharge">{t('form.serviceCharge')}</Label>
            <Input
              id="serviceCharge"
              type="number"
              value={formData.serviceCharge}
              min="0"
              max="100"
              step="0.1"
              onChange={(event) => updateField('serviceCharge', event.target.value)}
            />
          </div>
        </div>

        <dl className="space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t('form.subtotal')}</dt>
            <dd className="font-medium">{formatCurrency(subtotal, formData.currency)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t('form.totalDiscount')}</dt>
            <dd className="font-medium">-{formatCurrency(globalDiscount, formData.currency)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t('form.tax')}</dt>
            <dd className="font-medium">{formatCurrency(vatAmount + serviceAmount, formData.currency)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-border pt-2 text-base font-bold">
            <dt>{t('form.grandTotal')}</dt>
            <dd>{formatCurrency(grandTotal, formData.currency)}</dd>
          </div>
        </dl>
      </Section>

      <Section title={t('form.payment')}>
        <div className="space-y-2">
          <Label>{t('form.paymentMethod')}</Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) => updateField('paymentMethod', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['cash', 'debitCard', 'creditCard', 'qris', 'gopay', 'ovo', 'dana', 'shopeepay', 'bankTransfer'].map((method) => (
                <SelectItem key={method} value={method}>
                  {t(`paymentMethods.${method}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="amountPaid">{t('form.amountPaid')}</Label>
            <Input
              id="amountPaid"
              type="number"
              value={formData.amountPaid}
              min="0"
              step="0.01"
              onChange={(event) => updateField('amountPaid', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('form.change')}</Label>
            <div className="flex min-h-11 items-center rounded-md border border-input bg-muted px-3 text-sm">
              {formatCurrency(change, formData.currency)}
            </div>
          </div>
        </div>

        <label className="flex min-h-11 cursor-pointer items-center gap-3">
          <Checkbox
            id="isPaid"
            checked={formData.isPaid}
            onCheckedChange={(checked) => updateField('isPaid', Boolean(checked))}
          />
          <span className="text-sm font-medium">
            {formData.isPaid ? t('form.paid') : t('form.unpaid')}
          </span>
        </label>
      </Section>

      <Section title={t('visibility.title')}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          {[
            ['showStoreName', 'visibility.storeName'],
            ['showAddress', 'visibility.address'],
            ['showCustomer', 'visibility.customer'],
            ['showCashier', 'visibility.cashier'],
            ['showTax', 'visibility.tax'],
            ['showDiscount', 'visibility.discount'],
            ['showFooterNote', 'visibility.footerNote'],
            ['showPaymentMethod', 'visibility.paymentMethod'],
            ['showWatermark', 'visibility.watermark'],
          ].map(([field, label]) => (
            <div key={field} className="flex min-h-11 items-center justify-between gap-4">
              <Label htmlFor={field} className="leading-5">
                {t(label)}
              </Label>
              <Switch
                id={field}
                checked={Boolean(formData.visibility?.[field])}
                onCheckedChange={(checked) => updateVisibility(field, checked)}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title={t('form.footer')}>
        <div className="space-y-2">
          <Label htmlFor="footerNote">{t('form.footerNote')}</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateField('footerNote', generateRandomFooter())}
            >
              <RefreshCw aria-hidden="true" />
              {t('form.randomFooter')}
            </Button>
          </div>
          <Textarea
            id="footerNote"
            value={formData.footerNote}
            onChange={(event) => updateField('footerNote', event.target.value)}
            rows={3}
          />
        </div>
      </Section>
    </div>
  );
}
