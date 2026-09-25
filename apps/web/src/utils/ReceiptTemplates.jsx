import React from 'react';
import { formatCurrency } from '@/utils/CurrencySystem';
import { useLanguage } from '@/contexts/LanguageContext';

// Custom Hook/Helper for standard logic, translated labels are passed from Preview
function useCalculations(formData) {
  const subtotal = formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
  const discount = formData.discountType === 'percentage' ? subtotal * parseFloat(formData.discountValue || 0) / 100 : parseFloat(formData.discountValue || 0);
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * parseFloat(formData.vat || 0) / 100 + afterDiscount * parseFloat(formData.serviceCharge || 0) / 100;
  const grandTotal = afterDiscount + tax;
  const change = Math.max(0, parseFloat(formData.amountPaid || 0) - grandTotal);
  return {
    subtotal,
    discount,
    tax,
    grandTotal,
    change
  };
}

// 1. Warung Makan
const WarungMakan = ({
  formData,
  t
}) => {
  const calc = useCalculations(formData);
  const {
    currency,
    visibility
  } = formData;
  return <div className="receipt-container font-mono-custom text-[13px] leading-[1.4] p-6 max-w-[320px] mx-auto shadow-md">
      <div className="text-center mb-2">
        {visibility.showStoreName && <h2 className="text-xl font-bold uppercase">{formData.storeName}</h2>}
        {visibility.showAddress && <p className="text-xs">{formData.address}</p>}
      </div>
      <div className="divider-eq"></div>
      <div className="text-xs space-y-1">
        <div className="flex justify-between"><span>{t('receipt.date')}: {formData.date}</span><span>{formData.time}</span></div>
        <div className="flex justify-between"><span>{t('receipt.order_id')}: {formData.orderId}</span></div>
        {formData.tableNumber && <div className="flex justify-between"><span>{t('receipt.table')}: {formData.tableNumber}</span></div>}
      </div>
      <div className="divider-eq"></div>
      <div className="my-2">
        {formData.items.map((item, i) => <div key={i} className="mb-1 text-xs">
            <div className="font-semibold">{item.name}</div>
            <div className="flex justify-between">
              <span className="pl-2">{item.quantity} x {formatCurrency(item.unitPrice, currency)}</span>
              <span>{formatCurrency(item.total, currency)}</span>
            </div>
          </div>)}
      </div>
      <div className="divider-dash"></div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between"><span>{t('receipt.subtotal')}</span><span>{formatCurrency(calc.subtotal, currency)}</span></div>
        {visibility.showTax && calc.tax > 0 && <div className="flex justify-between"><span>{t('receipt.tax')}</span><span>{formatCurrency(calc.tax, currency)}</span></div>}
        <div className="flex justify-between font-bold text-sm mt-1 pt-1 border-t border-dashed border-black">
          <span>{t('receipt.total')}</span><span>{formatCurrency(calc.grandTotal, currency)}</span>
        </div>
      </div>
      {visibility.showPaymentMethod && <div className="text-xs mt-2">
          <div className="flex justify-between"><span>{t('receipt.cash')}</span><span>{formatCurrency(formData.amountPaid, currency)}</span></div>
          <div className="flex justify-between"><span>{t('receipt.change')}</span><span>{formatCurrency(calc.change, currency)}</span></div>
        </div>}
      {visibility.showFooterNote && <div className="text-center text-xs mt-4 pt-2 border-t border-dashed border-black">
          {formData.footerNote || t('receipt.thank_you')}
        </div>}
    </div>;
};

