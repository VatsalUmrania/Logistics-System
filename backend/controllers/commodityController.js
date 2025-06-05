const commodityModel = require('../models/commodityModel');

exports.createCommodity = async (req, res) => {
  try {
    const Comm_id = await commodityModel.createCommodity(req.body);
    res.status(201).json({ id: Comm_id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCommodity = async (req, res) => {
  try {
    const banks = await commodityModel.getCommodity();
    res.json(banks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};