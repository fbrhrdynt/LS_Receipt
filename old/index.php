<?php
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
writeVisitorCount($visitorFile, $visitorCount);
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expense Receipt Generator by Febro Herdyanto</title>
    <!-- Font Awesome untuk ikon -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg,#f0f0f0,#e4e4e4);
            margin: 0; padding: 20px;
            display: flex; justify-content: center; align-items: center;
            min-height: 100vh;
        }
        .container {
            width: 100%; max-width: 440px;
            background: white;
            padding: 30px 25px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        }
        h1 {
            text-align: center;
            font-size: 1.8em;
            margin-bottom: 28px;
            color: #2c3e50;
        }
        ul { list-style: none; padding: 0; margin: 0; }
        li { margin-bottom: 15px; }
        a {
            display: flex; align-items: center; justify-content: center;
            gap: 8px;
            background: #007bff;
            color: white; padding: 14px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            transition: transform 0.2s ease, background 0.3s ease;
        }
        a:hover {
            background: #0056b3;
            transform: translateY(-2px);
        }
        a i { font-size: 16px; }

        /* Tombol Hijau untuk menu baru */
        a.new-version {
            background: #28a745;
        }
        a.new-version:hover {
            background: #1e7e34;
        }

        /* Tombol Polos IG */
        a.ig-link {
            background: #E4405F;   /* warna khas IG */
            color: #fff;
        }
        a.ig-link:hover {
            background: #c13584;   /* lebih gelap saat hover */
        }

        .credit {
            margin-top: 30px;
            text-align: center;
            font-size: 0.9em;
            color: #555;
        }
        .credit div {
            margin: 6px 0;
        }

        @media (max-width: 480px) {
            h1 { font-size: 1.5em; }
            a { padding: 12px; font-size: 1em; }
        }
    </style>
</head>
<body>
<div class="container">
    <h1>Expense Receipt Generator</h1>
    <ul>
        <li><a href="store.php"><i class="fas fa-store"></i> Data Toko</a></li>
        <li><a href="menu.php"><i class="fas fa-utensils"></i> Data Menu</a></li>
        <li><a href="transaction.php"><i class="fas fa-receipt"></i> Transaksi & Receipt</a></li>
        <li><a href="expense.php" class="new-version"><i class="fas fa-file-invoice-dollar"></i> E-Receipt Manual (New Version)</a></li>
    </ul>

    <div class="credit">
        <div>&copy; 2025 · Febro Herdyanto</div>
        <div>
            <a href="https://instagram.com/febroherdyanto" target="_blank" class="ig-link">
                <i class="fab fa-instagram"></i> @febroherdyanto
            </a>
        </div>
        <div>Website ini telah digunakan sebanyak <?= $visitorCount ?> kali</div>
    </div>
</div>
</body>
</html>
