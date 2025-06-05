// const express = require('express');
// const router = express.Router();
// const { authMiddleware, authorizeRoles } = require('../middleware/auth.middleware');
// const {
//     getProfile,
//     updateProfile,
//     getAllUsers,
//     getUserById,
//     deleteUser
// } = require('../controllers/users.controller');

// router.get('/profile', authMiddleware, getProfile);
// router.put('/profile', authMiddleware, updateProfile);
// router.get('/', authMiddleware, authorizeRoles('admin'), getAllUsers);
// router.get('/:id', authMiddleware, authorizeRoles('admin'), getUserById);
// router.delete('/:id', authMiddleware, authorizeRoles('admin'), deleteUser);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { 
    getAllUsers, 
    createUser, 
    updateUser, 
    deleteUser 
} = require('../controllers/users.controller');

// Get all users
router.get('/', getAllUsers);

// Create new user
router.post('/', createUser);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

module.exports = router;