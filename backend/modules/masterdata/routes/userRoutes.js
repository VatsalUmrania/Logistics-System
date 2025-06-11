const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

// User Routes
router.post('/', controller.createUser); // Create a new user
router.get('/', controller.getUser); // Get all users
router.put('/:id', controller.updateUser); // Update a user by ID
router.delete('/:id', controller.deleteUser); // Delete a user by ID
router.post('/login', controller.loginUser); // User login

// Add the logout route here
router.post('/logout', controller.logoutUser); // User logout

module.exports = router;
