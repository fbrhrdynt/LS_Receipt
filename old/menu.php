<?php
// menu.php

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

$file = 'data/item_menu.csv';
$header = ['id_menu', 'name_menu', 'price'];
$menus = readCsv($file);

// Tambah menu
if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['name_menu'], $_POST['price']) && empty($_POST['edit_id'])) {
    $name = trim($_POST['name_menu']);
    $price = trim($_POST['price']);
    if($name && is_numeric($price)) {
        $newId = count($menus) ? (max(array_column($menus, 'id_menu')) + 1) : 1;
        $menus[] = [
            'id_menu' => $newId,
            'name_menu' => $name,
            'price' => $price
        ];
        writeCsv($file, $menus, $header);
        header("Location: menu.php"); exit;
    }
}

// Hapus menu
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_id'])) {
    $deleteId = $_POST['delete_id'];
    $menus = array_filter($menus, function($menu) use ($deleteId) {
        return $menu['id_menu'] != $deleteId;
    });
    writeCsv($file, $menus, $header);
    header("Location: menu.php"); exit;
}

// Edit menu (proses update)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['edit_id'])) {
    $editId = $_POST['edit_id'];
    $newName = trim($_POST['name_menu']);
    $newPrice = trim($_POST['price']);
    foreach ($menus as &$menu) {
        if ($menu['id_menu'] == $editId) {
            $menu['name_menu'] = $newName;
            $menu['price'] = $newPrice;
            break;
        }
    }
    writeCsv($file, $menus, $header);
    header("Location: menu.php"); exit;
}

// Tangkap data untuk pre-fill form edit
$editing = false;
$editData = ['id_menu' => '', 'name_menu' => '', 'price' => ''];
if (isset($_GET['edit'])) {
    $editing = true;
    foreach ($menus as $menu) {
        if ($menu['id_menu'] == $_GET['edit']) {
            $editData = $menu;
            break;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Menu - Expense Receipt Generator by Febro Herdyanto</title>
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
        input[type="text"], input[type="number"], input[type="search"] {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button.btn {
            padding: 10px 16px;
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
        .btn-danger {
            background-color: #dc3545;
        }
        .btn-danger:hover {
            background-color: #b52a3c;
        }
        .btn-warning {
            background-color: #ffc107;
            color: black;
        }
        .btn-warning:hover {
            background-color: #e0a800;
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
        <h1><?= $editing ? "Edit Menu" : "Data Menu Makanan/Minuman" ?></h1>

        <form method="post" action="menu.php">
            <label>
                Nama Menu:
                <input type="text" name="name_menu" value="<?= htmlspecialchars($editData['name_menu']) ?>" required>
            </label>
            <label>
                Harga (angka):
                <input type="number" name="price" min="0" value="<?= htmlspecialchars($editData['price']) ?>" required>
            </label>
            <?php if ($editing): ?>
                <input type="hidden" name="edit_id" value="<?= htmlspecialchars($editData['id_menu']) ?>">
                <button type="submit" class="btn btn-warning">Simpan Perubahan</button>
                <a href="menu.php" class="btn" style="margin-left: 10px;">Batal</a>
            <?php else: ?>
                <button type="submit" class="btn">Tambah Menu</button>
            <?php endif; ?>
        </form>

        <label for="search">Cari Menu:</label>
        <input type="search" id="search" placeholder="Ketik nama menu...">

        <h2>Daftar Menu</h2>
        <table id="menuTable">
            <thead>
                <tr>
                    <th>ID</th><th>Nama Menu</th><th>Harga</th><th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php if(empty($menus)): ?>
                <tr><td colspan="4" style="text-align:center;">Belum ada data menu</td></tr>
                <?php else: ?>
                    <?php foreach($menus as $menu): ?>
                    <tr>
                        <td><?= htmlspecialchars($menu['id_menu']) ?></td>
                        <td><?= htmlspecialchars($menu['name_menu']) ?></td>
                        <td><?= number_format($menu['price'], 0, ',', '.') ?></td>
                        <td>
                            <a href="menu.php?edit=<?= $menu['id_menu'] ?>">
    <button type="button" class="btn" style="background-color:#ffc107; color:#000; font-weight:bold;">Edit</button>
</a>
<form method="post" action="menu.php" onsubmit="return confirm('Yakin ingin menghapus menu ini?');" style="display:inline;">
    <input type="hidden" name="delete_id" value="<?= htmlspecialchars($menu['id_menu']) ?>">
    <button type="submit" class="btn" style="background-color:#dc3545; color:#fff; font-weight:bold;">Hapus</button>
</form>

                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>

        <div class="credit">by Febro Herdyanto</div>
    </div>

    <script>
        // Realtime search
        const searchInput = document.getElementById('search');
        const tableRows = document.querySelectorAll('#menuTable tbody tr');

        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase();
            tableRows.forEach(row => {
                const name = row.children[1].textContent.toLowerCase();
                row.style.display = name.includes(query) ? '' : 'none';
            });
        });
    </script>
</body>
</html>
