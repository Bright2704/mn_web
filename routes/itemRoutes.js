// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/ItemController');

router.get('/status/:status', ItemController.getItemsByStatus);
router.put('/:id/status', ItemController.updateItemStatus);
router.post('/', ItemController.createItem);
router.delete('/:id', ItemController.deleteItem);

module.exports = router;
