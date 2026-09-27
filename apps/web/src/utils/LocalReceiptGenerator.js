const MONTHS = {
  januari: 1,
  january: 1,
  februari: 2,
  february: 2,
  maret: 3,
  march: 3,
  april: 4,
  mei: 5,
  may: 5,
  juni: 6,
  june: 6,
  juli: 7,
  july: 7,
  agustus: 8,
  august: 8,
  september: 9,
  oktober: 10,
  october: 10,
  november: 11,
  desember: 12,
  december: 12,
};

const PAYMENT_RULES = [
  { value: 'shopeepay', patterns: ['shopeepay', 'shopee pay'] },
  { value: 'bankTransfer', patterns: ['bank transfer', 'transfer bank', 'transfer'] },
  { value: 'creditCard', patterns: ['credit card', 'kartu kredit', 'credit'] },
  { value: 'debitCard', patterns: ['debit card', 'kartu debit', 'debit'] },
  { value: 'qris', patterns: ['qris'] },
  { value: 'gopay', patterns: ['gopay', 'go pay'] },
  { value: 'ovo', patterns: ['ovo'] },
  { value: 'dana', patterns: ['dana'] },
  { value: 'cash', patterns: ['cash', 'tunai'] },
];

const FIRST_NAMES = [
  'Aditya', 'Alya', 'Andi', 'Aulia', 'Bagas', 'Bima', 'Dian', 'Dimas',
  'Fajar', 'Farah', 'Fitri', 'Hendra', 'Intan', 'Nadia', 'Naufal', 'Putri',
  'Raka', 'Rani', 'Reza', 'Rizky', 'Salsa', 'Sari', 'Taufik', 'Vina', 'Wahyu',
];

const LAST_NAMES = [
  'Ananda', 'Hidayat', 'Kurniawan', 'Lestari', 'Maulana', 'Nugraha',
  'Permana', 'Pratama', 'Putra', 'Ramadhan', 'Santoso', 'Saputra',
  'Setiawan', 'Wijaya', 'Yulianto',
];

const STORE_WORDS = [
  'Berkah', 'Cahaya', 'Cipta Rasa', 'Harapan', 'Karya', 'Maju Jaya',
  'Mekar Sari', 'Mitra', 'Nusantara', 'Pagi Cerah', 'Prima', 'Sahabat',
  'Sejahtera', 'Sentosa', 'Sumber Rejeki', 'Teras Kita',
];

const FOOTERS = {
  meal: [
    'Terima kasih atas kunjungan Anda.',
    'Selamat menikmati dan sampai jumpa kembali.',
    'Terima kasih sudah makan bersama kami.',
  ],
  coffee: [
    'Terima kasih. Sampai jumpa di cangkir berikutnya.',
    'Terima kasih sudah mampir.',
  ],
  gas: [
    'Terima kasih. Hati-hati di perjalanan.',
    'Simpan struk ini sebagai bukti transaksi.',
  ],
  laundry: [
    'Terima kasih telah menggunakan layanan kami.',
    'Simpan struk ini sampai pesanan selesai.',
  ],
  salon: [
    'Terima kasih atas kunjungan Anda.',
    'Sampai jumpa pada kunjungan berikutnya.',
  ],
  electronics: [
    'Simpan struk ini sebagai bukti pembelian.',
    'Terima kasih telah berbelanja bersama kami.',
  ],
  bakery: [
    'Terima kasih dan selamat menikmati.',
    'Dibuat segar untuk Anda.',
  ],
  juice: [
    'Terima kasih. Nikmati kesegarannya.',
    'Terima kasih sudah mampir.',
  ],
  minimarket: [
    'Terima kasih telah berbelanja.',
    'Simpan struk ini sebagai bukti transaksi.',
  ],
};

