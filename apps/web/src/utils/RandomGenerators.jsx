const storeNames = [
  "Warung Kopi Senja", "Toko Elektronik Jaya", "Boutique Elegan", "Apotek Sehat Sentosa",
  "Restoran Padang Sederhana", "Kedai Kopi Aroma", "Toko Buku Cerdas", "Laundry Express",
  "Mini Market Berkah", "Bengkel Motor Jaya", "Salon Cantik", "Toko Roti Manis",
  "Warung Makan Ibu Haji", "Toko Sepatu Trendy", "Optik Mata Jernih", "Toko Bunga Indah",
  "Barbershop Modern", "Toko Kue Lezat", "Warung Nasi Goreng", "Toko Handphone Digital"
];

const customerNames = [
  "Siti Nurhaliza", "Budi Santoso", "Maya Chen", "Andi Wijaya", "Dewi Lestari",
  "Rudi Hartono", "Ayu Ting Ting", "Bambang Pamungkas", "Rina Susanti", "Agus Salim",
  "Fitri Handayani", "Dedi Mulyadi", "Sari Rahayu", "Hendra Gunawan", "Lina Marlina",
  "Yudi Pratama", "Novi Amelia", "Eko Prasetyo", "Dian Sastro", "Rizki Ramadhan"
];

const cashierNames = [
  "Ani", "Budi", "Citra", "Doni", "Eka", "Fani", "Gita", "Hadi", "Indah", "Joko",
  "Kartika", "Luki", "Mira", "Nanda", "Oki", "Putri", "Qori", "Rini", "Sinta", "Tono"
];

const footerMessages = [
  "Terima kasih atas kunjungan Anda",
  "Selamat berbelanja kembali",
  "Kepuasan Anda adalah prioritas kami",
  "Barang yang sudah dibeli tidak dapat dikembalikan",
  "Simpan struk ini sebagai bukti pembayaran",
  "Hubungi kami untuk pertanyaan lebih lanjut",
  "Ikuti kami di media sosial untuk promo menarik",
  "Dapatkan diskon 10% untuk pembelian berikutnya",
  "Terima kasih telah mempercayai kami",
  "Kami tunggu kunjungan Anda kembali"
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