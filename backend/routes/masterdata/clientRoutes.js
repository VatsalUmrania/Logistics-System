const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/', clientController.createClient);
router.get('/', clientController.getClient);

router.put('/:client_id', clientController.updateClient);
router.delete('/:client_id', clientController.deleteClient);
module.exports = router;
