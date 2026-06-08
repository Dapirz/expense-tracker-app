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

// 1. GET ALL KATEGORI (Read)
const getAllKategori = async (req, res) => {
    try {
        const db = await readDatabase();
        res.status(200).json(db.kategori);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data kategori", error: error.message });
    }
};

// 2. GET KATEGORI BY ID (Read)
const getKategoriById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDatabase();

        const kategori = db.kategori.find(k => k.id === Number(id));
        if (!kategori) {
            return res.status(404).json({ message: "Kategori tidak ditemukan!" });
        }

        res.status(200).json(kategori);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data kategori", error: error.message });
    }
};

// 3. CREATE KATEGORI (Create)
const createKategori = async (req, res) => {
    try {
        const { nama, jenis, icon } = req.body;

        if (!nama || !jenis) {
            return res.status(400).json({ message: "Field nama dan jenis wajib diisi!" });
        }

        const jenisLower = jenis.toLowerCase();
        if (jenisLower !== 'pemasukan' && jenisLower !== 'pengeluaran') {
            return res.status(400).json({ message: "Jenis kategori harus 'pemasukan' atau 'pengeluaran'!" });
        }

        const db = await readDatabase();

        const newId = db.kategori.length > 0
            ? Math.max(...db.kategori.map(k => k.id)) + 1
            : 1;

        const newKategori = {
            id: newId,
            nama,
            jenis: jenisLower,
            icon: icon || '🏷️'
        };

        db.kategori.push(newKategori);

        await writeDatabase(db);

        res.status(201).json({ message: "Kategori berhasil ditambahkan", data: newKategori });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambahkan kategori", error: error.message });
    }
};

// 4. UPDATE KATEGORI (Update)
const updateKategori = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, jenis, icon } = req.body;

        const db = await readDatabase();

        const kategoriIndex = db.kategori.findIndex(k => k.id === Number(id));
        if (kategoriIndex === -1) {
            return res.status(404).json({ message: "Kategori tidak ditemukan!" });
        }

        const oldKategori = db.kategori[kategoriIndex];

        const newNama = nama !== undefined ? nama : oldKategori.nama;
        let newJenis = jenis !== undefined ? jenis.toLowerCase() : oldKategori.jenis;
        const newIcon = icon !== undefined ? icon : (oldKategori.icon || '🏷️');

        if (jenis !== undefined && newJenis !== 'pemasukan' && newJenis !== 'pengeluaran') {
            return res.status(400).json({ message: "Jenis kategori harus 'pemasukan' atau 'pengeluaran'!" });
        }

        db.kategori[kategoriIndex] = {
            id: Number(id),
            nama: newNama,
            jenis: newJenis,
            icon: newIcon
        };

        await writeDatabase(db);

        res.status(200).json({ message: "Kategori berhasil diperbarui", data: db.kategori[kategoriIndex] });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui kategori", error: error.message });
    }
};

// 5. DELETE KATEGORI (Delete)
const deleteKategori = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDatabase();

        const kategoriIndex = db.kategori.findIndex(k => k.id === Number(id));
        if (kategoriIndex === -1) {
            return res.status(404).json({ message: "Kategori tidak ditemukan!" });
        }

        // Cek apakah kategori masih digunakan oleh transaksi
        const transaksiTerkait = db.transaksi.find(t => t.kategori_id === Number(id));
        if (transaksiTerkait) {
            return res.status(400).json({ message: "Kategori tidak bisa dihapus karena masih digunakan oleh transaksi!" });
        }

        db.kategori.splice(kategoriIndex, 1);

        await writeDatabase(db);

        res.status(200).json({ message: "Kategori berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus kategori", error: error.message });
    }
};

module.exports = {
    getAllKategori,
    getKategoriById,
    createKategori,
    updateKategori,
    deleteKategori
};
