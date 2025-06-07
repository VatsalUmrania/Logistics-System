const portModel = require('../models/polModel');

// Create a new port (POL)
exports.createPol = async (req, res) => {
  try {
    const PortId = await portModel.createPol(req.body);
    res.status(201).json({ id: PortId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all ports (POLs)
exports.getPol = async (req, res) => {
  try {
    const ports = await portModel.getPol();
    res.json(ports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an existing port (POL) by ID
exports.updatePol = async (req, res) => {
  try {
    const updated = await portModel.updatePol(req.params.id, req.body);
    if (updated) {
      res.status(200).json({ message: 'Port updated successfully' });
    } else {
      res.status(404).json({ message: 'Port not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a port (POL) by ID
exports.deletePol = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Received delete request for port ID: ${id}`);  // Log the incoming ID
    const result = await model.deletePol(id);

    if (!result) {
      console.log(`Port with ID: ${id} not found`);  // Log if deletion fails
      return res.status(404).json({ error: 'Port not found or already deleted' });
    }

    console.log(`Port with ID: ${id} deleted successfully`);  // Log successful deletion
    res.json({ message: 'Port deleted successfully', id });
  } catch (err) {
    console.error("Error during deletion:", err);  // Log the error
    res.status(500).json({ error: err.message });
  }
};


