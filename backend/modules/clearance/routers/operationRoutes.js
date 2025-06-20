const express = require('express');
const router = express.Router();
const controller = require('../controllers/operationController');


// CRUD Routes
router.post('/', controller.createOperation);
router.get('/', controller.getOperations);
router.get('/:id', controller.getOperationById);
router.put('/:id', controller.updateOperation);
router.delete('/:id', controller.deleteOperation);

module.exports = router;