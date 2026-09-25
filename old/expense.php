<?php 
// =================================
// NEW DESIGN WITH LANGUAGE, VAT, DISCOUNT
// =================================
?>
<?php /* expense.php (enhanced) */ ?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Transaksi - Expense Receipt Generator by Febro Herdyanto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: Arial, sans-serif; background: #f0f0f0; padding: 20px; margin: 0; }
    .container { max-width: 1000px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px #ccc; }
    .split-container { display: flex; flex-direction: row; gap: 20px; }
    .split-container > div { flex: 1 1 300px; max-width: 100%; }
    .form-section { width: 100%; }
    label { display: block; margin-bottom: 10px; }
    .inline { display:flex; gap:10px; align-items:center; }
    input[type="text"], input[type="number"], input[type="date"], input[type="time"], select, textarea {
      width: 100%; padding: 8px; margin-top: 4px; margin-bottom: 10px; box-sizing: border-box;
    }
    .btn { background: #007bff; color: #fff; padding: 10px 16px; border: none; border-radius: 5px; cursor: pointer; }
    .btn:hover { background: #0056b3; }
    #preview {
      width: 100%; max-width: 320px; border: 1px dashed #ccc; padding: 15px; background: #fff;
      margin-top: 0; position: relative; min-height: 300px;
    }
    #preview.stamped { position: relative; display: block; }
    #preview .stamp-lunas {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-20deg);
      font-size: 48px; font-weight: bold; color: rgba(255,0,0,.5);
      border: 4px solid rgba(255,0,0,.5); padding: 20px 40px; border-radius: 10px;
      pointer-events: none; user-select: none; text-transform: uppercase; font-family: 'Impact', Arial, sans-serif; z-index: 2;
    }
    .item-row { display: grid; grid-template-columns: 1.2fr 0.6fr 0.8fr auto; gap: 10px; align-items: center; margin-bottom: 8px; }
    .item-row input { margin: 0; }
    .item-row button { padding: 8px 10px; }
    .template-buttons button { background-color:#ffc107; color:#000; font-weight:bold; margin: 0 4px 6px 0; }
    hr { border: 0; height: 1px; background: #e2e2e2; }
    .totals-block { margin-top: 10px; border-top: 1px dashed #ddd; padding-top: 8px; font-size: 14px; }
    .totals-row { display:flex; justify-content: space-between; margin: 4px 0; }
    .totals-row.total { font-weight: 700; }
    @media (max-width: 768px) {
      .split-container { flex-direction: column; }
      .split-container > div { flex: 1 1 100% !important; max-width: 100%; }
      #preview { margin-top: 20px; max-width: 100%; }
      .item-row { grid-template-columns: 1fr 0.6fr 0.8fr auto; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Language Switcher -->
    <div class="inline" style="justify-content: space-between; flex-wrap:wrap;">
      <div id="usageLine">Website ini telah digunakan sebanyak 0 kali</div>
      <div>
        <label class="inline" style="margin:0;">
          <span id="langLabel">Bahasa</span>:
          <select id="langSelect" style="min-width:160px;">
            <option value="id">Indonesia</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>
    </div>

    <br />
    <a href="#" onclick="location.reload()">← <span data-i18n="home">Halaman Utama</span></a><br />
    <h2 data-i18n="new_tx">Transaksi Baru</h2>

    <div class="split-container">
      <!-- FORM -->
      <div class="form-section">
        <form id="transactionForm" autocomplete="off">
          <!-- TOKO MANUAL -->
          <label><span data-i18n="store_name">Nama Toko</span>:
            <input type="text" id="store_name" placeholder="Contoh: Toko Sinar Jaya" required />
          </label>

          <div class="inline" style="gap:10px; flex-wrap:wrap;">
            <label style="flex:1; min-width:220px;"><span data-i18n="store_addr">Alamat Toko</span>:
              <textarea id="store_address" rows="2" placeholder="Alamat singkat (opsional)"></textarea>
            </label>
            <label class="inline" style="margin:0; min-width:110px;">
              <input type="checkbox" id="store_address_show" checked /> <span data-i18n="show">Show</span>
            </label>
          </div>

          <div class="inline" style="gap:20px; flex-wrap:wrap;">
            <label style="flex:1; min-width:200px;"><span data-i18n="cust_name">Nama Pelanggan</span>:
              <input type="text" id="cust_name" value="user" />
            </label>
            <label class="inline" style="margin:0;">
              <input type="checkbox" id="cust_show" checked /> <span data-i18n="show">Show</span>
            </label>
          </div>

          <div class="inline" style="gap:20px; flex-wrap:wrap;">
            <label style="flex:1; min-width:180px;"><span data-i18n="date">Tanggal</span>:
              <input type="date" id="date" />
            </label>
            <label style="flex:1; min-width:150px;"><span data-i18n="time">Waktu</span>:
              <input type="time" id="time" />
            </label>
          </div>

          <hr />

          <!-- === ORDER ID === -->
          <div style="display:grid; grid-template-columns: 1fr auto auto; gap:10px; align-items:end;">
            <label><span data-i18n="order_id">Order ID</span>:
              <input type="text" id="order_id" placeholder="cth: 483921" />
            </label>
            <label class="inline" style="margin:0;">
              <input type="checkbox" id="order_show" checked /> <span data-i18n="show">Show</span>
            </label>
            <label class="inline" style="margin:0;">
              <input type="checkbox" id="order_random" checked /> <span data-i18n="random">Random</span>
            </label>
          </div>

          <!-- === NAMA KASIR === -->
          <div style="display:grid; grid-template-columns: 1fr auto auto; gap:10px; align-items:end; margin-top:8px;">
            <label><span data-i18n="cashier_name">Nama Kasir</span>:
              <input type="text" id="cashier_name" placeholder="cth: Eka Putri" />
            </label>
            <label class="inline" style="margin:0;">
              <input type="checkbox" id="cashier_show" checked /> <span data-i18n="show">Show</span>
            </label>
            <label class="inline" style="margin:0;">
              <input type="checkbox" id="cashier_random" checked /> <span data-i18n="random">Random</span>
            </label>
          </div>

          <!-- === FOOTER NOTE === -->
          <div style="display:grid; grid-template-columns: 1fr auto auto; gap:10px; align-items:end; margin-top:8px;">
            <label><span data-i18n="footer_note">Footer Note</span>:
              <input type="text" id="footer_note" placeholder="Ucapan terima kasih / catatan" />
            </label>
            <label class="inline" style="margin:0;">
              <input type="checkbox" id="footer_show" checked /> <span data-i18n="show">Show</span>
            </label>
            <label class="inline" style="margin:0;">
              <input type="checkbox" id="footer_random" checked /> <span data-i18n="random">Random</span>
            </label>
          </div>

          <hr />

          <h3 data-i18n="add_item">Tambah Item</h3>
          <div id="itemContainer"></div>
          <button type="button" class="btn" onclick="addItemRow()"><span data-i18n="btn_add_item">+ Tambah Item</span></button>

          <hr />

          <!-- DISCOUNT -->
          <div class="inline" style="gap:10px; flex-wrap:wrap;">
            <label style="flex:1; min-width:220px;"><span data-i18n="discount">Diskon</span>:
              <div class="inline" style="gap:10px;">
                <select id="disc_type" style="max-width:180px;">
                  <option value="percent">Percent (%)</option>
                  <option value="amount">Amount (Rp)</option>
                </select>
                <input type="number" id="disc_value" min="0" step="1" value="0" />
              </div>
            </label>
            <label class="inline" style="margin:0; min-width:110px;">
              <input type="checkbox" id="disc_show" checked /> <span data-i18n="show">Show</span>
            </label>
          </div>

          <!-- VAT -->
          <div class="inline" style="gap:10px; flex-wrap:wrap;">
            <label style="flex:1; min-width:220px;"><span data-i18n="vat">VAT</span> (%):
              <input type="number" id="vat_rate" min="0" max="100" step="0.1" value="0" />
            </label>
            <label class="inline" style="margin:0; min-width:110px;">
              <input type="checkbox" id="vat_show" checked /> <span data-i18n="show">Show</span>
            </label>
          </div>

          <!-- PAYMENT -->
          <label><span data-i18n="pay_method">Metode Bayar</span>:
            <select id="pay_method">
              <option value="Debit/Credit Card">Debit/Credit Card</option>
              <option value="QR Payment">QR Payment</option>
              <option value="Transfer">Transfer</option>
              <option value="Cash">Cash</option>
            </select>
          </label>

          <label><span data-i18n="paid_total">Total Bayar</span>:
            <input type="number" id="paid_total" value="0" min="0" />
          </label>

          <label class="inline">
            <input type="checkbox" id="paid_stamp" />
            <span id="paidLabel">Lunas / Paid</span>
          </label>

          <label class="inline">
            <input type="checkbox" id="show_watermark" />
            <span data-i18n="show_watermark">Tampilkan Watermark Resto</span>
          </label>

          <button type="submit" class="btn" id="saveBtn"><span data-i18n="save_tx">Simpan Transaksi</span></button>
        </form>
        <br />
      </div>

      <!-- PREVIEW -->
      <div class="preview-section">
        <div class="template-buttons" style="margin-bottom:10px;">
          <span data-i18n="choose_template">Pilih Template</span> : <br />
          <span id="templateButtons"></span>
        </div>
        <button id="downloadBtn" type="button" class="btn" style="margin-bottom:15px;"><span data-i18n="download_receipt">Download Nota (JPG)</span></button>
        <div id="preview"></div>
      </div>
    </div>
  </div>

  <!-- html2canvas -->
  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
  <!-- templates -->
  <script src="template.php"></script>

  <script>
    // ====== I18N ======
    const I18N = {
      id: {
        home: "Halaman Utama",
        new_tx: "Transaksi Baru",
        store_name: "Nama Toko",
        store_addr: "Alamat Toko",
        cust_name: "Nama Pelanggan",
        date: "Tanggal",
        time: "Waktu",
        order_id: "Order ID",
        cashier_name: "Nama Kasir",
        footer_note: "Footer Note",
        add_item: "Tambah Item",
        btn_add_item: "+ Tambah Item",
        discount: "Diskon",
        vat: "VAT",
        pay_method: "Metode Bayar",
        paid_total: "Total Bayar",
        show_watermark: "Tampilkan Watermark Resto",
        save_tx: "Simpan Transaksi",
        choose_template: "Pilih Template",
        download_receipt: "Download Nota (JPG)",
        show: "Show",
        random: "Random",
        language: "Bahasa",
        usagePrefix: "Website ini telah digunakan sebanyak",
        stampPaid: "LUNAS",
        subtotal: "Subtotal",
        disc_label_percent: "Diskon",
        disc_label_amount: "Diskon",
        vat_label: "VAT",
        grand_total: "Grand Total",
        paid_with: "Dibayar (",
        change: "Kembalian"
      },
      en: {
        home: "Home",
        new_tx: "New Transaction",
        store_name: "Store Name",
        store_addr: "Store Address",
        cust_name: "Customer Name",
        date: "Date",
        time: "Time",
        order_id: "Order ID",
        cashier_name: "Cashier Name",
        footer_note: "Footer Note",
        add_item: "Add Item",
        btn_add_item: "+ Add Item",
        discount: "Discount",
        vat: "VAT",
        pay_method: "Payment Method",
        paid_total: "Amount Paid",
        show_watermark: "Show Store Watermark",
        save_tx: "Save Transaction",
        choose_template: "Choose Template",
        download_receipt: "Download Receipt (JPG)",
        show: "Show",
        random: "Random",
        language: "Language",
        usagePrefix: "This website has been used",
        stampPaid: "PAID",
        subtotal: "Subtotal",
        disc_label_percent: "Discount",
        disc_label_amount: "Discount",
        vat_label: "VAT",
        grand_total: "Grand Total",
        paid_with: "Paid (",
        change: "Change"
      }
    };
    let CURRENT_LANG = 'id';

    function applyI18n() {
      const dict = I18N[CURRENT_LANG];
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
      });
      document.getElementById('langLabel').textContent = dict.language;
      document.getElementById('paidLabel').textContent = (dict.stampPaid === 'PAID') ? 'Paid' : 'Lunas / Paid';

      // placeholders
      document.getElementById('store_name').placeholder = (CURRENT_LANG==='en') ? 'e.g., Sinar Jaya Store' : 'Contoh: Toko Sinar Jaya';
      document.getElementById('store_address').placeholder = (CURRENT_LANG==='en') ? 'Short address (optional)' : 'Alamat singkat (opsional)';
      document.getElementById('footer_note').placeholder = (CURRENT_LANG==='en') ? 'Thank you note / remark' : 'Ucapan terima kasih / catatan';

      // Download button text handled by data-i18n
      updatePreview(); // to refresh labels in totals block and stamp text
    }

    document.getElementById('langSelect').addEventListener('change', (e)=>{
      CURRENT_LANG = e.target.value;
      applyI18n();
    });

    // ====== UTIL ======
    const nfIDR = new Intl.NumberFormat('id-ID');
    const nfEN = new Intl.NumberFormat('en-US');
    const formatCurrency = (amount) => {
      const v = Math.max(0, Math.floor(amount || 0));
      // Tetap pakai Rupiah tampilan "Rp" sesuai requirement awal
      return 'Rp' + nfIDR.format(v);
    };
    const randOrderId = () => String(Math.floor(100000 + Math.random() * 900000));
    const KASIR_LIST = ['Oka Suryani','Eka Putri','Citra Gunawan','Gita Yuliana','Eka Yuliana','Bayu Saputra','Rian Pratama','Andi Kurniawan','Dina Maharani','Agus Hidayat','Mega Sari','Tika Handayani','Fajar Ramadhan','Yulianto','Indah Permatasari','Rizky Fahreza','Nadia Lestari','Dimas Prasetyo','Farah Amelia','Taufik Hidayat','Restu Nugroho','Yani Wulandari','Budi Santoso','Melati Ayu','Galih Prasetya','Sari Dewi','Ilham Saputra','Ayu Kartika','Ardiansyah','Desi Apriani'];
    const randKasir = () => KASIR_LIST[Math.floor(Math.random() * KASIR_LIST.length)];
    const FOOTER_PRESET = [
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
    const FOOTER_PRESET_EN = [
      'Thank you for shopping!',
      'See you again.',
      'Come back soon!',
      'Thank you, have a great day.',
      'This receipt is a valid proof of payment.',
      'We appreciate your trust.',
      'Your purchase supports local business.',
      'Enjoy our products.',
      'Don’t forget to stop by again!',
      'Thank you for your visit.'
    ];
    const randFooter = () => {
      return (CURRENT_LANG==='en'
        ? FOOTER_PRESET_EN[Math.floor(Math.random() * FOOTER_PRESET_EN.length)]
        : FOOTER_PRESET[Math.floor(Math.random() * FOOTER_PRESET.length)]
      );
    };

    // ====== COUNTER via localStorage (bukan CSV) ======
    (function usageCounter(){
      try {
        const key = 'nota_usage_count';
        const now = (parseInt(localStorage.getItem(key) || '0', 10) + 1);
        localStorage.setItem(key, String(now));
        const usageText = (CURRENT_LANG==='en')
          ? `${I18N.en.usagePrefix} ${nfEN.format(now)} times`
          : `${I18N.id.usagePrefix} ${nfIDR.format(now)} kali`;
        document.getElementById('usageLine').textContent = usageText;
      } catch(e) {
        document.getElementById('usageLine').textContent = '...';
      }
    })();

    // ====== STATE ======
    let currentTemplate = 1;

    // ====== INIT ======
    function initDateTimeDefaults() {
      const d = document.getElementById('date');
      const t = document.getElementById('time');
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      d.value = `${yyyy}-${mm}-${dd}`;
      const hh = String(now.getHours()).padStart(2, '0');
      const mi = String(now.getMinutes()).padStart(2, '0');
      t.value = `${hh}:${mi}`;
    }

    function buildTemplateButtons() {
      const holder = document.getElementById('templateButtons');
      holder.innerHTML = '';
      for (let i = 1; i <= 21; i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = ' ' + i + ' ';
        b.onclick = () => { currentTemplate = i; updatePreview(); };
        holder.appendChild(b);
      }
    }

    // ====== ITEMS ======
    function addItemRow(initial = { name: '', qty: 1, price: 0 }) {
      const container = document.getElementById('itemContainer');
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <input type="text" class="item-name" placeholder="${CURRENT_LANG==='en'?'Item name':'Nama item'}" value="${initial.name}" />
        <input type="number" class="item-qty" min="1" value="${initial.qty}" />
        <input type="number" class="item-price" min="0" value="${initial.price}" placeholder="${CURRENT_LANG==='en'?'Price (Rp)':'Harga (Rp)'}" />
        <button type="button" class="btn btn-del">❌</button>
      `;
      row.querySelector('.item-name').addEventListener('input', updatePreview);
      row.querySelector('.item-qty').addEventListener('input', (e) => { if (+e.target.value < 1) e.target.value = 1; updatePreview(); });
      row.querySelector('.item-price').addEventListener('input', (e) => { if (+e.target.value < 0) e.target.value = 0; updatePreview(); });
      row.querySelector('.btn-del').addEventListener('click', () => { row.remove(); updatePreview(); });
      container.appendChild(row);
      updatePreview();
    }

    function getItems() {
      return Array.from(document.querySelectorAll('#itemContainer .item-row')).map(r => {
        const name = r.querySelector('.item-name').value.trim();
        const qty = Math.max(1, parseInt(r.querySelector('.item-qty').value || '1', 10));
        const price = Math.max(0, parseInt(r.querySelector('.item-price').value || '0', 10));
        if (!name) return null;
        return { name, qty, price, subtotal: qty * price };
      }).filter(Boolean);
    }

    // ====== RANDOM/SHOW HANDLER ======
    function maybeRandomizeFields() {
      const orderRandom = document.getElementById('order_random').checked;
      const cashierRandom = document.getElementById('cashier_random').checked;
      const footerRandom = document.getElementById('footer_random').checked;

      const orderInput = document.getElementById('order_id');
      const cashierInput = document.getElementById('cashier_name');
      const footerInput = document.getElementById('footer_note');

      if (orderRandom) orderInput.value = randOrderId();
      if (cashierRandom) cashierInput.value = randKasir();
      if (footerRandom) footerInput.value = randFooter();

      orderInput.disabled = orderRandom;
      cashierInput.disabled = cashierRandom;
      footerInput.disabled = footerRandom;
    }

    // ====== PREVIEW ======
    function computeTotals(items) {
      const subtotal = items.reduce((s, it) => s + it.subtotal, 0);

      // Discount
      const discType = document.getElementById('disc_type').value;
      const discValue = Math.max(0, parseFloat(document.getElementById('disc_value').value || '0'));
      const discountAmount = discType === 'percent' ? (subtotal * (discValue/100)) : discValue;
      const afterDisc = Math.max(0, subtotal - discountAmount);

      // VAT
      const vatRate = Math.max(0, parseFloat(document.getElementById('vat_rate').value || '0'));
      const vatAmount = afterDisc * (vatRate/100);

      const grandTotal = afterDisc + vatAmount;

      return { subtotal, discountAmount, discType, discValue, vatRate, vatAmount, grandTotal };
    }

    function makeTotalsBlock(ctx, i18n) {
      const rows = [];
      rows.push(`<div class="totals-row"><span>${i18n.subtotal}</span><span>${ctx.fmt(ctx.subtotal)}</span></div>`);
      if (ctx.discShow && ctx.discountAmount > 0) {
        const discLabel = (ctx.discType==='percent')
          ? `${i18n.disc_label_percent} (${(ctx.discValue).toString().replace('.', ',')}%)`
          : `${i18n.disc_label_amount}`;
        rows.push(`<div class="totals-row"><span>${discLabel}</span><span>- ${ctx.fmt(ctx.discountAmount)}</span></div>`);
      }
      if (ctx.vatShow && ctx.vatAmount > 0) {
        rows.push(`<div class="totals-row"><span>${i18n.vat_label} (${(ctx.vatRate).toString().replace('.', ',')}%)</span><span>${ctx.fmt(ctx.vatAmount)}</span></div>`);
      }
      rows.push(`<div class="totals-row total"><span>${i18n.grand_total}</span><span>${ctx.fmt(ctx.grandTotal)}</span></div>`);
      // Paid line + change
      rows.push(`<div class="totals-row"><span>${i18n.paid_with}${ctx.method})</span><span>${ctx.fmt(ctx.bayar)}</span></div>`);
      rows.push(`<div class="totals-row"><span>${i18n.change}</span><span>${ctx.fmt(ctx.kembali)}</span></div>`);
      return `<div class="totals-block">${rows.join('')}</div>`;
    }

    function updatePreview() {
      // sinkron random dulu
      maybeRandomizeFields();

      const dict = I18N[CURRENT_LANG];

      const storeName = document.getElementById('store_name').value.trim() || (CURRENT_LANG==='en'?'Store Name':'Nama Toko');
      const storeAddress = (document.getElementById('store_address').value || '').trim();
      const storeAddressShow = document.getElementById('store_address_show').checked;

      const custNameRaw = (document.getElementById('cust_name').value || '').trim();
      const custShow = document.getElementById('cust_show').checked;

      const dtStr = (document.getElementById('date').value || '') + 'T' + (document.getElementById('time').value || '');
      const notaDate = dtStr ? new Date(dtStr) : new Date();
      const dateStr =
        notaDate.toLocaleDateString(CURRENT_LANG==='en'?'en-GB':'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) +
        ' ' +
        notaDate.toLocaleTimeString(CURRENT_LANG==='en'?'en-GB':'id-ID', { hour: '2-digit', minute: '2-digit' });

      const bayar = parseInt(document.getElementById('paid_total').value || '0', 10);
      const method = document.getElementById('pay_method').value;
      const isPaid = document.getElementById('paid_stamp').checked;

      const showOrder = document.getElementById('order_show').checked;
      const showCashier = document.getElementById('cashier_show').checked;
      const orderId = (document.getElementById('order_id').value || '').trim();
      const cashierName = (document.getElementById('cashier_name').value || '').trim();

      const footerShow = document.getElementById('footer_show').checked;
      const footerNote = (document.getElementById('footer_note').value || '').trim();

      const showWatermark = document.getElementById('show_watermark').checked;

      const items = getItems();

      // Totals
      const totals = computeTotals(items);
      const kembali = bayar - totals.grandTotal;

      // ctx for template
      const ctx = {
        storeName,
        storeAddress: storeAddressShow ? storeAddress : '',
        custName: custShow ? (custNameRaw || (CURRENT_LANG==='en'?'Customer':'Pelanggan')) : '',
        dateStr,
        items,
        // legacy totals kept for compatibility with old templates:
        total: totals.grandTotal, // for old templates expecting ctx.total
        bayar, kembali,
        method,
        orderId: showOrder ? orderId : '',
        cashierName: showCashier ? cashierName : '',
        footerNote: footerShow ? footerNote : '',
        showWatermark,
        // new fields for extended summary:
        subtotal: totals.subtotal,
        discountAmount: totals.discountAmount,
        discType: totals.discType,
        discValue: totals.discValue,
        vatRate: totals.vatRate,
        vatAmount: totals.vatAmount,
        grandTotal: totals.grandTotal,
        discShow: document.getElementById('disc_show').checked,
        vatShow: document.getElementById('vat_show').checked,
        fmt: formatCurrency
      };

      const previewDiv = document.getElementById('preview');
      if (!window.templates || typeof window.templates.render !== 'function') {
        previewDiv.innerHTML = '<div style="color:#c00">template.php tidak termuat / render() tidak ditemukan.</div>';
        return;
      }

      // Render receipt HTML from template
      let html = window.templates.render(currentTemplate, ctx, formatCurrency);

      // Append totals block (makes VAT/Discount visible even if template.php belum support)
      //const totalsBlock = makeTotalsBlock(ctx, dict);
      //html += totalsBlock;

      // PAID Stamp text localized
      const stampText = I18N[CURRENT_LANG].stampPaid;

      // Place into preview (and add stamp if needed)
      if (isPaid) {
        previewDiv.classList.add('stamped');
        previewDiv.innerHTML = html + `<div class="stamp-lunas">${stampText}</div>`;
      } else {
        previewDiv.classList.remove('stamped');
        previewDiv.innerHTML = html;
      }

      // Watermark AFTER innerHTML
      if (showWatermark) {
        const wm = document.createElement('div');
        wm.style.position = 'absolute';
        wm.style.top = '50%';
        wm.style.left = '50%';
        wm.style.transform = 'translate(-50%,-50%) rotate(-25deg)';
        wm.style.fontSize = '24px';
        wm.style.fontWeight = '700';
        wm.style.color = 'rgba(0,0,0,0.3)';
        wm.style.textAlign = 'center';
        wm.style.pointerEvents = 'none';
        wm.style.userSelect = 'none';
        wm.style.lineHeight = '1.4';
        wm.style.zIndex = '1';
        wm.innerHTML = `${ctx.storeName}<br><span style="font-size:14px;">${ctx.storeAddress || ''}</span>`;
        previewDiv.appendChild(wm);
      }
    }

    // ====== EVENTS ======
    window.addEventListener('load', () => {
      initDateTimeDefaults();
      buildTemplateButtons();
      // default random values
      document.getElementById('order_id').value = randOrderId();
      document.getElementById('cashier_name').value = randKasir();
      document.getElementById('footer_note').value = randFooter();
      // watermark default OFF (per request) -> checkbox already unchecked in HTML
      // satu baris item awal
      addItemRow();
      applyI18n(); // set initial language texts
      updatePreview();
    });

    // re-render on change
    document.getElementById('transactionForm').addEventListener('input', updatePreview);
    document.getElementById('transactionForm').addEventListener('change', updatePreview);

    // explicit listeners for random toggles
    document.getElementById('order_random').addEventListener('change', () => {
      if (document.getElementById('order_random').checked) document.getElementById('order_id').value = randOrderId();
      updatePreview();
    });
    document.getElementById('cashier_random').addEventListener('change', () => {
      if (document.getElementById('cashier_random').checked) document.getElementById('cashier_name').value = randKasir();
      updatePreview();
    });
    document.getElementById('footer_random').addEventListener('change', () => {
      if (document.getElementById('footer_random').checked) document.getElementById('footer_note').value = randFooter();
      updatePreview();
    });

    // submit (simulasi)
    document.getElementById('transactionForm').addEventListener('submit', function(e){
      e.preventDefault();
      alert((CURRENT_LANG==='en')
        ? 'Transaction saved (simulation). No CSV/server storage.'
        : 'Transaksi tersimpan (simulasi). Tidak ada penyimpanan ke CSV / server.'
      );
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
