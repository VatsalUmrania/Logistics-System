const categoryModel = require('../models/categoryModel');

exports.createCategory = async (req, res) => {
  try {
    const cat_id = await categoryModel.createCategory(req.body);
    res.status(201).json({ id: cat_id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const cat = await categoryModel.getCategory();
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};