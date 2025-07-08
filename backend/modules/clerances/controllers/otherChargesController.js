const otherChargesModel = require('../models/otherChargesModel');

exports.getAllOtherCharges = async (req, res) => {
  try {
    const { operation_no, client_name } = req.query;
    let charges;

    if (operation_no) {
      charges = await otherChargesModel.getOtherChargesByOperationNo(operation_no);
    } else if (client_name) {
      charges = await otherChargesModel.getOtherChargesByClient(client_name);
    } else {
      charges = await otherChargesModel.getAllOtherCharges();
    }

    res.json(charges);
  } catch (err) {
    console.error('Error fetching other charges:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getOtherChargeById = async (req, res) => {
  try {
    const charge = await otherChargesModel.getOtherChargeById(req.params.id);
    if (charge) {
      res.json(charge);
    } else {
      res.status(404).json({ error: 'Other charge not found' });
    }
  } catch (err) {
    console.error('Error fetching other charge by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createOtherCharge = async (req, res) => {
  try {
    // Validate required fields
    const { client_name, charge_description, charge_amount, total_amount, date_assigned } = req.body;
    
    if (!client_name || !charge_description || !charge_amount || !total_amount || !date_assigned) {
      return res.status(400).json({
        error: 'Missing required fields: client_name, charge_description, charge_amount, total_amount, date_assigned'
      });
    }

    // Validate numeric fields
    if (isNaN(parseFloat(charge_amount)) || parseFloat(charge_amount) <= 0) {
      return res.status(400).json({ error: 'charge_amount must be a positive number' });
    }

    if (isNaN(parseFloat(total_amount)) || parseFloat(total_amount) <= 0) {
      return res.status(400).json({ error: 'total_amount must be a positive number' });
    }

    if (req.body.vat_percent && (isNaN(parseFloat(req.body.vat_percent)) || parseFloat(req.body.vat_percent) < 0)) {
      return res.status(400).json({ error: 'vat_percent must be a non-negative number' });
    }

    const newCharge = await otherChargesModel.createOtherCharge(req.body);
    res.status(201).json({
      success: true,
      message: 'Other charge created successfully',
      data: newCharge
    });
  } catch (err) {
    console.error('Error creating other charge:', err);
    if (err.message.includes('Invalid operation number') || err.message.includes('Missing required fields')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.updateOtherCharge = async (req, res) => {
  try {
    // Validate required fields
    const { client_name, charge_description, charge_amount, total_amount, date_assigned } = req.body;
    
    if (!client_name || !charge_description || !charge_amount || !total_amount || !date_assigned) {
      return res.status(400).json({
        error: 'Missing required fields: client_name, charge_description, charge_amount, total_amount, date_assigned'
      });
    }

    // Validate numeric fields
    if (isNaN(parseFloat(charge_amount)) || parseFloat(charge_amount) <= 0) {
      return res.status(400).json({ error: 'charge_amount must be a positive number' });
    }

    if (isNaN(parseFloat(total_amount)) || parseFloat(total_amount) <= 0) {
      return res.status(400).json({ error: 'total_amount must be a positive number' });
    }

    if (req.body.vat_percent && (isNaN(parseFloat(req.body.vat_percent)) || parseFloat(req.body.vat_percent) < 0)) {
      return res.status(400).json({ error: 'vat_percent must be a non-negative number' });
    }

    const updatedCharge = await otherChargesModel.updateOtherCharge(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Other charge updated successfully',
      data: updatedCharge
    });
  } catch (err) {
    console.error('Error updating other charge:', err);
    if (err.message.includes('not found') || err.message.includes('Invalid')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.deleteOtherCharge = async (req, res) => {
  try {
    await otherChargesModel.deleteOtherCharge(req.params.id);
    res.json({
      success: true,
      message: 'Other charge deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting other charge:', err);
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Additional endpoints for filtering
exports.getOtherChargesByOperation = async (req, res) => {
  try {
    const charges = await otherChargesModel.getOtherChargesByOperationNo(req.params.operation_no);
    res.json(charges);
  } catch (err) {
    console.error('Error fetching other charges by operation:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getOtherChargesByClient = async (req, res) => {
  try {
    const charges = await otherChargesModel.getOtherChargesByClient(req.params.client_name);
    res.json(charges);
  } catch (err) {
    console.error('Error fetching other charges by client:', err);
    res.status(500).json({ error: err.message });
  }
};
