const storePrefixes = [
  'Warung',
  'Kedai',
  'Toko',
  'Cafe',
  'Laundry',
  'Bengkel',
  'Apotek',
  'Bakery',
  'Barbershop',
  'Minimarket',
];

const storeNames = [
  'Sumber Rejeki',
  'Maju Jaya',
  'Berkah Abadi',
  'Pagi Cerah',
  'Rasa Nusantara',
  'Kopi Kita',
  'Sejahtera',
  'Mitra Utama',
  'Cahaya Baru',
  'Harapan Jaya',
  'Nusantara',
  'Teras Kita',
  'Bintang Timur',
  'Mekar Sari',
  'Prima',
  'Sentosa',
  'Sahabat',
  'Mandiri',
  'Karya Jaya',
  'Cipta Rasa',
];

const firstNames = [
  'Andi',
  'Aulia',
  'Bagas',
  'Bima',
  'Dewi',
  'Dimas',
  'Fajar',
  'Farhan',
  'Fitri',
  'Hendra',
  'Intan',
  'Kevin',
  'Nadia',
  'Naufal',
  'Putri',
  'Raka',
  'Rani',
  'Reza',
  'Rizky',
  'Salsa',
  'Sari',
  'Siti',
  'Taufik',
  'Vina',
  'Wahyu',
];

const lastNames = [
  'Aditya',
  'Ananda',
  'Hidayat',
  'Kurniawan',
  'Lestari',
  'Maulana',
  'Nugraha',
  'Permana',
  'Pratama',
  'Putra',
  'Putri',
  'Ramadhan',
  'Santoso',
  'Saputra',
  'Sari',
  'Setiawan',
  'Wijaya',
  'Yulianto',
];

const cashierNames = [
  'Alya',
  'Andi',
  'Dian',
  'Dina',
  'Fajar',
  'Farah',
  'Intan',
  'Nadia',
  'Raka',
  'Rani',
  'Reza',
  'Rizky',
  'Salsa',
  'Sari',
  'Taufik',
  'Vina',
];

const footerMessages = [
  'Terima kasih atas kunjungan Anda.',
  'Terima kasih sudah berbelanja bersama kami.',
  'Simpan struk ini sebagai bukti transaksi.',
  'Kami tunggu kunjungan Anda berikutnya.',
  'Semoga hari Anda menyenangkan.',
  'Terima kasih dan sampai jumpa kembali.',
];

function pick(values) {
  return values[Math.floor(Math.random() * values.length)];
}

function randomDigits(length) {
  const max = 10 ** length;
  return Math.floor(Math.random() * max).toString().padStart(length, '0');
}

export function generateRandomStoreName() {
  return `${pick(storePrefixes)} ${pick(storeNames)}`;
}

export function generateRandomCustomerName() {
  return `${pick(firstNames)} ${pick(lastNames)}`;
}

export function generateRandomCashierName() {
  return pick(cashierNames);
}

export function generateRandomFooter() {
  return pick(footerMessages);
}

export function generateRandomOrderId() {
  const prefix = pick(['TRX', 'INV', 'ORD', 'RCP']);
  const now = new Date();

  const date = [
    String(now.getFullYear()).slice(-2),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');

  return `${prefix}-${date}-${randomDigits(4)}`;
}
