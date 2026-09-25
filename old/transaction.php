<?php 
$storeFile = 'data/stores.csv';
$menuFile = 'data/item_menu.csv';

$stores = [];
$menus = [];

// Baca data toko
if (($handle = fopen($storeFile, "r")) !== FALSE) {
    fgetcsv($handle);
    while (($data = fgetcsv($handle)) !== FALSE) {
        $stores[] = [
            'id_store' => $data[0],
            'name_store' => $data[1],
            'address' => $data[2],
        ];
    }
    fclose($handle);
}

// Baca data menu
if (($handle = fopen($menuFile, "r")) !== FALSE) {
    fgetcsv($handle);
    while (($data = fgetcsv($handle)) !== FALSE) {
        $menus[] = [
            'id_menu' => $data[0],
            'name_menu' => $data[1],
            'price' => $data[2],
        ];
    }
    fclose($handle);
}

$visitorFile = 'data/visitor.csv';

// Fungsi baca jumlah visitor dari CSV
function readVisitorCount($file) {
    if (!file_exists($file)) {
        return 0;
    }
    $handle = fopen($file, 'r');
    $count = 0;
    if ($handle !== false) {
        $line = fgetcsv($handle);
        if ($line !== false && isset($line[0]) && is_numeric($line[0])) {
            $count = (int)$line[0];
        }
        fclose($handle);
    }
    return $count;
}

// Fungsi simpan jumlah visitor ke CSV
function writeVisitorCount($file, $count) {
    $handle = fopen($file, 'w');
    if ($handle !== false) {
        fputcsv($handle, [$count]);
        fclose($handle);
        return true;
    }
    return false;
}

// Hitung visitor: baca + tambah 1
$visitorCount = readVisitorCount($visitorFile);
$visitorCount++;

// Simpan kembali ke CSV
writeVisitorCount($visitorFile, $visitorCount);
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Transaksi - Expense Receipt Generator by Febro Herdyanto</title>
    <link rel="stylesheet" href="assets/style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body {
    font-family: Arial, sans-serif;
    background: #f0f0f0;
    padding: 20px;
    margin: 0;
}

.container {
    max-width: 1000px;
    margin: auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px #ccc;
}

.split-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
}

.split-container > div {
    flex: 1 1 300px;
    max-width: 100%;
}

.form-section {
    width: 100%;
}

label {
    display: block;
    margin-bottom: 10px;
}

input[type="text"], input[type="number"], input[type="date"], input[type="time"], select {
    width: 100%;
    padding: 8px;
    margin-top: 4px;
    margin-bottom: 10px;
    box-sizing: border-box;
}

.btn {
    background: #007bff;
    color: white;
    padding: 10px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn:hover {
    background: #0056b3;
}

#preview {
    width: 100%;
    max-width: 320px;
    border: 1px dashed #ccc;
    padding: 15px;
    background: #fff;
    margin-top: 0;
    position: relative; /* untuk container posisi stempel LUNAS */
    min-height: 300px;
}

/* Stempel LUNAS overlay di tengah nota */
#preview.stamped {
    position: relative;
    display: block;
}

#preview .stamp-lunas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-20deg);
    font-size: 48px;
    font-weight: bold;
    color: rgba(255, 0, 0, 0.5);
    border: 4px solid rgba(255, 0, 0, 0.5);
    padding: 20px 40px;
    border-radius: 10px;
    pointer-events: none;
    user-select: none;
    text-transform: uppercase;
    font-family: 'Impact', Arial, sans-serif;
    z-index: 9999;
}

