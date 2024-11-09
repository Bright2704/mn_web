// routes/lotRoutes.js
const express = require('express');
const router = express.Router();
const LotController = require('../controllers/LotController');

router.get('/', LotController.getAllLots);
router.post('/', LotController.createLot);
router.put('/:id', LotController.updateLot);
router.delete('/:id', LotController.deleteLot);

module.exports = router;
