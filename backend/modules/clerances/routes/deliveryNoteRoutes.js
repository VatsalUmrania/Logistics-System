const express = require('express');
const router = express.Router();
const deliveryNoteController = require('../controllers/deliveryNoteController');

// Main CRUD routes
router.get('/', deliveryNoteController.getAllDeliveryNotes);
router.get('/next-dn', deliveryNoteController.getNextDeliveryNoteNumber); // Add this line
router.get('/:id', deliveryNoteController.getDeliveryNoteById);
router.post('/', deliveryNoteController.createDeliveryNote);
router.put('/:id', deliveryNoteController.updateDeliveryNote);
router.delete('/:id', deliveryNoteController.deleteDeliveryNote);

// Additional filtering routes
router.get('/client/:client_name', deliveryNoteController.getDeliveryNotesByClient);

module.exports = router;
