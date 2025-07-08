const receiptModel = require('../models/receiptModel');

exports.getAllReceipts = async (req, res) => {
  try {
    const filters = {
      receipt_no: req.query.receipt_no,
      client_name: req.query.client_name,
      operation_no: req.query.operation_no,
      status: req.query.status
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });

    const receipts = await receiptModel.getAllReceipts(filters);
    res.json(receipts);
  } catch (err) {
    console.error('Error fetching receipts:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getReceiptById = async (req, res) => {
  try {
    const receipt = await receiptModel.getReceiptById(req.params.id);
    if (receipt) {
      res.json(receipt);
    } else {
      res.status(404).json({ error: 'Receipt not found' });
    }
  } catch (err) {
    console.error('Error fetching receipt by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createReceipt = async (req, res) => {
  try {
    // Validate required fields
    const { receipt_no, client_name, amount, issue_date } = req.body;
    
    if (!receipt_no || !client_name || !amount || !issue_date) {
      return res.status(400).json({
        error: 'Missing required fields: receipt_no, client_name, amount, issue_date'
      });
    }

    // Validate amount
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const newReceipt = await receiptModel.createReceipt(req.body);
    res.status(201).json({
      success: true,
      message: 'Receipt created successfully',
      data: newReceipt
    });
  } catch (err) {
    console.error('Error creating receipt:', err);
    if (err.message.includes('already exists') || err.message.includes('Missing required fields')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.updateReceipt = async (req, res) => {
  try {
    // Validate required fields
    const { receipt_no, client_name, amount, issue_date } = req.body;
    
    if (!receipt_no || !client_name || !amount || !issue_date) {
      return res.status(400).json({
        error: 'Missing required fields: receipt_no, client_name, amount, issue_date'
      });
    }

    // Validate amount
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const updatedReceipt = await receiptModel.updateReceipt(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Receipt updated successfully',
      data: updatedReceipt
    });
  } catch (err) {
    console.error('Error updating receipt:', err);
    if (err.message.includes('not found') || err.message.includes('already exists')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.cancelReceipt = async (req, res) => {
  try {
    const { reason, cancellation_date, cancelled_by } = req.body;
    
    if (!reason || !cancellation_date) {
      return res.status(400).json({
        error: 'Missing required fields: reason, cancellation_date'
      });
    }

    if (reason.length < 10) {
      return res.status(400).json({
        error: 'Cancellation reason must be at least 10 characters long'
      });
    }

    const cancellationData = {
      reason,
      cancellation_date,
      cancelled_by: cancelled_by || req.user?.name || 'System'
    };

    const result = await receiptModel.cancelReceipt(req.params.id, cancellationData);
    res.json({
      success: true,
      message: 'Receipt cancelled successfully',
      data: result
    });
  } catch (err) {
    console.error('Error cancelling receipt:', err);
    if (err.message.includes('not found') || err.message.includes('already cancelled')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.deleteReceipt = async (req, res) => {
  try {
    await receiptModel.deleteReceipt(req.params.id);
    res.json({
      success: true,
      message: 'Receipt deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting receipt:', err);
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.getNextReceiptNumber = async (req, res) => {
  try {
    const nextReceiptNo = await receiptModel.getNextReceiptNumber();
    res.json({ nextReceiptNumber: nextReceiptNo });
  } catch (err) {
    console.error('Error getting next receipt number:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCancellationHistory = async (req, res) => {
  try {
    const history = await receiptModel.getCancellationHistory(req.params.id);
    res.json(history);
  } catch (err) {
    console.error('Error fetching cancellation history:', err);
    res.status(500).json({ error: err.message });
  }
};
