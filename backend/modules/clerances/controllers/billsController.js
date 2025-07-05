const Bills = require('../models/bills');

// Create a new bill
exports.create = async (req, res) => {
  try {
    console.log('Creating bill with data:', req.body);
    
    // Validate required fields
    const { operation_id } = req.body;
    if (!operation_id) {
      return res.status(400).json({ 
        error: 'Operation ID is required' 
      });
    }

    const newBill = await Bills.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: newBill
    });
  } catch (err) {
    console.error('Bill creation error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error creating bill', 
      details: err.message 
    });
  }
};

// Get all bills
exports.getAll = async (req, res) => {
  try {
    const bills = await Bills.getAll();
    
    res.status(200).json({
      success: true,
      data: bills,
      count: bills.length
    });
  } catch (err) {
    console.error('Error fetching bills:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error fetching bills', 
      details: err.message 
    });
  }
};

// Get bill by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bills.getById(id);
    
    if (!bill) {
      return res.status(404).json({ 
        success: false,
        error: 'Bill not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: bill
    });
  } catch (err) {
    console.error('Error fetching bill:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error fetching bill', 
      details: err.message 
    });
  }
};

// Get bills by operation ID
exports.getByOperationId = async (req, res) => {
  try {
    const { operation_id } = req.params;
    const bills = await Bills.getByOperationId(operation_id);
    
    res.status(200).json({
      success: true,
      data: bills,
      count: bills.length
    });
  } catch (err) {
    console.error('Error fetching bills by operation ID:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error fetching bills by operation ID', 
      details: err.message 
    });
  }
};

// Update a bill
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Updating bill ID:', id, 'with data:', req.body);
    
    const updatedBill = await Bills.update(id, req.body);
    
    if (!updatedBill) {
      return res.status(404).json({ 
        success: false,
        error: 'Bill not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Bill updated successfully',
      data: updatedBill
    });
  } catch (err) {
    console.error('Error updating bill:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error updating bill', 
      details: err.message 
    });
  }
};

// Delete a bill
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Bills.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        error: 'Bill not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Bill deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting bill:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error deleting bill', 
      details: err.message 
    });
  }
};

// Delete bills by operation ID
exports.deleteByOperationId = async (req, res) => {
  try {
    const { operation_id } = req.params;
    const deletedCount = await Bills.deleteByOperationId(operation_id);
    
    res.status(200).json({
      success: true,
      message: `${deletedCount} bills deleted successfully`,
      deletedCount
    });
  } catch (err) {
    console.error('Error deleting bills by operation ID:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error deleting bills by operation ID', 
      details: err.message 
    });
  }
};
