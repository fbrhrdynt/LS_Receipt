<?php
// save_transaction.php

function readCsv($filename) {
    $rows = [];
    if(!file_exists($filename)) return $rows;
    if (($handle = fopen($filename, "r")) !== FALSE) {
        $header = fgetcsv($handle);
        while (($data = fgetcsv($handle)) !== FALSE) {
            $rows[] = array_combine($header, $data);
        }
        fclose($handle);
    }
    return $rows;
}

function writeCsv($filename, $rows, $header) {
    $handle = fopen($filename, 'w');
    fputcsv($handle, $header);
    foreach($rows as $row) {
        fputcsv($handle, $row);
    }
    fclose($handle);
}

// File CSV
$fileTransactions = 'data/transactions.csv';
$fileDetails = 'data/detail_transaction.csv';

// Header untuk masing-masing CSV
$headerTransactions = ['id_transaction', 'cust_name', 'date', 'time', 'total', 'pay_method', 'paid_total', 'kembalian'];
$headerDetails = ['id_detail', 'id_transaction', 'id_menu', 'qty', 'sub_total'];

// Ambil data POST
$cust_name = trim($_POST['cust_name'] ?? '');
$date = $_POST['date'] ?? '';
$time = $_POST['time'] ?? '';
$pay_method = $_POST['pay_method'] ?? '';
$paid_total = (int)($_POST['paid_total'] ?? 0);

$id_menus = $_POST['id_menu'] ?? [];
$qtys = $_POST['qty'] ?? [];

if(!$cust_name || !$date || !$time || !$pay_method || empty($id_menus) || empty($qtys)) {
    die("Data transaksi tidak lengkap. <a href='transaction.php'>Kembali</a>");
}

// Validasi qty dan id_menu jumlah harus sama
if(count($id_menus) !== count($qtys)) {
    die("Data item transaksi tidak valid. <a href='transaction.php'>Kembali</a>");
}

// Hitung total transaksi
$menusCsv = readCsv('data/item_menu.csv');
$menuPriceMap = [];
foreach($menusCsv as $m) {
    $menuPriceMap[$m['id_menu']] = (int)$m['price'];
}

$total = 0;
$items = [];
for($i=0; $i<count($id_menus); $i++) {
    $id_menu = $id_menus[$i];
    $qty = (int)$qtys[$i];
    if($qty <= 0) continue;

    $price = $menuPriceMap[$id_menu] ?? 0;
    $sub_total = $price * $qty;
    $total += $sub_total;

    $items[] = [
        'id_menu' => $id_menu,
        'qty' => $qty,
        'sub_total' => $sub_total
    ];
}

// Hitung kembalian
$kembalian = $paid_total - $total;
if($kembalian < 0) $kembalian = 0;

// Baca transaksi dan detail existing
$transactions = readCsv($fileTransactions);
$details = readCsv($fileDetails);

// Generate new id_transaction
$new_id_trans = count($transactions) ? (max(array_map(function($t){return (int)$t['id_transaction'];}, $transactions)) +1) : 1;

// Simpan transaksi baru
$transactions[] = [
    'id_transaction' => $new_id_trans,
    'cust_name' => $cust_name,
    'date' => $date,
    'time' => $time,
    'total' => $total,
    'pay_method' => $pay_method,
    'paid_total' => $paid_total,
    'kembalian' => $kembalian
];

// Simpan detail transaksi
$new_detail_id = count($details) ? (max(array_map(function($d){return (int)$d['id_detail'];}, $details)) +1) : 1;
foreach($items as $item) {
    $details[] = [
        'id_detail' => $new_detail_id++,
        'id_transaction' => $new_id_trans,
        'id_menu' => $item['id_menu'],
        'qty' => $item['qty'],
        'sub_total' => $item['sub_total']
    ];
}

// Tulis ulang CSV
writeCsv($fileTransactions, $transactions, $headerTransactions);
writeCsv($fileDetails, $details, $headerDetails);

// Redirect ke halaman transaksi dengan pesan sukses (atau bisa ke halaman lain)
header("Location: transaction.php?success=1");
exit;
