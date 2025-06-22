// routes/operationsRoutes.js
const express = require('express');
const router = express.Router();
const operationsController = require('../controllers/clearanceOperationsController');

router.get('/', operationsController.getAll);
router.get('/:id', operationsController.getById);
router.post('/', operationsController.create);
router.put('/:id', operationsController.update);
router.delete('/:id', operationsController.delete);

router.patch('/:id/status', operationsController.updateStatus);

module.exports = router;
