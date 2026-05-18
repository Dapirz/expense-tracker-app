const express = require('express');
const router = express.Router();
const { getAllTransaksi, createTransaksi } = require('../controllers/transaksiController');

router.get('/', getAllTransaksi);

router.post('/', createTransaksi);

module.exports = router;