// const categoryModel = require('../models/categoryModel');

// exports.createCategory = async (req, res) => {
//   try {
//     const { code, name } = req.body;
//     const cat_id = await categoryModel.createCategory(code, name);
//     res.status(201).json({ sino: cat_id, code, name });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getCategory = async (req, res) => {
//   try {
//     const categories = await categoryModel.getCategory();  // Fetch categories from DB
//     res.json(categories);  // Return categories as a JSON response
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getCategoryById = async (req, res) => {
//   try {
//     const category = await categoryModel.getCategoryById(req.params.sino);
//     if (!category) {
//       return res.status(404).json({ error: 'Category not found' });
//     }
//     res.json(category);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updateCategoryStatus = async (req, res) => {
//   const { sino } = req.params;
//   const { status } = req.body;

//   if (!['Active', 'Inactive'].includes(status)) {
//     return res.status(400).json({ error: 'Invalid status' });
//   }

//   try {
//     const result = await categoryModel.updateStatus(sino, status);
//     if (result.affectedRows > 0) {
//       res.json({ message: 'Status updated successfully' });
//     } else {
//       res.status(404).json({ error: 'Category not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// // Delete a category
// exports.deleteCategory = async (req, res) => {
//   try {
//     const deletedRows = await categoryModel.deleteCategory(req.params.sino);
//     if (deletedRows === 0) {
//       return res.status(404).json({ error: 'Category not found' });
//     }
//     res.status(204).send(); // No content, successful deletion
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


const model = require('../models/categories.model');

// CREATE
exports.create = async (req, res) => {
  try {
    const { code, name, status } = req.body;
    if (!code || !name) {
      return res.status(400).json({ message: "code and name are required" });
    }
    const category = await model.createCategory({ code, name, status });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
exports.getAll = async (req, res) => {
  try {
    const categories = await model.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
exports.getOne = async (req, res) => {
  try {
    const category = await model.getCategoryById(req.params.sino);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const { code, name, status } = req.body;
    if (!code || !name) {
      return res.status(400).json({ message: "code and name are required" });
    }
    const updated = await model.updateCategory(req.params.sino, { code, name, status });
    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const deleted = await model.deleteCategory(req.params.sino);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};