/* Responsive */
@media (max-width: 768px) {
    .split-container {
        flex-direction: column;
    }

    .split-container > div {
        flex: 1 1 100% !important;
        max-width: 100%;
    }

    #preview {
        margin-top: 20px;
        max-width: 100%;
    }
}
</style>
</head>
<body>
<div class="container">
  Website ini telah digunakan sebanyak <?= $visitorCount ?> kali <br><br>
  <a href="index.php">← Halaman Utama</a><br>
    <h2>Transaksi Baru</h2>

    <div class="split-container">
        <div class="form-section">
            <form id="transactionForm">
                <label>Toko:
                    <select id="store" required>
                        <option value="">Pilih Toko</option>
                        <?php foreach ($stores as $store): ?>
                            <option value="<?= $store['id_store'] ?>"><?= htmlspecialchars($store['name_store']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </label>

                <label>Nama Pelanggan:
                    <input type="text" id="cust_name" value="user">
                </label>

                <label>Tanggal:
                    <input type="date" id="date" value="<?= date('Y-m-d') ?>">
                </label>

                <label>Waktu:
                    <input type="time" id="time" value="<?= date('H:i') ?>">
                </label>

                <hr>

                <h3>Tambah Item</h3>
                <div id="itemContainer"></div>
                <button type="button" class="btn" onclick="addItemRow()">+ Tambah Menu</button>

                <hr>

                <label>Metode Bayar:
                    <select id="pay_method">
                        <option value="Cash">Cash</option>
                        <option value="Transfer">Transfer</option>
                        <option value="QRIS">QRIS</option>
                    </select>
                </label>

                <label>Total Bayar:
                    <input type="number" id="paid_total" value="0" min="0">
                </label>

                <!-- Checkbox Lunas -->
                <label>
                    <input type="checkbox" id="paid_stamp" />
                    Lunas / Paid
                </label>

                <button type="submit" class="btn">Simpan Transaksi</button>
            </form>
            <br>
        </div>

        <div class="preview-section">
            <div class="template-buttons" style="margin-bottom:10px;">
              Pilih Template : <br>
                <?php for ($i = 1; $i <= 11; $i++): ?>
                    <button type="button" style="background-color:#ffc107; color:#000; font-weight:bold;" onclick="currentTemplate = <?= $i ?>; updatePreview();"> <?= $i ?></button>
                <?php endfor; ?>
            </div>

            <button id="downloadBtn" type="button" class="btn" style="margin-bottom:15px;">Download Nota (JPG)</button>

            <div id="preview"></div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
<script>
let currentTemplate = 1;
let storeAddresses = <?= json_encode(array_column($stores, 'address', 'id_store')) ?>;

function formatCurrency(amount) {
    return 'Rp' + parseInt(amount).toLocaleString('id-ID');
}

function addItemRow() {
    const container = document.getElementById('itemContainer');
    const row = document.createElement('div');
    row.style.display = "flex";
    row.style.gap = "10px";
    row.style.marginBottom = "8px";
    row.style.alignItems = "center";

    row.innerHTML = `
        <select onchange="updatePreview()" style="flex:1;">
            <option value="">Pilih Menu</option>
            <?php foreach ($menus as $menu): ?>
            <option value="<?= $menu['id_menu'] ?>" data-name="<?= htmlspecialchars($menu['name_menu']) ?>" data-price="<?= $menu['price'] ?>">
                <?= htmlspecialchars($menu['name_menu']) ?> - Rp<?= number_format($menu['price'], 0, ',', '.') ?>
            </option>
            <?php endforeach; ?>
        </select>
        <input type="number" value="1" min="1" onchange="updatePreview()" style="width: 60px;">
        <button type="button" onclick="this.parentNode.remove(); updatePreview();">❌</button>
    `;
    container.appendChild(row);
    updatePreview();
}

function updatePreview() {
    const storeSelect = document.getElementById('store');
    const storeName = storeSelect.options[storeSelect.selectedIndex]?.text || '';
    const storeAddress = storeAddresses[storeSelect.value] || '';
    const custName = document.getElementById('cust_name').value || 'Pelanggan';
    const notaDate = new Date(document.getElementById('date').value + 'T' + document.getElementById('time').value);
    const formattedDate = notaDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ' ' + notaDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const bayar = parseInt(document.getElementById('paid_total').value) || 0;
    const method = document.getElementById('pay_method').value;
    const isPaid = document.getElementById('paid_stamp').checked;

    const kasirNames = ['Oka Suryani', 'Eka Putri', 'Citra Gunawan', 'Gita Yuliana', 'Eka Yuliana', 'Bayu Saputra', 'Rian Pratama', 'Andi Kurniawan', 'Dina Maharani', 'Agus Hidayat', 'Mega Sari', 'Tika Handayani', 'Fajar Ramadhan', 'Yulianto', 'Indah Permatasari', 'Rizky Fahreza', 'Nadia Lestari', 'Dimas Prasetyo', 'Farah Amelia', 'Taufik Hidayat', 'Restu Nugroho', 'Yani Wulandari', 'Budi Santoso', 'Melati Ayu', 'Galih Prasetya', 'Sari Dewi', 'Ilham Saputra', 'Ayu Kartika', 'Ardiansyah', 'Desi Apriani'];
    const randomKasir = kasirNames[Math.floor(Math.random() * kasirNames.length)];

    const closingMessages = [
        'Terima kasih telah berbelanja!',
        'Sampai jumpa kembali.',
        'Belanja lagi ya, kami tunggu!',
        'Terima kasih, semoga hari Anda menyenangkan.',
        'Struk ini adalah bukti pembayaran yang sah.',
        'Kami menghargai kepercayaan Anda.',
        'Pembelian Anda mendukung bisnis lokal.',
        'Selamat menikmati produk kami.',
        'Jangan lupa mampir lagi!',
        'Terima kasih atas kunjungannya.'
    ];
    const randomClosing = closingMessages[Math.floor(Math.random() * closingMessages.length)];

    const orderId = Math.floor(100000 + Math.random() * 899999);

    const items = [];
    document.querySelectorAll('#itemContainer > div').forEach(row => {
        const menuSel = row.querySelector('select');
        const qtyInput = row.querySelector('input[type=number]');
        const id = menuSel.value;
        const qty = parseInt(qtyInput.value) || 1;
        if (!id) return;

        const option = menuSel.options[menuSel.selectedIndex];
        const name = option.dataset.name;
        const price = parseInt(option.dataset.price);

        items.push({ id, name, qty, price, subtotal: qty * price });
    });

    let total = items.reduce((sum, item) => sum + item.subtotal, 0);
    let kembali = bayar - total;

    let html = '';
    switch (currentTemplate) {
        case 1:
            html = `<div style="font-family: Courier New; font-size: 13px">
            <center><b>=== ${storeName} ===</b><br>${formattedDate}</center><hr>
            Order#: ${orderId}<br>Kasir: ${randomKasir}<br>
            Pelanggan: ${custName}<br><br>
            ${items.map((item, i) => `${i+1}. ${item.name} x${item.qty} = ${formatCurrency(item.subtotal)}`).join('<br>')}<br><hr>
            TOTAL   : ${formatCurrency(total)}<br>
            BAYAR   : ${formatCurrency(bayar)}<br>
            KEMBALI : ${formatCurrency(kembali)}<br>
            Metode  : ${method}<br><hr>
            <center><i>${randomClosing}</i></center>
            </div>`;
            break;

        case 2:
            html = `
            <div style="font-family: 'Segoe UI', sans-serif; font-size: 14px;">
            <div style="text-align:center;"><strong>${storeName}</strong></div>
            <div style="text-align:center; font-size:12px;">${storeAddress}</div>
            <hr>
            <div><b>Nota:</b> #${orderId}<br><b>Tanggal:</b> ${formattedDate}</div><br>
            ${items.map((item, i) => `<div>${i + 1}. ${item.name} x${item.qty} <span style="float:right">${formatCurrency(item.subtotal)}</span></div>`).join('')}
            <hr>
            <div><b>Total</b><span style="float:right">${formatCurrency(total)}</span></div>
            <div><b>Bayar</b><span style="float:right">${formatCurrency(bayar)}</span></div>
            <div><b>Kembali</b><span style="float:right">${formatCurrency(kembali)}</span></div>
            <div><b>Metode</b>: ${method}</div>
            <div><b>Kasir</b>: ${randomKasir}</div>
            <hr>
            <p style="text-align:center; font-size:12px;">${randomClosing}</p>
            </div>`;
            break;

        case 3:
            html = `
            <div style="font-family: 'Helvetica Neue', sans-serif; font-size: 13px;">
            <center><b>${storeName.toUpperCase()}</b><br>${formattedDate}</center>
            <hr>
            ${items.map((item, i) => `<div>${item.qty} x ${item.name}<span style="float:right">${formatCurrency(item.subtotal)}</span></div>`).join('')}
            <hr>
            <div>Total: <b style="float:right">${formatCurrency(total)}</b></div>
            <div>Bayar: <b style="float:right">${formatCurrency(bayar)}</b></div>
            <div>Kembali: <b style="float:right">${formatCurrency(kembali)}</b></div>
            <br>
            <div>Kasir: ${randomKasir} | Metode: ${method}</div>
            <p style="text-align:center; font-size:12px;">${randomClosing}</p>
            </div>`;
            break;

        case 4:
            html = `
            <div style="font-family: Arial, sans-serif; font-size:13px">
            <div><b>${storeName}</b></div>
            <div>${storeAddress}</div>
            <div>Order ID: ${orderId}</div>
            <div>${formattedDate}</div>
            <hr>
            ${items.map((item, i) => `<div>${i+1}. ${item.name} (${item.qty}) - ${formatCurrency(item.subtotal)}</div>`).join('')}
            <hr>
            <div><b>Total</b>: ${formatCurrency(total)}</div>
            <div><b>Bayar</b>: ${formatCurrency(bayar)}</div>
            <div><b>Kembali</b>: ${formatCurrency(kembali)}</div>
            <div>Metode: ${method} | Kasir: ${randomKasir}</div>
            <p style="text-align:center;font-size:12px">${randomClosing}</p>
            </div>`;
            break;

        case 5:
            html = `
            <div style="font-family: Verdana, sans-serif; font-size:12px;">
            <center><b>== ${storeName} ==</b></center>
            <div style="text-align:center;">${formattedDate}</div>
            <hr>
            ${items.map((item, i) => `<div>${item.qty} x ${item.name} <span style="float:right">${formatCurrency(item.subtotal)}</span></div>`).join('')}
            <hr>
            <div><b>Total</b>: ${formatCurrency(total)}<br>
            <b>Bayar</b>: ${formatCurrency(bayar)}<br>
            <b>Kembali</b>: ${formatCurrency(kembali)}<br>
            Metode: ${method}<br>
            Kasir: ${randomKasir}</div>
            <hr>
            <p style="text-align:center;font-size:11px">${randomClosing}</p>
            </div>`;
            break;

        case 6:
            html = `
            <div style="font-family:'Tahoma'; font-size:13px;">
            <center><b>${storeName}</b></center>
            <div style="text-align:center;">${formattedDate}</div>
            <div>Pelanggan: ${custName}</div><hr>
            ${items.map((item, i) => `<div>${i+1}. ${item.name} x${item.qty} = ${formatCurrency(item.subtotal)}</div>`).join('')}
            <hr>
            <div>Total: ${formatCurrency(total)}</div>
            <div>Bayar: ${formatCurrency(bayar)}</div>
            <div>Kembali: ${formatCurrency(kembali)}</div>
            <div>Metode: ${method}</div>
            <div>Kasir: ${randomKasir}</div>
            <hr>
            <p style="text-align:center;font-style:italic">${randomClosing}</p>
            </div>`;
            break;

        case 7:
            html = `
            <div style="font-family: 'Georgia', serif; font-size: 13px;">
            <center><b>${storeName}</b><br>${storeAddress}</center>
            <hr>
            <div>Tanggal: ${formattedDate}</div>
            ${items.map((item, i) => `<div>${item.name} x${item.qty} <span style="float:right">${formatCurrency(item.subtotal)}</span></div>`).join('')}
            <hr>
            <div><b>Total</b> <span style="float:right">${formatCurrency(total)}</span></div>
            <div><b>Bayar</b> <span style="float:right">${formatCurrency(bayar)}</span></div>
            <div><b>Kembali</b> <span style="float:right">${formatCurrency(kembali)}</span></div>
            <div>Metode: ${method}</div>
            <div>Kasir: ${randomKasir}</div>
            <hr>
            <p style="text-align:center; font-size: 11px;">${randomClosing}</p>
            </div>`;
            break;

        case 8:
            html = `
            <div style="font-family: 'Courier New', monospace; font-size: 14px;">
            <center><b>${storeName}</b><br>${storeAddress}</center>
            <hr>
            ${items.map((item, i) => `<div>${i+1}. ${item.name} x${item.qty} = ${formatCurrency(item.subtotal)}</div>`).join('')}
            <hr>
            <div>Total: ${formatCurrency(total)}</div>
            <div>Bayar: ${formatCurrency(bayar)}</div>
            <div>Kembali: ${formatCurrency(kembali)}</div>
            <div>Metode: ${method}</div>
            <div>Kasir: ${randomKasir}</div>
            <hr>
            <p style="text-align:center; font-style: italic;">${randomClosing}</p>
            </div>`;
            break;

        case 9:
            html = `
            <div style="font-family: Arial, sans-serif; font-size: 12px;">
            <center><strong>${storeName}</strong></center>
            <div>${storeAddress}</div>
            <hr>
            <div>Tanggal: ${formattedDate}</div>
            ${items.map((item, i) => `<div>${item.qty}x ${item.name} <span style="float:right">${formatCurrency(item.subtotal)}</span></div>`).join('')}
            <hr>
            <div><strong>Total:</strong> <span style="float:right">${formatCurrency(total)}</span></div>
            <div><strong>Bayar:</strong> <span style="float:right">${formatCurrency(bayar)}</span></div>
            <div><strong>Kembali:</strong> <span style="float:right">${formatCurrency(kembali)}</span></div>
            <div>Metode: ${method}</div>
            <div>Kasir: ${randomKasir}</div>
            <hr>
            <p style="text-align:center; font-size: 11px;">${randomClosing}</p>
            </div>`;
            break;

        case 10:
            html = `
            <div style="font-family: Verdana, sans-serif; font-size: 13px;">
            <center><b>${storeName}</b><br>${formattedDate}</center>
            <hr>
            ${items.map((item, i) => `<div>${item.name} (${item.qty}) <span style="float:right">${formatCurrency(item.subtotal)}</span></div>`).join('')}
            <hr>
            <div>Total: ${formatCurrency(total)}</div>
            <div>Bayar: ${formatCurrency(bayar)}</div>
            <div>Kembali: ${formatCurrency(kembali)}</div>
            <div>Metode: ${method}</div>
            <div>Kasir: ${randomKasir}</div>
            <hr>
            <p style="text-align:center; font-size: 12px;">${randomClosing}</p>
            </div>`;
            break;

        case 11:
            html = `<div style="font-family: Courier New; font-size: 13px">
              <center><b>${storeName}</b><br>${storeAddress}</center><hr>
              Order ID: ${orderId}<br>
              Kasir: ${randomKasir}<br>
              Waktu: ${formattedDate}<hr>
              ${items.map((item, i) => `${i+1}. ${item.name} (${item.qty}) = ${formatCurrency(item.qty * item.price)}`).join('<br>')}<hr>
              Total: ${formatCurrency(total)}<br>Bayar: ${formatCurrency(bayar)}<br>Kembali: ${formatCurrency(kembali)}<br>Metode: ${method}<hr>
              <p style="text-align:center;font-size:12px">${randomClosing}</p>
            </div>`;
            break;


        default:
            html = `<div>Template tidak ditemukan.</div>`;
    }

    // Tambahkan stempel LUNAS jika dicentang, tanpa bungkus inline-block agar layout tidak berubah
    const previewDiv = document.getElementById('preview');
    if (isPaid) {
        previewDiv.classList.add('stamped');
        previewDiv.innerHTML = html + '<div class="stamp-lunas">LUNAS</div>';
    } else {
        previewDiv.classList.remove('stamped');
        previewDiv.innerHTML = html;
    }
}

// Tambah 1 row item default saat halaman load
window.onload = () => {
    addItemRow();
    updatePreview();
};

// Update preview tiap kali form berubah
document.getElementById('transactionForm').addEventListener('input', updatePreview);
document.getElementById('transactionForm').addEventListener('change', updatePreview);

document.getElementById('transactionForm').addEventListener('submit', function(e){
    e.preventDefault();
    alert('Fitur simpan transaksi belum diimplementasikan.');
});

// Download preview jadi JPG
document.getElementById('downloadBtn').addEventListener('click', () => {
    const preview = document.getElementById('preview');
    html2canvas(preview).then(canvas => {
        const link = document.createElement('a');
        link.download = 'nota_' + Date.now() + '.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
    });
});
</script>
</body>
</html>
