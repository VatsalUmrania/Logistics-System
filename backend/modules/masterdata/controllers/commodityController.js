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

exports.updateCommodity = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await commodityModel.updateCommodity(id, req.body);  // fix here
    if (!updated) return res.status(404).json({ error: 'Commodity not found' });
    res.json({ id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCommodity = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await commodityModel.deleteCommodity(id);  // fix here
    if (!deleted) return res.status(404).json({ error: 'Commodity not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

