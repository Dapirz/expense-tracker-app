const express = require('express');
const cors = require('cors');
const path = require('path');

const transaksiRoutes = require('./routes/transaksiRoutes');
const akunRoutes = require('./routes/akunRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/transaksi', transaksiRoutes);
app.use('/api/akun', akunRoutes);
app.use('/api/kategori', kategoriRoutes);

app.listen(PORT, () => {
    console.log(`=== SERVER HTTP BACKEND RUNNING ===`);
    console.log(`Berjalan lancar di http://localhost:${PORT}`);
});