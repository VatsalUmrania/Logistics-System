const categoryModel = require('../models/categoryModel');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { code, name } = req.body;
    const cat_id = await categoryModel.createCategory(code, name);
    res.status(201).json({ id: cat_id, code, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all categories
// In your category controller (e.g., `categoryController.js`)
exports.getCategory = async (req, res) => {
  try {
    const categories = await categoryModel.getCategory();  // Fetch categories from DB
    res.json(categories);  // Return categories as a JSON response
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// Get a category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await categoryModel.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a category
// In your category controller (e.g., `categoryController.js`)
exports.updateCategoryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Active', 'Inactive'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const result = await categoryModel.updateStatus(id, status);
    if (result.affectedRows > 0) {
      res.json({ message: 'Status updated successfully' });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const deletedRows = await categoryModel.deleteCategory(req.params.id);
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(204).send(); // No content, successful deletion
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
