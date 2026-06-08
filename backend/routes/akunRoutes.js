const express = require('express');
const router = express.Router();
const { getAllAkun, getAkunById, createAkun, updateAkun, deleteAkun } = require('../controllers/akunController');

router.get('/', getAllAkun);
router.get('/:id', getAkunById);
router.post('/', createAkun);
router.put('/:id', updateAkun);
router.delete('/:id', deleteAkun);

module.exports = router;
