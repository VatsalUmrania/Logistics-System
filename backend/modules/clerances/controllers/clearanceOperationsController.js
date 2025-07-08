// controllers/operationsController.js

const Operations = require('../models//clearanceOperations');

exports.create = async (req, res) => {
  try {
    const newOperation = await Operations.create(req.body);
    res.status(201).json({ message: 'Operation created successfully', operation: newOperation });
  } catch (err) {
    res.status(500).json({ error: 'Error creating operation', details: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const operations = await Operations.getAll();
    res.json(operations);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching operations', details: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const operation = await Operations.getById(req.params.id);
    if (!operation) return res.status(404).json({ error: 'Operation not found' });
    res.json(operation);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching operation', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedOperation = await Operations.update(req.params.id, req.body);
    res.json({ message: 'Operation updated successfully', operation: updatedOperation });
  } catch (err) {
    res.status(500).json({ error: 'Error updating operation', details: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Operations.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting operation', details: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Update status using MySQL model
    const result = await Operations.updateStatus(id, status);

    // Check if operation was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Operation not found' });
    }

    // Fetch and return updated operation
    const updatedOperation = await Operations.getById(id);
    res.json(updatedOperation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllJobNos = async (req, res) => {
  try {
    const jobs = await Operations.getAllJobNo();
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error fetching job numbers:', error.message); // add .message
    console.error(error.stack); // full stack trace
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// Add to controllers/clearanceOperationsController.js

// exports.create = async (req, res) => {
//   try {
//     const { containers, ...operationData } = req.body;
    
//     // Create the operation
//     const newOperation = await Operations.create(operationData);
//     const operationId = newOperation.insertId;
    
//     // Create containers if provided
//     if (containers && containers.length > 0) {
//       await Operations.createContainers(operationId, containers);
//     }
    
//     res.status(201).json({ 
//       message: 'Operation created successfully', 
//       operation: { id: operationId, ...operationData } 
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Error creating operation', details: err.message });
//   }
// };

exports.getById = async (req, res) => {
  try {
    const operation = await Operations.getById(req.params.id);
    if (!operation) return res.status(404).json({ error: 'Operation not found' });
    
    // Get containers for this operation
    const containers = await Operations.getContainersByOperationId(req.params.id);
    
    res.json({ ...operation, containers });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching operation', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { containers, ...operationData } = req.body;
    
    // Update the operation
    const updatedOperation = await Operations.update(req.params.id, operationData);
    
    // Update containers
    if (containers) {
      await Operations.updateContainers(req.params.id, containers);
    }
    
    res.json({ message: 'Operation updated successfully', operation: updatedOperation });
  } catch (err) {
    res.status(500).json({ error: 'Error updating operation', details: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    // Delete containers first (handled by CASCADE, but explicit is better)
    await Operations.deleteContainersByOperationId(req.params.id);
    
    // Delete operation
    await Operations.delete(req.params.id);
    
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting operation', details: err.message });
  }
};

// New endpoint to get containers for an operation
exports.getContainers = async (req, res) => {
  try {
    const containers = await Operations.getContainersByOperationId(req.params.id);
    res.json(containers);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching containers', details: err.message });
  }
};
