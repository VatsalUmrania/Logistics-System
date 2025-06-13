const supplierModel = require('../models/supplierModel');

exports.getAllSuppliers = async (req, res) => {
  try {
    const tableExists = await supplierModel.suppliersTableExists();
    if (!tableExists) {
      return res.status(404).json({ 
        message: 'Suppliers table does not exist',
        error: 'Table not found'
      });
    }

    const suppliers = await supplierModel.getAllSuppliers();
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ 
      message: 'Error fetching suppliers', 
      error: error.message,
      code: error.code
    });
  }
};

exports.getSupplier = async (req, res) => {
  try {
    const supplier = await supplierModel.getSupplierById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ message: 'Error fetching supplier', error: error.message });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const newSupplierId = await supplierModel.createSupplier(req.body);
    const newSupplier = await supplierModel.getSupplierById(newSupplierId);
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ message: 'Error creating supplier', error: error.message });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const result = await supplierModel.updateSupplier(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    const updatedSupplier = await supplierModel.getSupplierById(req.params.id);
    res.json(updatedSupplier);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ message: 'Error updating supplier', error: error.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const result = await supplierModel.deleteSupplier(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ message: 'Error deleting supplier', error: error.message });
  }
};