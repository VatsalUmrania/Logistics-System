const vesselModel = require('../models/vesselModel');

exports.createVessel = async (req, res) => {
  try {
    const vessId = await vesselModel.createVessel(req.body);
    res.status(201).json({ id: vessId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVessel = async (req, res) => {
  try {
    const vessel = await vesselModel.getVessel();
    res.json(vessel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateVessel = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await vesselModel.updateVessel(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Vessel not found' });
    res.json({ id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteVessel = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await vesselModel.deleteVessel(id);
    if (!deleted) return res.status(404).json({ error: 'Vessel not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
