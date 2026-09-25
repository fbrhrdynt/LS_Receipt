<?php
// store.php

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

$file = 'data/stores.csv';
$header = ['id_store', 'name_store', 'address'];

// proses simpan data baru jika POST
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name_store'] ?? '');
    $address = trim($_POST['address'] ?? '');
    if($name && $address) {
        $stores = readCsv($file);
        $newId = count($stores) ? (max(array_column($stores, 'id_store')) + 1) : 1;
        $stores[] = [
            'id_store' => $newId,
            'name_store' => $name,
            'address' => $address
        ];
        writeCsv($file, $stores, $header);
        header("Location: store.php"); exit;
    }
}

$stores = readCsv($file);
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Toko - Expense Receipt Generator by Febro Herdyanto</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f0f2f5;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 700px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        h1, h2 {
            text-align: center;
            color: #333;
        }
        form {
            margin-bottom: 30px;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: space-between;
        }
        label {
            flex: 1 1 100%;
        }
        input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button.btn {
            padding: 12px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s ease;
            margin-top: 10px;
        }
        button.btn:hover {
            background-color: #0056b3;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #007bff;
            color: white;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .credit {
            text-align: center;
            margin-top: 40px;
            font-size: 0.9em;
            color: #777;
        }

        @media (max-width: 600px) {
            form {
                flex-direction: column;
            }
            label {
                flex: 1 1 auto;
            }
        }
    </style>
</head>
<body>
    <div class="container">
      <p><a href="index.php">← Kembali ke Menu Utama</a></p>
        <h1>Data Toko</h1>
        <form method="post" action="store.php">
            <label>
                Nama Toko:
                <input type="text" name="name_store" required>
            </label>
            <label>
                Alamat:
                <input type="text" name="address" required>
            </label>
            <button type="submit" class="btn">Tambah Toko</button>
        </form>

        <h2>Daftar Toko</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th><th>Nama Toko</th><th>Alamat</th>
                </tr>
            </thead>
            <tbody>
                <?php if(empty($stores)): ?>
                <tr><td colspan="3" style="text-align:center;">Belum ada data toko</td></tr>
                <?php else: ?>
                    <?php foreach($stores as $store): ?>
                    <tr>
                        <td><?= htmlspecialchars($store['id_store']) ?></td>
                        <td><?= htmlspecialchars($store['name_store']) ?></td>
                        <td><?= htmlspecialchars($store['address']) ?></td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>

        

        <div class="credit">by Febro Herdyanto</div>
    </div>
</body>
</html>
