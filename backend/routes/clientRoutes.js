const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/', clientController.createClient);
router.get('/', clientController.getClient);

router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);
module.exports = router;
