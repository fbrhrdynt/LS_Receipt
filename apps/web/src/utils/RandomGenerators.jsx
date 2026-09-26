const storeNames = [
  'Toko Contoh 01',
  'Kedai Demo 02',
  'Warung Contoh 03',
  'Laundry Demo 04',
  'Cafe Contoh 05',
  'Toko Demo 06',
];

const customerNames = [
  'Pelanggan 001',
  'Pelanggan 002',
  'Pelanggan 003',
  'Pelanggan 004',
  'Pelanggan 005',
  'Pelanggan 006',
];

const cashierNames = [
  'Kasir A',
  'Kasir B',
  'Kasir C',
  'Kasir D',
  'Kasir E',
  'Kasir F',
];

const footerMessages = [
  'Terima kasih atas kunjungan Anda.',
  'Simpan struk ini sebagai bukti transaksi.',
  'Terima kasih sudah berbelanja.',
  'Sampai jumpa pada kunjungan berikutnya.',
];

export function generateRandomStoreName() {
  return storeNames[Math.floor(Math.random() * storeNames.length)];
}

export function generateRandomCustomerName() {
  return customerNames[Math.floor(Math.random() * customerNames.length)];
}

export function generateRandomCashierName() {
  return cashierNames[Math.floor(Math.random() * cashierNames.length)];
}

export function generateRandomFooter() {
  return footerMessages[Math.floor(Math.random() * footerMessages.length)];
}

export function generateRandomOrderId() {
  const prefix = ['INV', 'ORD', 'RCP', 'TRX'][Math.floor(Math.random() * 4)];
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `${prefix}-${year}${month}-${random}`;
}
