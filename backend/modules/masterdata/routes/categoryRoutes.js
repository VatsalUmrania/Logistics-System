const express = require('express');
const router = express.Router();
const controller = require('../controllers/categories.controller');

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:sino', controller.getOne);
router.put('/:sino', controller.update);
router.delete('/:sino', controller.remove);

module.exports = router;