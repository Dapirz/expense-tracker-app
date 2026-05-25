const express = require('express');
const router = express.Router();
const { getAllTransaksi, createTransaksi, updateTransaksi, deleteTransaksi } = require('../controllers/transaksiController');

router.get('/', getAllTransaksi);
router.post('/', createTransaksi);
router.put('/:id', updateTransaksi);
router.delete('/:id', deleteTransaksi);

module.exports = router;