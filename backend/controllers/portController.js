const portModel = require('../models/portModel');

exports.createPort = async (req, res) => {
  try {
    const PortId = await portModel.createPort(req.body);
    res.status(201).json({ id: PortId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPort = async (req, res) => {
  try {
    const ports = await portModel.getPort();
    res.json(ports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};