const CITY_MEALS = {
  palembang: ['Pempek Kapal Selam', 'Pindang Patin', 'Nasi Ayam', 'Es Kacang Merah', 'Es Teh Manis'],
  padang: ['Nasi Rendang', 'Ayam Pop', 'Gulai Tunjang', 'Es Teh Manis', 'Teh Talua'],
  bandung: ['Nasi Timbel Ayam', 'Batagor', 'Siomay Bandung', 'Es Teh Manis', 'Es Jeruk'],
  yogyakarta: ['Nasi Gudeg Ayam', 'Sate Kere', 'Bakmi Jawa', 'Es Teh', 'Wedang Jahe'],
  jogja: ['Nasi Gudeg Ayam', 'Sate Kere', 'Bakmi Jawa', 'Es Teh', 'Wedang Jahe'],
  surabaya: ['Rawon Daging', 'Lontong Balap', 'Tahu Tek', 'Es Teh', 'Es Jeruk'],
  malang: ['Bakso Malang', 'Cwie Mie', 'Nasi Ayam', 'Es Teh', 'Es Jeruk'],
  semarang: ['Nasi Ayam Semarang', 'Lumpia', 'Soto Ayam', 'Es Teh', 'Es Jeruk'],
  solo: ['Nasi Liwet', 'Selat Solo', 'Sate Buntel', 'Es Teh', 'Teh Hangat'],
  medan: ['Nasi Ayam', 'Soto Medan', 'Mie Gomak', 'Es Teh Manis', 'Jus Alpukat'],
  makassar: ['Coto Makassar', 'Konro Bakar', 'Pallubasa', 'Es Pisang Ijo', 'Es Teh'],
  jakarta: ['Nasi Ayam', 'Soto Betawi', 'Gado-Gado', 'Es Teh Manis', 'Es Jeruk'],
  bekasi: ['Nasi Ayam', 'Soto Ayam', 'Mie Ayam', 'Es Teh Manis', 'Es Jeruk'],
};

const CATEGORY_DATA = {
  meal: {
    template: 'restaurantCasual',
    storePrefixes: ['Rumah Makan', 'Dapur', 'Warung Makan', 'Kedai Rasa'],
    genericItems: ['Nasi Ayam', 'Soto Ayam', 'Mie Goreng', 'Ayam Bakar', 'Es Teh Manis'],
  },
  coffee: {
    template: 'coffeeshopTrendy',
    storePrefixes: ['Kedai Kopi', 'Kopi', 'Teras Kopi', 'Ruang Kopi'],
    genericItems: ['Kopi Susu', 'Americano', 'Cappuccino', 'Croissant', 'Air Mineral'],
  },
  gas: {
    template: 'spbu',
    storePrefixes: ['SPBU Mandiri', 'Fuel Point', 'Stasiun Energi'],
    genericItems: ['Pertamax', 'Pertalite', 'Oli Mesin', 'Air Mineral'],
  },
  laundry: {
    template: 'laundryService',
    storePrefixes: ['Laundry', 'Fresh Laundry', 'Clean Laundry', 'Laundry Express'],
    genericItems: ['Cuci Kering', 'Cuci Setrika', 'Pewangi Premium', 'Express Service'],
  },
  salon: {
    template: 'barbershopSalon',
    storePrefixes: ['Barbershop', 'Studio Hair', 'Salon', 'Gentlemen Cut'],
    genericItems: ['Haircut', 'Hair Wash', 'Hair Tonic', 'Styling'],
  },
  electronics: {
    template: 'tokoElektronik',
    storePrefixes: ['Toko Elektronik', 'Digital Store', 'Tech Corner', 'Elektronik'],
    genericItems: ['Kabel Data', 'Adaptor', 'Lampu LED', 'Baterai', 'Aksesori Elektronik'],
  },
  bakery: {
    template: 'bakeryPastry',
    storePrefixes: ['Bakery', 'Roti', 'Dapur Roti', 'Bakehouse'],
    genericItems: ['Roti Cokelat', 'Croissant', 'Donat', 'Roti Keju', 'Kopi Susu'],
  },
  juice: {
    template: 'juiceBar',
    storePrefixes: ['Juice Bar', 'Fresh Juice', 'Kedai Jus', 'Jus Segar'],
    genericItems: ['Jus Alpukat', 'Jus Mangga', 'Jus Jeruk', 'Smoothie Buah', 'Air Mineral'],
  },
  minimarket: {
    template: 'minimarket',
    storePrefixes: ['Minimarket', 'Toko', 'Mart', 'Toko Harian'],
    genericItems: ['Air Mineral', 'Roti', 'Mie Instan', 'Snack', 'Minuman'],
  },
};