// 2. Toko Sembako
const TokoSembako = ({
  formData,
  t
}) => {
  const calc = useCalculations(formData);
  const {
    currency,
    visibility
  } = formData;
  return <div className="receipt-container font-sans-custom text-[12px] leading-tight p-5 max-w-[300px] mx-auto shadow-sm border">
      <div className="mb-3">
        {visibility.showStoreName && <h2 className="text-lg font-bold">{formData.storeName}</h2>}
        {visibility.showAddress && <p>{formData.address}</p>}
      </div>
      <div className="divider-dash"></div>
      <div className="space-y-1 mb-2">
        <div>{t('receipt.order_id')}: {formData.orderId}</div>
        <div>{t('receipt.time')}: {formData.date} {formData.time}</div>
        {visibility.showCashier && <div>{t('receipt.cashier')}: {formData.cashier}</div>}
      </div>
      <div className="divider-dash"></div>
      <div className="mb-2">
        {formData.items.map((item, i) => <div key={i} className="mb-2 flex justify-between items-start">
            <div className="flex-1">
              <div className="font-bold">{item.name}</div>
              <div>{item.quantity} x {formatCurrency(item.unitPrice, currency)}</div>
            </div>
            <div className="text-right font-medium">{formatCurrency(item.total, currency)}</div>
          </div>)}
      </div>
      <div className="divider-dash"></div>
      <div className="space-y-1">
        <div className="flex justify-between font-black text-sm"><span>{t('receipt.total')}</span><span>{formatCurrency(calc.grandTotal, currency)}</span></div>
        {visibility.showPaymentMethod && <>
            <div className="flex justify-between"><span>{t('receipt.total_paid')}</span><span>{formatCurrency(formData.amountPaid, currency)}</span></div>
            <div className="flex justify-between"><span>{t('receipt.change')}</span><span>{formatCurrency(calc.change, currency)}</span></div>
          </>}
      </div>
      {visibility.showFooterNote && <div className="mt-4 text-center text-xs italic">{formData.footerNote || t('receipt.no_exchange')}</div>}
    </div>;
};

// 3. Cafe Modern
const CafeModern = ({
  formData,
  t
}) => {
  const calc = useCalculations(formData);
  const {
    currency,
    visibility
  } = formData;
  return <div className="receipt-container font-sans-custom text-[13px] p-6 max-w-[320px] mx-auto shadow-lg bg-gray-50">
      <div className="text-center mb-6">
        {visibility.showStoreName && <h1 className="text-2xl font-extrabold tracking-tight mb-1">{formData.storeName}</h1>}
        {visibility.showAddress && <p className="text-gray-500 text-xs">{formData.address}</p>}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mb-4">
        <span>{formData.date}</span>
        <span>#{formData.orderId}</span>
      </div>
      <div className="space-y-3 mb-4">
        {formData.items.map((item, i) => <div key={i} className="flex justify-between items-center">
            <div>
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs text-gray-500">{item.quantity} x {formatCurrency(item.unitPrice, currency)}</div>
            </div>
            <div className="font-medium">{formatCurrency(item.total, currency)}</div>
          </div>)}
      </div>
      <div className="border-t border-gray-200 pt-3 space-y-1">
        <div className="flex justify-between text-gray-500 text-xs"><span>{t('receipt.subtotal')}</span><span>{formatCurrency(calc.subtotal, currency)}</span></div>
        <div className="flex justify-between font-bold text-base pt-1">
          <span>{t('receipt.total')}</span><span>{formatCurrency(calc.grandTotal, currency)}</span>
        </div>
      </div>
      {visibility.showFooterNote && <div className="mt-6 text-center text-xs text-gray-400">{formData.footerNote || t('receipt.have_nice_day')}</div>}
    </div>;
};

