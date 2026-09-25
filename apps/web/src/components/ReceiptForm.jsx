import React from 'react';
import { Plus, Trash2, Sparkles, Settings, Store } from 'lucide-react';
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
import { CURRENCY_CONFIG } from '@/utils/CurrencySystem';
import { RECEIPT_TEMPLATES } from '@/utils/ReceiptTemplates';
import {
  generateRandomStoreName,
  generateRandomCustomerName,
  generateRandomCashierName,
  generateRandomFooter,
  generateRandomOrderId
} from '@/utils/RandomGenerators';

export default function ReceiptForm({ formData, setFormData }) {
  const { t } = useLanguage();

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateVisibility = (field, value) => {
    setFormData(prev => ({
      ...prev,
      visibility: { ...prev.visibility, [field]: value }
    }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
      const qty = parseFloat(newItems[index].quantity) || 0;
      const price = parseFloat(newItems[index].unitPrice) || 0;
      const discount = parseFloat(newItems[index].discount) || 0;
      newItems[index].total = (qty * price) - discount;
    }
    
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, unitPrice: 0, discount: 0, total: 0 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (formData.discountType === 'percentage') {
      return (subtotal * parseFloat(formData.discountValue || 0)) / 100;
    }
    return parseFloat(formData.discountValue || 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const afterDiscount = subtotal - discount;
    const vat = (afterDiscount * parseFloat(formData.vat || 0)) / 100;
    const service = (afterDiscount * parseFloat(formData.serviceCharge || 0)) / 100;
    return vat + service;
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  const calculateChange = () => {
    const grandTotal = calculateGrandTotal();
    const paid = parseFloat(formData.amountPaid || 0);
    return Math.max(0, paid - grandTotal);
  };

  return (
    <div className="space-y-6">
      {/* Template Selector Section */}
      <Card className="border-primary/20 shadow-md">
        <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
          <CardTitle className="text-lg flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            {t('form.selectTemplate')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {RECEIPT_TEMPLATES.map((tpl, idx) => (
              <button
                key={tpl.id}
                onClick={() => updateField('template', tpl.id)}
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-all duration-200 text-center ${
                  formData.template === tpl.id 
                    ? 'border-primary ring-1 ring-primary bg-primary/10 shadow-sm' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className={`text-lg font-black mb-1 ${formData.template === tpl.id ? 'text-primary' : 'text-muted-foreground'}`}>
                  {idx + 1}
                </div>
                <div className="text-xs font-semibold leading-tight line-clamp-2">
                  {t(`templates.${tpl.id}`)}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-muted/50 pb-4 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('form.configuration')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label>{t('form.currency')}</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => updateField('currency', value)}
            >
              <SelectTrigger className="w-full sm:max-w-xs">
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

          <div className="space-y-3">
            <Label className="text-sm font-semibold">{t('visibility.title')}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
              {Object.entries({
                showStoreName: 'storeName',
                showAddress: 'address',
                showCustomer: 'customer',
                showCashier: 'cashier',
                showTax: 'tax',
                showDiscount: 'discount',
                showFooterNote: 'footerNote',
                showPaymentMethod: 'paymentMethod',
                showWatermark: 'watermark'
              }).map(([key, labelKey]) => (
                <div key={key} className="flex items-center justify-between space-x-2">
                  <Label htmlFor={key} className="text-sm cursor-pointer font-normal">
                    {t(`visibility.${labelKey}`)}
                  </Label>
                  <Switch
                    id={key}
                    checked={formData.visibility[key]}
                    onCheckedChange={(checked) => updateVisibility(key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('form.storeInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">{t('form.storeName')}</Label>
            <div className="flex gap-2">
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) => updateField('storeName', e.target.value)}
                className="text-foreground"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => updateField('storeName', generateRandomStoreName())}
                className="shrink-0"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t('form.address')}</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t('form.phone')}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('form.email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="text-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('form.orderInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderId">{t('form.orderId')}</Label>
              <div className="flex gap-2">
                <Input
                  id="orderId"
                  value={formData.orderId}
                  onChange={(e) => updateField('orderId', e.target.value)}
                  className="text-foreground"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateField('orderId', generateRandomOrderId())}
                  className="shrink-0"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">{t('form.invoiceNumber')}</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => updateField('invoiceNumber', e.target.value)}
                className="text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">{t('form.date')}</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
                className="text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">{t('form.time')}</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => updateField('time', e.target.value)}
                className="text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cashier">{t('form.cashier')}</Label>
              <div className="flex gap-2">
                <Input
                  id="cashier"
                  value={formData.cashier}
                  onChange={(e) => updateField('cashier', e.target.value)}
                  className="text-foreground"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateField('cashier', generateRandomCashierName())}
                  className="shrink-0"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer">{t('form.customer')}</Label>
              <div className="flex gap-2">
                <Input
                  id="customer"
                  value={formData.customer}
                  onChange={(e) => updateField('customer', e.target.value)}
                  className="text-foreground"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateField('customer', generateRandomCustomerName())}
                  className="shrink-0"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Business Specific Fields */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <Label htmlFor="tableNumber">{t('form.tableNumber')}</Label>
              <Input
                id="tableNumber"
                value={formData.tableNumber || ''}
                onChange={(e) => updateField('tableNumber', e.target.value)}
                className="text-foreground"
                placeholder="e.g. 12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pumpNumber">{t('form.pumpNumber')}</Label>
              <Input
                id="pumpNumber"
                value={formData.pumpNumber || ''}
                onChange={(e) => updateField('pumpNumber', e.target.value)}
                className="text-foreground"
                placeholder="e.g. 3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stylistName">{t('form.stylistName')}</Label>
              <Input
                id="stylistName"
                value={formData.stylistName || ''}
                onChange={(e) => updateField('stylistName', e.target.value)}
                className="text-foreground"
                placeholder="e.g. Alex"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupDate">{t('form.pickupDate')}</Label>
              <Input
                id="pickupDate"
                type="date"
                value={formData.pickupDate || ''}
                onChange={(e) => updateField('pickupDate', e.target.value)}
                className="text-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('form.items')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-3 bg-muted/10">
              <div className="space-y-2">
                <Label>{t('form.itemName')}</Label>
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  className="text-foreground"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-2">
                  <Label>{t('form.qty')}</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    min="1"
                    className="text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('form.unitPrice')}</Label>
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                    min="0"
                    step="0.01"
                    className="text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('form.discount')}</Label>
                  <Input
                    type="number"
                    value={item.discount}
                    onChange={(e) => updateItem(index, 'discount', e.target.value)}
                    min="0"
                    step="0.01"
                    className="text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('form.total')}</Label>
                  <Input
                    type="number"
                    value={item.total.toFixed(2)}
                    readOnly
                    className="bg-muted text-foreground"
                  />
                </div>
              </div>
              {formData.items.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('form.removeItem')}
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('form.addItem')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('form.pricing')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label>{t('form.discount')}</Label>
              <Input
                type="number"
                value={formData.discountValue}
                onChange={(e) => updateField('discountValue', e.target.value)}
                min="0"
                step="0.01"
                className="text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('form.vat')}</Label>
              <Input
                type="number"
                value={formData.vat}
                onChange={(e) => updateField('vat', e.target.value)}
                min="0"
                max="100"
                step="0.1"
                className="text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('form.serviceCharge')}</Label>
              <Input
                type="number"
                value={formData.serviceCharge}
                onChange={(e) => updateField('serviceCharge', e.target.value)}
                min="0"
                max="100"
                step="0.1"
                className="text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('form.subtotal')}</span>
              <span className="font-medium">{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('form.totalDiscount')}</span>
              <span className="font-medium text-destructive">-{calculateDiscount().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('form.tax')}</span>
              <span className="font-medium">{calculateTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span>{t('form.grandTotal')}</span>
              <span>{calculateGrandTotal().toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('form.payment')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <SelectItem value="cash">{t('paymentMethods.cash')}</SelectItem>
                <SelectItem value="debitCard">{t('paymentMethods.debitCard')}</SelectItem>
                <SelectItem value="creditCard">{t('paymentMethods.creditCard')}</SelectItem>
                <SelectItem value="qris">{t('paymentMethods.qris')}</SelectItem>
                <SelectItem value="gopay">{t('paymentMethods.gopay')}</SelectItem>
                <SelectItem value="ovo">{t('paymentMethods.ovo')}</SelectItem>
                <SelectItem value="dana">{t('paymentMethods.dana')}</SelectItem>
                <SelectItem value="shopeepay">{t('paymentMethods.shopeepay')}</SelectItem>
                <SelectItem value="bankTransfer">{t('paymentMethods.bankTransfer')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('form.amountPaid')}</Label>
              <Input
                type="number"
                value={formData.amountPaid}
                onChange={(e) => updateField('amountPaid', e.target.value)}
                min="0"
                step="0.01"
                className="text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('form.change')}</Label>
              <Input
                type="number"
                value={calculateChange().toFixed(2)}
                readOnly
                className="bg-muted text-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isPaid"
              checked={formData.isPaid}
              onCheckedChange={(checked) => updateField('isPaid', checked)}
            />
            <Label htmlFor="isPaid" className="cursor-pointer">
              {formData.isPaid ? t('form.paid') : t('form.unpaid')}
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('form.footer')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t('form.footerNote')}</Label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateField('footerNote', generateRandomFooter())}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {t('form.randomFooter')}
              </Button>
            </div>
            <Textarea
              value={formData.footerNote}
              onChange={(e) => updateField('footerNote', e.target.value)}
              rows={3}
              className="text-foreground"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}