function normalizeText(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function hashString(value) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createRandom(seedText) {
  let state = hashString(seedText) || 1;

  return () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(values, random) {
  return values[Math.floor(random() * values.length)];
}

function titleCase(value) {
  return value
    .trim()
    .split(/\s+/)
    .map((part) =>
      part.length > 2
        ? `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`
        : part.toUpperCase() === 'DKI'
          ? 'DKI'
          : `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`
    )
    .join(' ');
}

function parseCity(prompt) {
  const monthNames = Object.keys(MONTHS).join('|');
  const nextDateByName = `\\s+\\d{1,2}\\s+(?:${monthNames})\\s+20\\d{2}`;
  const nextNumericDate = '\\s+\\d{1,2}[/-]\\d{1,2}[/-]20\\d{2}';
  const nextKeyword = '\\s+(?:tanggal|tgl|pada|jam|pukul|dengan|jumlah|total|sebesar|bayar|pembayaran|untuk)\\b';
  const stop = `(?=${nextKeyword}|${nextDateByName}|${nextNumericDate}|,|$)`;

  const patterns = [
    new RegExp(`\\bdi\\s+kota\\s+([a-zA-ZÀ-ÿ.' -]{2,45}?)${stop}`, 'i'),
    new RegExp(`\\bkota\\s+([a-zA-ZÀ-ÿ.' -]{2,45}?)${stop}`, 'i'),
    new RegExp(`\\bdi\\s+([a-zA-ZÀ-ÿ.' -]{2,45}?)${stop}`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) return titleCase(match[1]);
  }

  return '';
}

function parseDate(prompt) {
  let match = prompt.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/);

  if (match) {
    return toIsoDate(Number(match[1]), Number(match[2]), Number(match[3]));
  }

  match = prompt.match(/\b(\d{1,2})[/-](\d{1,2})[/-](20\d{2})\b/);

  if (match) {
    return toIsoDate(Number(match[3]), Number(match[2]), Number(match[1]));
  }

  const monthNames = Object.keys(MONTHS).join('|');
  const monthPattern = new RegExp(
    `\\b(\\d{1,2})\\s+(${monthNames})\\s+(20\\d{2})\\b`,
    'i'
  );

  match = prompt.match(monthPattern);

  if (match) {
    return toIsoDate(
      Number(match[3]),
      MONTHS[match[2].toLowerCase()],
      Number(match[1])
    );
  }

  return '';
}

function toIsoDate(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return '';
  }

  return [
    String(year),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-');
}

function parseAmountToken(rawNumber, suffix = '') {
  const clean = String(rawNumber || '')
    .replace(/\s/g, '')
    .replace(/[.,]/g, '');

  let amount = Number(clean);
  if (!Number.isFinite(amount)) return 0;

  const normalizedSuffix = String(suffix || '').toLowerCase();

  if (['k', 'rb', 'ribu'].includes(normalizedSuffix)) {
    amount *= 1000;
  } else if (['jt', 'juta'].includes(normalizedSuffix)) {
    amount *= 1_000_000;
  }

  return Math.round(amount);
}

function parseAmount(prompt) {
  const patterns = [
    /\b(?:jumlah|total|sebesar|nominal)\s*(?:rp\.?\s*)?(\d[\d.,\s]*\d|\d+)\s*(rb|ribu|k|jt|juta|rupiah|idr)?\b/i,
    /\b(?:rp\.?\s*)(\d[\d.,\s]*\d|\d+)\s*(rb|ribu|k|jt|juta)?\b/i,
    /\b(\d[\d.,\s]*\d|\d+)\s*(rupiah|idr)\b/i,
  ];

  for (const pattern of patterns) {
    const match = prompt.match(pattern);

    if (match?.[1]) {
      const amount = parseAmountToken(match[1], match[2]);
      if (amount > 0) return amount;
    }
  }

  return 0;
}

function parsePaymentMethod(prompt) {
  const lower = prompt.toLowerCase();

  for (const rule of PAYMENT_RULES) {
    if (rule.patterns.some((pattern) => lower.includes(pattern))) {
      return rule.value;
    }
  }

  return '';
}

function detectCategory(prompt) {
  const lower = prompt.toLowerCase();

  if (/\b(bensin|pertalite|pertamax|solar|bbm|spbu|fuel)\b/.test(lower)) return 'gas';
  if (/\b(laundry|cuci kiloan|cuci setrika|dry clean)\b/.test(lower)) return 'laundry';
  if (/\b(barber|barbershop|salon|potong rambut|haircut)\b/.test(lower)) return 'salon';
  if (/\b(elektronik|electronic|charger|adaptor|kabel data|gadget)\b/.test(lower)) return 'electronics';
  if (/\b(roti|bakery|pastry|donat|cake|kue)\b/.test(lower)) return 'bakery';
  if (/\b(jus|juice|smoothie)\b/.test(lower)) return 'juice';
  if (/\b(kopi|coffee|cafe|café|latte|cappuccino|americano)\b/.test(lower)) return 'coffee';
  if (/\b(minimarket|sembako|belanja harian|grocery|mart)\b/.test(lower)) return 'minimarket';

  return 'meal';
}

function parseExplicitTime(prompt) {
  let match = prompt.match(/\b(?:jam|pukul)\s*(\d{1,2})[:.](\d{2})\b/i);

  if (match) {
    const hour = Number(match[1]);
    const minute = Number(match[2]);

    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
  }

  match = prompt.match(/\b(?:jam|pukul)\s*(\d{1,2})\b/i);

  if (match) {
    const hour = Number(match[1]);
    if (hour >= 0 && hour <= 23) {
      return `${String(hour).padStart(2, '0')}:00`;
    }
  }

  return '';
}

function generateContextTime(prompt, category, random) {
  const explicit = parseExplicitTime(prompt);
  if (explicit) return explicit;

  const lower = prompt.toLowerCase();

  let start = 10 * 60;
  let end = 17 * 60;

  if (/\b(sarapan|breakfast|pagi)\b/.test(lower)) {
    start = 7 * 60;
    end = 9 * 60 + 30;
  } else if (/\b(makan siang|lunch|siang)\b/.test(lower)) {
    start = 11 * 60 + 30;
    end = 13 * 60 + 30;
  } else if (/\b(makan malam|dinner|malam)\b/.test(lower)) {
    start = 18 * 60;
    end = 20 * 60 + 30;
  } else if (category === 'coffee') {
    start = 8 * 60;
    end = 18 * 60;
  } else if (category === 'gas') {
    start = 8 * 60;
    end = 21 * 60;
  }

  const minutes = Math.floor(start + random() * (end - start + 1));
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function generatePersonName(random) {
  return `${pick(FIRST_NAMES, random)} ${pick(LAST_NAMES, random)}`;
}

function generateCashierName(random) {
  return pick(FIRST_NAMES, random);
}

function generateStoreName(category, city, random) {
  const data = CATEGORY_DATA[category];
  const prefix = pick(data.storePrefixes, random);
  const suffix = pick(STORE_WORDS, random);

  if (random() > 0.65 && city) {
    return `${prefix} ${suffix} ${city}`;
  }

  return `${prefix} ${suffix}`;
}

function getItemsForCategory(category, city) {
  if (category === 'meal') {
    const cityKey = city.toLowerCase();
    return CITY_MEALS[cityKey] || CATEGORY_DATA.meal.genericItems;
  }

  return CATEGORY_DATA[category].genericItems;
}

function roundTo500(value) {
  return Math.max(500, Math.round(value / 500) * 500);
}

function buildLineItems(category, city, totalAmount, random, prompt = '') {
  const source = [...getItemsForCategory(category, city)];

  if (category === 'gas') {
    const lower = prompt.toLowerCase();
    let fuelName = 'Pertamax';

    if (lower.includes('pertalite')) fuelName = 'Pertalite';
    if (lower.includes('solar') || lower.includes('diesel')) fuelName = 'Solar';
    if (lower.includes('pertamax')) fuelName = 'Pertamax';

    return [{
      name: fuelName,
      quantity: 1,
      unitPrice: totalAmount,
      discount: 0,
      total: totalAmount,
    }];
  }

  for (let i = source.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [source[i], source[j]] = [source[j], source[i]];
  }

  let itemCount = 2;
  if (totalAmount >= 75_000) itemCount = 3;
  if (totalAmount >= 125_000) itemCount = 4;
  if (totalAmount >= 250_000) itemCount = 5;

  itemCount = Math.min(itemCount, source.length);

  if (totalAmount < itemCount * 1000) {
    itemCount = Math.max(1, Math.floor(totalAmount / 1000));
  }

  const selected = source.slice(0, Math.max(1, itemCount));

  if (selected.length === 1) {
    return [{
      name: selected[0],
      quantity: 1,
      unitPrice: totalAmount,
      discount: 0,
      total: totalAmount,
    }];
  }

  const baseWeights = [0.36, 0.27, 0.21, 0.10, 0.06];
  const items = [];
  let allocated = 0;

  for (let index = 0; index < selected.length - 1; index += 1) {
    const remainingSlots = selected.length - index - 1;
    const maxAllowed = totalAmount - allocated - remainingSlots * 500;
    const target = totalAmount * (baseWeights[index] || 0.1);
    const jitter = 0.9 + random() * 0.2;
    const price = Math.min(maxAllowed, roundTo500(target * jitter));

    if (price <= 0) continue;

    items.push({
      name: selected[index],
      quantity: 1,
      unitPrice: price,
      discount: 0,
      total: price,
    });

    allocated += price;
  }

  const remainder = Math.max(0, totalAmount - allocated);

  if (remainder > 0) {
    items.push({
      name: selected[Math.min(items.length, selected.length - 1)],
      quantity: 1,
      unitPrice: remainder,
      discount: 0,
      total: remainder,
    });
  }

  return items;
}

function makeOrderId(date, random) {
  const compactDate = date.replaceAll('-', '').slice(2);
  const suffix = Math.floor(random() * 10_000).toString().padStart(4, '0');

  return `TRX-${compactDate}-${suffix}`;
}

export function generateLocalReceipt(promptInput) {
  const prompt = normalizeText(promptInput);
  const random = createRandom(prompt.toLowerCase());

  const city = parseCity(prompt);
  const date = parseDate(prompt);
  const totalAmount = parseAmount(prompt);
  const paymentMethod = parsePaymentMethod(prompt);

  const missingFields = [];

  if (!city) missingFields.push('city');
  if (!date) missingFields.push('date');
  if (!totalAmount) missingFields.push('totalAmount');
  if (!paymentMethod) missingFields.push('paymentMethod');

  if (missingFields.length > 0) {
    return {
      ok: false,
      missingFields,
    };
  }

  const category = detectCategory(prompt);
  const categoryData = CATEGORY_DATA[category];
  const time = generateContextTime(prompt, category, random);
  const items = buildLineItems(category, city, totalAmount, random, prompt);

  return {
    ok: true,
    missingFields: [],
    meta: {
      city,
      category,
      totalAmount,
      paymentMethod,
    },
    formData: {
      currency: 'IDR',
      template: categoryData.template,
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
      storeName: generateStoreName(category, city, random),
      address: city,
      phone: '',
      email: '',
      website: '',
      orderId: makeOrderId(date, random),
      invoiceNumber: '',
      date,
      time,
      cashier: generateCashierName(random),
      customer: generatePersonName(random),
      tableNumber: '',
      pumpNumber: category === 'gas' ? String(1 + Math.floor(random() * 8)) : '',
      stylistName: '',
      pickupDate: '',
      items,
      discountType: 'percentage',
      discountValue: 0,
      vat: 0,
      serviceCharge: 0,
      paymentMethod,
      amountPaid: totalAmount,
      isPaid: true,
      footerNote: pick(FOOTERS[category], random),
    },
  };
}
