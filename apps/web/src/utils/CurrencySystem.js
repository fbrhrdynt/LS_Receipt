export const CURRENCY_CONFIG = {
  IDR: { code: 'IDR', symbol: 'Rp', locale: 'id-ID', decimals: 0 },
  THB: { code: 'THB', symbol: '฿', locale: 'th-TH', decimals: 2 },
  PHP: { code: 'PHP', symbol: '₱', locale: 'en-PH', decimals: 2 },
  MYR: { code: 'MYR', symbol: 'RM', locale: 'ms-MY', decimals: 2 },
  SGD: { code: 'SGD', symbol: 'S$', locale: 'en-SG', decimals: 2 },
  VND: { code: 'VND', symbol: '₫', locale: 'vi-VN', decimals: 0 },
  USD: { code: 'USD', symbol: '$', locale: 'en-US', decimals: 2 }
};

export function formatCurrency(amount, currencyCode = 'IDR') {
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.IDR;
  const numAmount = parseFloat(amount) || 0;
  
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals
    }).format(numAmount);
  } catch (e) {
    // Fallback if Intl fails
    return `${config.symbol}${numAmount.toFixed(config.decimals)}`;
  }
}

export function getCurrencySymbol(currencyCode = 'IDR') {
  return CURRENCY_CONFIG[currencyCode]?.symbol || 'Rp';
}