const fs = require('fs').promises;
const path = require('path');

const DATABASE_PATH = path.join(__dirname, '..', 'data', 'database.json');

const readDatabase = async () => {
    const data = await fs.readFile(DATABASE_PATH, 'utf-8');
    return JSON.parse(data);
};

const writeDatabase = async (data) => {
    await fs.writeFile(DATABASE_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

// 1. GET ALL TRANSAKSI (Read)
const getAllTransaksi = async (req, res) => {
    try {
        const db = await readDatabase();
        res.status(200).json(db.transaksi);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data transaksi", error: error.message });
    }
};

// 2. CREATE TRANSAKSI (Create)
const createTransaksi = async (req, res) => {
    try {
        const { akun_id, kategori_id, jumlah, tanggal, catatan } = req.body;

        if (!akun_id || !kategori_id || !jumlah || !tanggal) {
            return res.status(400).json({ message: "Field akun_id, kategori_id, jumlah, dan tanggal wajib diisi!" });
        }

        const db = await readDatabase();

        const newId = db.transaksi.length > 0
            ? Math.max(...db.transaksi.map(t => t.id)) + 1
            : 1;

        const newTransaksi = {
            id: newId,
            akun_id: Number(akun_id),
            kategori_id: Number(kategori_id),
            jumlah: Number(jumlah),
            tanggal,
            catatan: catatan || ""
        };

        db.transaksi.push(newTransaksi);

        await writeDatabase(db);

        res.status(201).json({ message: "Transaksi berhasil ditambahkan", data: newTransaksi });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambahkan transaksi", error: error.message });
    }
};

module.exports = {
    getAllTransaksi,
    createTransaksi
};