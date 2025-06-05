const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth.middleware');
const {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
} = require('../controllers/inventory.controller');

router.get('/', authMiddleware, getAllItems);
router.get('/:id', authMiddleware, getItemById);
router.post('/', authMiddleware, authorizeRoles('admin', 'manager'), createItem);
router.put('/:id', authMiddleware, authorizeRoles('admin', 'manager'), updateItem);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), deleteItem);

module.exports = router;