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

// 1. GET ALL AKUN (Read)
const getAllAkun = async (req, res) => {
    try {
        const db = await readDatabase();
        res.status(200).json(db.akun);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data akun", error: error.message });
    }
};

// 2. GET AKUN BY ID (Read)
const getAkunById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDatabase();

        const akun = db.akun.find(a => a.id === Number(id));
        if (!akun) {
            return res.status(404).json({ message: "Akun tidak ditemukan!" });
        }

        res.status(200).json(akun);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data akun", error: error.message });
    }
};

// 3. CREATE AKUN (Create)
const createAkun = async (req, res) => {
    try {
        const { nama, tipe, institusi, saldo } = req.body;

        if (!nama || !tipe) {
            return res.status(400).json({ message: "Field nama dan tipe wajib diisi!" });
        }

        const db = await readDatabase();

        const newId = db.akun.length > 0
            ? Math.max(...db.akun.map(a => a.id)) + 1
            : 1;

        const newAkun = {
            id: newId,
            nama,
            tipe,
            institusi: institusi || "",
            saldo: Number(saldo) || 0
        };

        db.akun.push(newAkun);

        await writeDatabase(db);

        res.status(201).json({ message: "Akun berhasil ditambahkan", data: newAkun });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambahkan akun", error: error.message });
    }
};

// 4. UPDATE AKUN (Update)
const updateAkun = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, tipe, institusi, saldo } = req.body;

        const db = await readDatabase();

        const akunIndex = db.akun.findIndex(a => a.id === Number(id));
        if (akunIndex === -1) {
            return res.status(404).json({ message: "Akun tidak ditemukan!" });
        }

        const oldAkun = db.akun[akunIndex];

        const newNama = nama !== undefined ? nama : oldAkun.nama;
        const newTipe = tipe !== undefined ? tipe : oldAkun.tipe;
        const newInstitusi = institusi !== undefined ? institusi : oldAkun.institusi;
        const newSaldo = saldo !== undefined ? Number(saldo) : oldAkun.saldo;

        db.akun[akunIndex] = {
            id: Number(id),
            nama: newNama,
            tipe: newTipe,
            institusi: newInstitusi,
            saldo: newSaldo
        };

        await writeDatabase(db);

        res.status(200).json({ message: "Akun berhasil diperbarui", data: db.akun[akunIndex] });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui akun", error: error.message });
    }
};

// 5. DELETE AKUN (Delete)
const deleteAkun = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDatabase();

        const akunIndex = db.akun.findIndex(a => a.id === Number(id));
        if (akunIndex === -1) {
            return res.status(404).json({ message: "Akun tidak ditemukan!" });
        }

        // Cek apakah akun masih digunakan oleh transaksi
        const transaksiTerkait = db.transaksi.find(t => t.akun_id === Number(id));
        if (transaksiTerkait) {
            return res.status(400).json({ message: "Akun tidak bisa dihapus karena masih digunakan oleh transaksi!" });
        }

        db.akun.splice(akunIndex, 1);

        await writeDatabase(db);

        res.status(200).json({ message: "Akun berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus akun", error: error.message });
    }
};

module.exports = {
    getAllAkun,
    getAkunById,
    createAkun,
    updateAkun,
    deleteAkun
};
