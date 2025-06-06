const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');

router.post('/', bankController.createBank);
router.get('/', bankController.getBanks);

// NEW routes for update and delete
router.put('/:id', bankController.updateBank);
router.delete('/:id', bankController.deleteBank);

module.exports = router;