// 4. SPBU (Gas Station)
const SPBU = ({
  formData,
  t
}) => {
  const calc = useCalculations(formData);
  const {
    currency,
    visibility
  } = formData;
  return <div className="receipt-container font-mono-custom text-[12px] p-4 max-w-[280px] mx-auto border shadow-sm">
      <div className="text-center mb-2">
        {visibility.showStoreName && <h2 className="text-lg font-bold">SPBU</h2>}
        {visibility.showStoreName && <h3 className="font-bold">{formData.storeName}</h3>}
        {visibility.showAddress && <p className="text-[10px]">{formData.address}</p>}
      </div>
      <div className="divider-solid"></div>
      <div className="text-[10px] space-y-1">
        <div>{t('receipt.time')} : {formData.date} {formData.time}</div>
        <div>{t('receipt.shift')} : 1</div>
        <div>{t('receipt.trans_no')}: {formData.orderId}</div>
        {formData.pumpNumber && <div>{t('receipt.pump')} : {formData.pumpNumber}</div>}
      </div>
      <div className="divider-solid"></div>
      <div className="space-y-2 my-2">
        {formData.items.map((item, i) => <div key={i}>
            <div className="font-bold">{item.name}</div>
            <div className="flex justify-between">
              <span>{t('receipt.price_liter')}</span>
              <span>{formatCurrency(item.unitPrice, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('receipt.volume')}</span>
              <span>{item.quantity}</span>
            </div>
            <div className="flex justify-between font-bold mt-1">
              <span>{t('receipt.rupiah')}</span>
              <span>{formatCurrency(item.total, currency)}</span>
            </div>
          </div>)}
      </div>
      <div className="divider-solid"></div>
      <div className="flex justify-between font-bold text-sm">
        <span>{t('receipt.total')}</span>
        <span>{formatCurrency(calc.grandTotal, currency)}</span>
      </div>
      {visibility.showPaymentMethod && <div className="flex justify-between text-[10px] mt-1">
          <span>{t('receipt.cash')}</span>
          <span>{formatCurrency(formData.amountPaid, currency)}</span>
        </div>}
      <div className="text-center mt-4 text-[10px] font-bold">{t('receipt.safe_flight')}</div>
    </div>;
};

// 5. Restaurant Casual
const RestaurantCasual = ({
  formData,
  t
}) => {
  const calc = useCalculations(formData);
  const {
    currency,
    visibility
  } = formData;
  return <div className="receipt-container font-sans-custom text-[13px] p-6 max-w-[340px] mx-auto border shadow-sm">
      <div className="text-center mb-4">
        {visibility.showStoreName && <h2 className="text-2xl font-bold mb-1">{formData.storeName}</h2>}
        <div className="inline-block border-y border-black py-1 px-4 text-xs font-bold tracking-widest">{t('receipt.guest_check')}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mb-4 border-b border-black pb-2">
        <div>{t('receipt.date')}: {formData.date}</div>
        <div className="text-right">{t('receipt.time')}: {formData.time}</div>
        {formData.tableNumber && <div>{t('receipt.table')}: {formData.tableNumber}</div>}
        {visibility.showCashier && <div className="text-right">{t('receipt.server')}: {formData.cashier}</div>}
      </div>
      <div className="space-y-2 mb-4">
        {formData.items.map((item, i) => <div key={i} className="flex justify-between items-start">
            <div className="flex gap-2">
              <span className="font-bold w-4">{item.quantity}</span>
              <span>{item.name}</span>
            </div>
            <span>{formatCurrency(item.total, currency)}</span>
          </div>)}
      </div>
      <div className="border-t border-black pt-2 space-y-1 text-xs">
        <div className="flex justify-between"><span>{t('receipt.subtotal')}</span><span>{formatCurrency(calc.subtotal, currency)}</span></div>
        {visibility.showTax && <div className="flex justify-between"><span>{t('receipt.tax_svc')}</span><span>{formatCurrency(calc.tax, currency)}</span></div>}
        <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2 border-black">
          <span>{t('receipt.amount_due')}</span><span>{formatCurrency(calc.grandTotal, currency)}</span>
        </div>
      </div>
      {visibility.showFooterNote && <div className="text-center mt-6 text-xs italic">
          {formData.footerNote || t('receipt.thank_you')}
        </div>}
    </div>;
};

// 6. Coffeeshop Trendy
const CoffeeshopTrendy = ({
  formData,
  t
}) => {
  const calc = useCalculations(formData);
  const {
    currency,
    visibility
  } = formData;
  return <div className="receipt-container font-serif-custom text-[13px] p-8 max-w-[320px] mx-auto shadow-xl bg-amber-50/20">
      <div className="text-center mb-6">
        {visibility.showStoreName && <h1 className="text-3xl font-medium tracking-wide mb-1 text-gray-800">{formData.storeName}</h1>}
        <div className="text-xs text-gray-400 uppercase tracking-widest">Coffee & Roastery</div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mb-4 font-sans-custom">
        <span>{formData.date}</span>
        <span>{t('receipt.order_id')} #{formData.orderId}</span>
      </div>
      <div className="space-y-3 mb-6 font-sans-custom">
        {formData.items.map((item, i) => <div key={i} className="flex justify-between items-baseline border-b border-gray-100 pb-1">
            <div>
              <div className="font-medium text-gray-800 text-sm">{item.name}</div>
              <div className="text-xs text-gray-400">{item.quantity}x</div>
            </div>
            <div className="font-medium">{formatCurrency(item.total, currency)}</div>
          </div>)}
      </div>
      <div className="space-y-1 mb-6 font-sans-custom text-sm">
        <div className="flex justify-between text-gray-600"><span>{t('receipt.total')}</span><span className="font-bold text-black">{formatCurrency(calc.grandTotal, currency)}</span></div>
      </div>
      {visibility.showFooterNote && <div className="text-center italic text-gray-500 mt-6 text-xs">
          {formData.footerNote || t('receipt.stay_caffeinated')}
        </div>}
    </div>;
};

// 7. Warung Kopi
const WarungKopi = ({
  formData,
  t
}) => {
  const calc = useCalculations(formData);
  const {
    currency,
    visibility
  } = formData;
  return <div className="receipt-container font-mono-custom text-[12px] p-4 max-w-[260px] mx-auto bg-white shadow-sm leading-none space-y-2">
      <div className="text-center uppercase font-bold text-sm">{formData.storeName}</div>
      <div className="text-center text-[10px]">{formData.address}</div>
      <div className="divider-star"></div>
      <div className="text-[10px]">
        <div>{t('receipt.date')}: {formData.date} {formData.time}</div>
        <div>{t('receipt.order_id')}: {formData.orderId}</div>
      </div>
      <div className="divider-star"></div>
      <div className="space-y-2">
        {formData.items.map((item, i) => <div key={i}>
            <div>{item.name}</div>
            <div className="flex justify-between">
              <span>{item.quantity}x {item.unitPrice}</span>
              <span>{formatCurrency(item.total, currency)}</span>
            </div>
          </div>)}
      </div>
      <div className="divider-star"></div>
      <div className="flex justify-between font-bold">
        <span>{t('receipt.total')}</span>
        <span>{formatCurrency(calc.grandTotal, currency)}</span>
      </div>
      <div className="text-center mt-4 text-[10px]">{t('receipt.matur_nuwun')}</div>
    </div>;
};

// 8. Minimarket
const Minimarket = ({
  formData,
  t
}) => {
  const calc = useCalculations(formData);
  const {
    currency,
    visibility
  } = formData;
  return <div className="receipt-container font-sans-custom text-[11px] p-4 max-w-[280px] mx-auto shadow-md">
      <div className="text-center mb-2">
        {visibility.showStoreName && <h2 className="font-black text-lg uppercase">{formData.storeName}</h2>}
        {visibility.showAddress && <p className="text-[10px] leading-tight mt-1">{formData.address}</p>}
      </div>
      <div className="flex justify-between text-[10px] border-y border-black py-1 mb-2">
        <span>{t('receipt.cashier')}: {formData.cashier || 'Admin'}</span>
        <span>{formData.date}</span>
      </div>
      <table className="w-full mb-2">
        <tbody>
          {formData.items.map((item, i) => <tr key={i} className="align-top">
              <td className="py-1 pr-1">
                <div className="font-bold leading-tight">{item.name}</div>
                <div className="text-[9px] text-gray-500">{item.quantity} x {formatCurrency(item.unitPrice, currency)}</div>
              </td>
              <td className="text-right py-1 font-bold align-bottom">{formatCurrency(item.total, currency)}</td>
            </tr>)}
        </tbody>
      </table>
      <div className="border-t border-black pt-1">
        <div className="flex justify-between font-black text-sm">
          <span>{t('receipt.total')}</span>
          <span>{formatCurrency(calc.grandTotal, currency)}</span>
        </div>
        {visibility.showPaymentMethod && <div className="flex justify-between text-[10px] mt-1 text-gray-600">
            <span>{t('receipt.cash')}</span>
            <span>{formatCurrency(formData.amountPaid, currency)}</span>
          </div>}
        {visibility.showPaymentMethod && <div className="flex justify-between text-[10px] text-gray-600">
            <span>{t('receipt.change')}</span>
            <span>{formatCurrency(calc.change, currency)}</span>
          </div>}
      </div>
      <div className="mt-4 text-center">
        <div className="font-mono-custom text-xl tracking-widest overflow-hidden h-6 mb-1">||||||||||||||||||||||</div>
        <div className="text-[9px]">{formData.orderId}</div>
      </div>
    </div>;
};

// 9. Bakery/Pastry
const BakeryPastry = ({
  formData,
  t
}) => {
  const calc = useCalculations(formData);
  const {
    currency,
    visibility
  } = formData;
  return <div className="receipt-container font-sans-custom text-[12px] p-6 max-w-[300px] mx-auto shadow-sm border border-pink-100 bg-pink-50/30">
      <div className="text-center mb-4">
        {visibility.showStoreName && <h2 className="text-xl font-bold text-pink-900">{formData.storeName}</h2>}
        <p className="text-[10px] text-pink-700">{t('receipt.freshly_baked')}</p>
      </div>
      <div className="divider-wave text-pink-300"></div>
      <div className="text-[10px] text-gray-600 mb-2 flex justify-between">
        <span>{formData.date}</span>
        <span>#{formData.orderId}</span>
      </div>
      <div className="space-y-2 mb-4">
        {formData.items.map((item, i) => <div key={i} className="flex justify-between items-center">
            <div>
              <div className="font-medium text-gray-800">{item.name}</div>
              <div className="text-[10px] text-gray-500">{item.quantity} pcs</div>
            </div>
            <div className="font-medium text-gray-800">{formatCurrency(item.total, currency)}</div>
          </div>)}
      </div>
      <div className="divider-wave text-pink-300"></div>
      <div className="flex justify-between font-bold text-sm text-pink-900 mt-2">
        <span>{t('receipt.total')}</span>
        <span>{formatCurrency(calc.grandTotal, currency)}</span>
      </div>
      {visibility.showFooterNote && <div className="text-center mt-6 text-[10px] text-pink-700 italic">
          {formData.footerNote || t('receipt.have_nice_day')}
        </div>}
    </div>;
};

// 10. Warung Nasi
const WarungNasi = ({
  formData,
  t
}) => {
  const calc = useCalculations(formData);
  const {
    currency,
    visibility
  } = formData;
  return <div className="receipt-container font-mono-custom text-[14px] p-4 max-w-[280px] mx-auto bg-white shadow-sm">
      <div className="text-center font-bold text-lg mb-1">{formData.storeName}</div>
      <div className="text-center text-xs mb-2">{formData.date}</div>
      <div className="border-b-2 border-black mb-2"></div>
      <div className="space-y-1 mb-2">
        {formData.items.map((item, i) => <div key={i} className="flex justify-between">
            <span>{item.quantity} {item.name}</span>
            <span>{formatCurrency(item.total, currency)}</span>
          </div>)}
      </div>
      <div className="border-b-2 border-black mb-2"></div>
      <div className="flex justify-between font-bold text-base">
        <span>{t('receipt.total')}</span>
        <span>{formatCurrency(calc.grandTotal, currency)}</span>
      </div>
      <div className="text-center mt-4 text-xs">{t('receipt.thank_you')}</div>
    </div>;
};

// 11. Juice Bar
const JuiceBar = ({
  formData,
  t
}) => {
  const calc = useCalculations(formData);
  const {
    currency,
    visibility
  } = formData;
  return <div className="receipt-container font-sans-custom text-[12px] p-5 max-w-[280px] mx-auto shadow-md rounded-b-xl border-t-4 border-green-400">
      <div className="text-center mb-4">
        {visibility.showStoreName && <h2 className="text-xl font-black text-green-600 uppercase tracking-wider">{formData.storeName}</h2>}
        <p className="text-[10px] text-gray-500">{t('receipt.fresh_healthy')}</p>
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mb-3">
        <span>{formData.date}</span>
        <span>{formData.time}</span>
      </div>
      <div className="space-y-3 mb-4">
        {formData.items.map((item, i) => <div key={i} className="flex justify-between items-center bg-green-50/50 p-2 rounded">
            <div>
              <div className="font-bold text-gray-800">{item.name}</div>
              <div className="text-[10px] text-gray-500">{t('receipt.qty')}: {item.quantity}</div>
            </div>
            <div className="font-bold text-green-700">{formatCurrency(item.total, currency)}</div>
          </div>)}
      </div>
      <div className="flex justify-between font-black text-sm text-gray-800 pt-2 border-t border-green-100">
        <span>{t('receipt.total')}</span>
        <span>{formatCurrency(calc.grandTotal, currency)}</span>
      </div>
      {visibility.showFooterNote && <div className="text-center mt-4 text-[10px] text-green-600 font-medium">
          {formData.footerNote || t('receipt.stay_fresh')}
        </div>}
    </div>;
};

// 12. Laundry Service
const LaundryService = ({
  formData,
  t
}) => {
  const calc = useCalculations(formData);
  const {
    currency,
    visibility
  } = formData;
  return <div className="receipt-container font-sans-custom text-[12px] p-6 max-w-[320px] mx-auto border-2 border-blue-100 shadow-sm">
      <div className="text-center mb-4">
        {visibility.showStoreName && <h2 className="text-xl font-bold text-blue-800">{formData.storeName}</h2>}
        {visibility.showAddress && <p className="text-[10px] text-gray-600">{formData.address}</p>}
      </div>
      <div className="bg-blue-50 p-2 rounded text-[10px] mb-4 space-y-1">
        <div className="flex justify-between"><span>{t('receipt.receipt_id')}:</span><span className="font-bold">{formData.orderId}</span></div>
        {visibility.showCustomer && <div className="flex justify-between"><span>{t('receipt.customer')}:</span><span className="font-bold">{formData.customer}</span></div>}
        {formData.pickupDate && <div className="flex justify-between"><span>{t('receipt.pickup_date')}:</span><span className="font-bold text-blue-700">{formData.pickupDate}</span></div>}
      </div>
      <table className="w-full mb-4 text-xs">
        <thead>
          <tr className="border-b border-blue-200 text-left text-gray-500">
            <th className="pb-1">{t('receipt.service')}</th>
            <th className="pb-1 text-right">{t('receipt.weight_qty')}</th>
            <th className="pb-1 text-right">{t('receipt.total')}</th>
          </tr>
        </thead>
        <tbody>
          {formData.items.map((item, i) => <tr key={i} className="border-b border-gray-100">
              <td className="py-2 font-medium">{item.name}</td>
              <td className="py-2 text-right">{item.quantity}</td>
              <td className="py-2 text-right font-medium">{formatCurrency(item.total, currency)}</td>
            </tr>)}
        </tbody>
      </table>
      <div className="flex justify-between font-bold text-sm text-blue-900 bg-blue-50 p-2 rounded">
        <span>{t('receipt.amount_due')}</span>
        <span>{formatCurrency(calc.grandTotal, currency)}</span>
      </div>
      {visibility.showFooterNote && <div className="text-center mt-4 text-[10px] text-gray-500">
          {formData.footerNote || t('receipt.bring_receipt')}
        </div>}
    </div>;
};

// 13. Barbershop/Salon
const BarbershopSalon = ({
  formData,
  t
}) => {
  const calc = useCalculations(formData);
  const {
    currency,
    visibility
  } = formData;
  return <div className="receipt-container font-sans-custom text-[12px] p-6 max-w-[300px] mx-auto bg-zinc-900 text-white shadow-xl">
      <style>{`.receipt-container.bg-zinc-900 * { color: white; }`}</style>
      <div className="text-center mb-6">
        {visibility.showStoreName && <h2 className="text-2xl font-black tracking-widest uppercase">{formData.storeName}</h2>}
        <p className="text-[10px] text-zinc-400 tracking-widest mt-1">PREMIUM CUTS</p>
      </div>
      <div className="border-t border-zinc-700 pt-3 mb-4 text-[10px] text-zinc-400 space-y-1">
        <div className="flex justify-between"><span>{t('receipt.date')}: {formData.date}</span><span>{formData.time}</span></div>
        {formData.stylistName && <div className="flex justify-between"><span>{t('receipt.stylist')}:</span><span className="text-white font-bold">{formData.stylistName}</span></div>}
      </div>
      <div className="space-y-3 mb-6">
        {formData.items.map((item, i) => <div key={i} className="flex justify-between items-center">
            <div className="font-medium">{item.name}</div>
            <div className="font-bold">{formatCurrency(item.total, currency)}</div>
          </div>)}
      </div>
      <div className="border-t border-zinc-700 pt-3 flex justify-between font-black text-lg">
        <span>{t('receipt.total')}</span>
        <span>{formatCurrency(calc.grandTotal, currency)}</span>
      </div>
      {visibility.showFooterNote && <div className="text-center mt-8 text-[10px] text-zinc-500 uppercase tracking-widest">
          {formData.footerNote || t('receipt.looking_sharp')}
        </div>}
    </div>;
};

// 14. Warung Soto
const WarungSoto = ({
  formData,
  t
}) => {
  const calc = useCalculations(formData);
  const {
    currency,
    visibility
  } = formData;
  return <div className="receipt-container font-mono-custom text-[13px] p-4 max-w-[280px] mx-auto shadow-sm border-2 border-dashed border-orange-800 bg-orange-50/30">
      <div className="text-center mb-2">
        {visibility.showStoreName && <h2 className="text-lg font-bold text-orange-900">{formData.storeName}</h2>}
        <p className="text-[10px] text-orange-800">Soto Asli Nusantara</p>
      </div>
      <div className="divider-dash border-orange-800"></div>
      <div className="text-[10px] text-orange-900 mb-2">
        <div>{t('receipt.date')}: {formData.date}</div>
        {formData.tableNumber && <div>{t('receipt.table')}: {formData.tableNumber}</div>}
      </div>
      <div className="divider-dash border-orange-800"></div>
      <div className="space-y-1 mb-2 text-orange-950">
        {formData.items.map((item, i) => <div key={i} className="flex justify-between">
            <span>{item.quantity} {item.name}</span>
            <span>{formatCurrency(item.total, currency)}</span>
          </div>)}
      </div>
      <div className="divider-dash border-orange-800"></div>
      <div className="flex justify-between font-bold text-orange-900">
        <span>{t('receipt.total')}</span>
        <span>{formatCurrency(calc.grandTotal, currency)}</span>
      </div>
      <div className="text-center mt-4 text-[10px] text-orange-800">{t('receipt.matur_suwun')}</div>
    </div>;
};

// 15. Toko Elektronik
const TokoElektronik = ({
  formData,
  t
}) => {
  const calc = useCalculations(formData);
  const {
    currency,
    visibility
  } = formData;
  return <div className="receipt-container font-sans-custom text-[12px] p-6 max-w-[340px] mx-auto border shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          {visibility.showStoreName && <h2 className="text-xl font-black text-blue-900">{formData.storeName}</h2>}
          {visibility.showAddress && <p className="text-[10px] text-gray-500">{formData.address}</p>}
        </div>
        <div className="text-right">
          <div className="font-bold text-gray-400 uppercase">{t('receipt.invoice')}</div>
          <div className="text-[10px] font-mono">{formData.orderId}</div>
        </div>
      </div>
      <div className="bg-gray-100 p-2 text-[10px] mb-4 flex justify-between">
        <div>{t('receipt.date')}: {formData.date}</div>
        {visibility.showCustomer && <div>{t('receipt.customer')}: <span className="font-bold">{formData.customer}</span></div>}
      </div>
      <table className="w-full mb-4 text-xs">
        <thead>
          <tr className="border-b-2 border-gray-800 text-left">
            <th className="pb-1">{t('receipt.item')} / SN</th>
            <th className="pb-1 text-right">{t('receipt.qty')}</th>
            <th className="pb-1 text-right">{t('receipt.total')}</th>
          </tr>
        </thead>
        <tbody>
          {formData.items.map((item, i) => <tr key={i} className="border-b border-gray-200">
              <td className="py-2">
                <div className="font-bold">{item.name}</div>
                <div className="text-[9px] text-gray-500">{t('receipt.warranty')}</div>
              </td>
              <td className="py-2 text-right align-top">{item.quantity}</td>
              <td className="py-2 text-right font-bold align-top">{formatCurrency(item.total, currency)}</td>
            </tr>)}
        </tbody>
      </table>
      <div className="flex justify-end">
        <div className="w-48 space-y-1">
          <div className="flex justify-between text-gray-600"><span>{t('receipt.subtotal')}</span><span>{formatCurrency(calc.subtotal, currency)}</span></div>
          <div className="flex justify-between font-black text-sm pt-1 border-t border-gray-800">
            <span>{t('receipt.total')}</span><span>{formatCurrency(calc.grandTotal, currency)}</span>
          </div>
        </div>
      </div>
      {visibility.showFooterNote && <div className="mt-6 text-[9px] text-gray-500 border-t pt-2">
          {formData.footerNote || t('receipt.save_receipt')}
        </div>}
    </div>;
};
export const RECEIPT_TEMPLATES = [{
  id: 'warungMakan',
  name: 'Warung Makan',
  description: 'Casual food stall, simple items list',
  render: WarungMakan
}, {
  id: 'tokoSembako',
  name: 'Toko Sembako',
  description: 'Grocery store, product-focused',
  render: TokoSembako
}, {
  id: 'cafeModern',
  name: 'Cafe Modern',
  description: 'Coffee shop, modern minimal',
  render: CafeModern
}, {
  id: 'spbu',
  name: 'SPBU (Gas Station)',
  description: 'Fuel station, pump number, liters',
  render: SPBU
}, {
  id: 'restaurantCasual',
  name: 'Restaurant Casual',
  description: 'Casual restaurant, table number',
  render: RestaurantCasual
}, {
  id: 'coffeeshopTrendy',
  name: 'Coffeeshop Trendy',
  description: 'Trendy cafe, modern typography',
  render: CoffeeshopTrendy
}, {
  id: 'warungKopi',
  name: 'Warung Kopi',
  description: 'Traditional coffee shop, simple',
  render: WarungKopi
}, {
  id: 'minimarket',
  name: 'Minimarket',
  description: 'Small convenience store, compact',
  render: Minimarket
}, {
  id: 'bakeryPastry',
  name: 'Bakery / Pastry',
  description: 'Bakery style, sweet footer',
  render: BakeryPastry
}, {
  id: 'warungNasi',
  name: 'Warung Nasi',
  description: 'Rice stall, simple items',
  render: WarungNasi
}, {
  id: 'juiceBar',
  name: 'Juice Bar',
  description: 'Beverage shop, colorful feel',
  render: JuiceBar
}, {
  id: 'laundryService',
  name: 'Laundry Service',
  description: 'Laundry shop, pickup date',
  render: LaundryService
}, {
  id: 'barbershopSalon',
  name: 'Barbershop / Salon',
  description: 'Salon style, stylist name',
  render: BarbershopSalon
}, {
  id: 'warungSoto',
  name: 'Warung Soto',
  description: 'Soup stall, traditional warm',
  render: WarungSoto
}, {
  id: 'tokoElektronik',
  name: 'Toko Elektronik',
  description: 'Electronics store, warranty info',
  render: TokoElektronik
}];