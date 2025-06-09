// File: routes/userRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.post('/', controller.createUser);
router.get('/', controller.getUser);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);
router.post('/login', controller.loginUser);

module.exports = router;
