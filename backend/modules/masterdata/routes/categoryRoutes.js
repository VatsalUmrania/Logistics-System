const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

// Create a new category
router.post('/', categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getCategory);

// Get a category by ID
router.get('/:id', categoryController.getCategoryById);

// Update a category by ID
router.put('/:id', categoryController.updateCategory);

// Delete a category by ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
