const vesselModel = require('../models/vesselModel');

exports.createVessel = async (req, res) => {
  try {
    const bankId = await vesselModel.createVessel(req.body);
    res.status(201).json({ id: bankId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVessel = async (req, res) => {
  try {
    const banks = await vesselModel.getVessel();
    res.json(banks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};