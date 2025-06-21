// routes/billsRoutes.js
const express = require('express');
const router = express.Router();
const billsController = require('../controllers/billsController');

router.get('/', billsController.getAll);
router.get('/:id', billsController.getById);
router.get('/operation/:operation_id', billsController.getByOperationId);
router.post('/', billsController.create);
router.put('/:id', billsController.update);
router.delete('/:id', billsController.delete);

module.exports = router;
