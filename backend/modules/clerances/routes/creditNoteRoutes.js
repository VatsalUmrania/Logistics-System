const express = require('express');
const router = express.Router();
const creditNoteController = require('../controllers/CreditNoteController');

// CRUD Routes
router.get('/', creditNoteController.getAll);
router.get('/:id', creditNoteController.getById);
router.post('/', creditNoteController.create);
router.put('/:id', creditNoteController.update);
router.delete('/:id', creditNoteController.delete);

module.exports = router;
