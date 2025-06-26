const AccountHead = require('../models/AccountHead');
const Joi = require('joi');

// Validation schema
const accountHeadSchema = Joi.object({
  account_type: Joi.string().valid('Asset', 'Liability', 'Equity', 'Revenue', 'Expense').required(),
  account_head: Joi.string().min(1).max(255).required().trim()
});

const accountHeadController = {
  // Get all account heads
  async getAllAccountHeads(req, res) {
    try {
      const {
        search = '',
        sortField = 'account_head',
        sortDirection = 'asc',
        page = 1,
        limit = 10
      } = req.query;

      const result = await AccountHead.getAll(search, sortField, sortDirection, page, limit);
      
      res.status(200).json({
        success: true,
        message: 'Account heads retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error fetching account heads:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch account heads',
        error: error.message
      });
    }
  },

  // Get account head by ID
  async getAccountHeadById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid account head ID'
        });
      }

      const accountHead = await AccountHead.getById(id);
      
      if (!accountHead) {
        return res.status(404).json({
          success: false,
          message: 'Account head not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Account head retrieved successfully',
        data: accountHead
      });
    } catch (error) {
      console.error('Error fetching account head:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch account head',
        error: error.message
      });
    }
  },

  // Create new account head
  async createAccountHead(req, res) {
    try {
      const { error, value } = accountHeadSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const accountHead = await AccountHead.create(value);
      
      res.status(201).json({
        success: true,
        message: 'Account head created successfully',
        data: accountHead
      });
    } catch (error) {
      console.error('Error creating account head:', error);
      
      if (error.message === 'Account head already exists') {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to create account head',
        error: error.message
      });
    }
  },

  // Update account head
  async updateAccountHead(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid account head ID'
        });
      }

      const { error, value } = accountHeadSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const accountHead = await AccountHead.update(id, value);
      
      res.status(200).json({
        success: true,
        message: 'Account head updated successfully',
        data: accountHead
      });
    } catch (error) {
      console.error('Error updating account head:', error);
      
      if (error.message === 'Account head not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message === 'Account head already exists') {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to update account head',
        error: error.message
      });
    }
  },

  // Delete account head
  async deleteAccountHead(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid account head ID'
        });
      }

      const deleted = await AccountHead.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Account head not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Account head deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting account head:', error);
      
      if (error.message === 'Account head not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to delete account head',
        error: error.message
      });
    }
  },

  // Get account types
  async getAccountTypes(req, res) {
    try {
      const accountTypes = AccountHead.getAccountTypes();
      
      res.status(200).json({
        success: true,
        message: 'Account types retrieved successfully',
        data: accountTypes.map(type => ({ value: type, label: type }))
      });
    } catch (error) {
      console.error('Error fetching account types:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch account types',
        error: error.message
      });
    }
  }
};

module.exports = accountHeadController;
