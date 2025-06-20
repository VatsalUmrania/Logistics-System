const db = require('../../../config/db');
const { Op } = require('sequelize');

exports.createOperation = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { operation, containers, bills } = req.body;
    
    // Create operation
    const newOperation = await db.Operation.create(operation, { transaction });
    
    // Create containers
    const containerPromises = containers.map(container => 
      db.Container.create({ ...container, operationId: newOperation.id }, { transaction })
    );
    
    // Create bills
    const billPromises = bills.map(bill => 
      db.Bill.create({ ...bill, operationId: newOperation.id }, { transaction })
    );
    
    await Promise.all([...containerPromises, ...billPromises]);
    await transaction.commit();
    
    // Fetch full operation with associations
    const fullOperation = await db.Operation.findByPk(newOperation.id, {
      include: [
        { model: db.Container, as: 'containers' },
        { model: db.Bill, as: 'bills' }
      ]
    });
    
    res.status(201).json({
      success: true,
      data: fullOperation
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to create operation',
      error: error.message
    });
  }
};

exports.getOperations = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'client', sortOrder = 'ASC' } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (search) {
      where[Op.or] = [
        { client: { [Op.like]: `%${search}%` } },
        { jobNo: { [Op.like]: `%${search}%` } },
        { operationType: { [Op.like]: `%${search}%` } },
        { transportMode: { [Op.like]: `%${search}%` } },
        { vessel: { [Op.like]: `%${search}%` } },
        { pol: { [Op.like]: `%${search}%` } },
        { status: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const { count, rows } = await db.Operation.findAndCountAll({
      where,
      include: [
        { model: db.Container, as: 'containers' },
        { model: db.Bill, as: 'bills' }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch operations',
      error: error.message
    });
  }
};

exports.getOperationById = async (req, res) => {
  try {
    const operation = await db.Operation.findByPk(req.params.id, {
      include: [
        { model: db.Container, as: 'containers' },
        { model: db.Bill, as: 'bills' }
      ]
    });
    
    if (!operation) {
      return res.status(404).json({
        success: false,
        message: 'Operation not found'
      });
    }
    
    res.json({
      success: true,
      data: operation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch operation',
      error: error.message
    });
  }
};

exports.updateOperation = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { operation, containers, bills } = req.body;
    
    // Update operation
    await db.Operation.update(operation, {
      where: { id: req.params.id },
      transaction
    });
    
    // Delete existing containers and bills
    await db.Container.destroy({ 
      where: { operationId: req.params.id },
      transaction
    });
    
    await db.Bill.destroy({ 
      where: { operationId: req.params.id },
      transaction
    });
    
    // Create new containers
    const containerPromises = containers.map(container => 
      db.Container.create({ ...container, operationId: req.params.id }, { transaction })
    );
    
    // Create new bills
    const billPromises = bills.map(bill => 
      db.Bill.create({ ...bill, operationId: req.params.id }, { transaction })
    );
    
    await Promise.all([...containerPromises, ...billPromises]);
    await transaction.commit();
    
    // Fetch updated operation
    const updatedOperation = await db.Operation.findByPk(req.params.id, {
      include: [
        { model: db.Container, as: 'containers' },
        { model: db.Bill, as: 'bills' }
      ]
    });
    
    res.json({
      success: true,
      data: updatedOperation
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to update operation',
      error: error.message
    });
  }
};

exports.deleteOperation = async (req, res) => {
  try {
    const deleted = await db.Operation.destroy({
      where: { id: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Operation not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Operation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete operation',
      error: error.message
    });
  }
};