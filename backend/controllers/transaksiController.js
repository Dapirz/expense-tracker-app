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

const adjustAccountBalance = (db, akunId, kategoriId, jumlah, type) => {
    const akun = db.akun.find(a => a.id === Number(akunId));
    if (!akun) return;
    
    const kategori = db.kategori.find(k => k.id === Number(kategoriId));
    if (!kategori) return;

    const isExpense = kategori.jenis === 'pengeluaran';

    if (type === 'add') {
        if (isExpense) {
            akun.saldo -= Number(jumlah);
        } else {
            akun.saldo += Number(jumlah);
        }
    } else if (type === 'revert') {
        if (isExpense) {
            akun.saldo += Number(jumlah);
        } else {
            akun.saldo -= Number(jumlah);
        }
    }
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

        const numericJumlah = Number(jumlah);
        if (numericJumlah <= 0) {
            return res.status(400).json({ message: "Jumlah transaksi harus lebih besar dari 0!" });
        }

        const db = await readDatabase();

        const akun = db.akun.find(a => a.id === Number(akun_id));
        if (!akun) {
            return res.status(404).json({ message: "Akun tidak ditemukan!" });
        }

        const kategori = db.kategori.find(k => k.id === Number(kategori_id));
        if (!kategori) {
            return res.status(404).json({ message: "Kategori tidak ditemukan!" });
        }

        const newId = db.transaksi.length > 0
            ? Math.max(...db.transaksi.map(t => t.id)) + 1
            : 1;

        const newTransaksi = {
            id: newId,
            akun_id: Number(akun_id),
            kategori_id: Number(kategori_id),
            jumlah: numericJumlah,
            tanggal,
            catatan: catatan || ""
        };

        // Adjust account balance
        adjustAccountBalance(db, akun_id, kategori_id, numericJumlah, 'add');

        db.transaksi.push(newTransaksi);

        await writeDatabase(db);

        res.status(201).json({ message: "Transaksi berhasil ditambahkan", data: newTransaksi });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambahkan transaksi", error: error.message });
    }
};

// 3. UPDATE TRANSAKSI (Update)
const updateTransaksi = async (req, res) => {
    try {
        const { id } = req.params;
        const { akun_id, kategori_id, jumlah, tanggal, catatan } = req.body;

        const db = await readDatabase();

        const trxIndex = db.transaksi.findIndex(t => t.id === Number(id));
        if (trxIndex === -1) {
            return res.status(404).json({ message: "Transaksi tidak ditemukan!" });
        }

        const oldTrx = db.transaksi[trxIndex];

        const newAkunId = akun_id !== undefined ? Number(akun_id) : oldTrx.akun_id;
        const newKategoriId = kategori_id !== undefined ? Number(kategori_id) : oldTrx.kategori_id;
        const newJumlah = jumlah !== undefined ? Number(jumlah) : oldTrx.jumlah;
        const newTanggal = tanggal !== undefined ? tanggal : oldTrx.tanggal;
        const newCatatan = catatan !== undefined ? catatan : oldTrx.catatan;

        if (newJumlah <= 0) {
            return res.status(400).json({ message: "Jumlah transaksi harus lebih besar dari 0!" });
        }

        const newAkun = db.akun.find(a => a.id === newAkunId);
        if (!newAkun) {
            return res.status(404).json({ message: "Akun baru tidak ditemukan!" });
        }

        const newKategori = db.kategori.find(k => k.id === newKategoriId);
        if (!newKategori) {
            return res.status(404).json({ message: "Kategori baru tidak ditemukan!" });
        }

        // Revert old transaction balance impact
        adjustAccountBalance(db, oldTrx.akun_id, oldTrx.kategori_id, oldTrx.jumlah, 'revert');

        // Apply new transaction balance impact
        adjustAccountBalance(db, newAkunId, newKategoriId, newJumlah, 'add');

        db.transaksi[trxIndex] = {
            id: Number(id),
            akun_id: newAkunId,
            kategori_id: newKategoriId,
            jumlah: newJumlah,
            tanggal: newTanggal,
            catatan: newCatatan
        };

        await writeDatabase(db);

        res.status(200).json({ message: "Transaksi berhasil diperbarui", data: db.transaksi[trxIndex] });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui transaksi", error: error.message });
    }
};

// 4. DELETE TRANSAKSI (Delete)
const deleteTransaksi = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDatabase();

        const trxIndex = db.transaksi.findIndex(t => t.id === Number(id));
        if (trxIndex === -1) {
            return res.status(404).json({ message: "Transaksi tidak ditemukan!" });
        }

        const trx = db.transaksi[trxIndex];

        // Revert account balance impact
        adjustAccountBalance(db, trx.akun_id, trx.kategori_id, trx.jumlah, 'revert');

        db.transaksi.splice(trxIndex, 1);

        await writeDatabase(db);

        res.status(200).json({ message: "Transaksi berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus transaksi", error: error.message });
    }
};

module.exports = {
    getAllTransaksi,
    createTransaksi,
    updateTransaksi,
    deleteTransaksi
};