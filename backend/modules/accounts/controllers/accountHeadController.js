const AccountHead = require('../models/AccountHead');
const Joi = require('joi');

// Validation schema
const accountHeadSchema = Joi.object({
  account_type: Joi.string().valid('Asset', 'Liability', 'Equity', 'Revenue', 'Expense').required(),
  account_head: Joi.string().min(1).max(255).required().trim(),
  description: Joi.string().max(1000).allow('', null).optional()
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
        limit = 10,
        includeInactive = 'false'
      } = req.query;

      const includeInactiveFlag = includeInactive === 'true';
      const result = await AccountHead.getAll(search, sortField, sortDirection, page, limit, includeInactiveFlag);

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
      const { includeInactive = 'false' } = req.query;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid account head ID'
        });
      }

      const accountHead = await AccountHead.getById(id, includeInactive === 'true');
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

  // Toggle account head status
  async toggleAccountHeadStatus(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid account head ID'
        });
      }

      const accountHead = await AccountHead.toggleStatus(id);
      const statusText = accountHead.is_active ? 'activated' : 'deactivated';
      
      res.status(200).json({
        success: true,
        message: `Account head ${statusText} successfully`,
        data: accountHead
      });
    } catch (error) {
      console.error('Error toggling account head status:', error);
      if (error.message === 'Account head not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to toggle account head status',
        error: error.message
      });
    }
  },

  // Delete account head (soft delete)
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
  },

  // Get active account heads for dropdown
  async getActiveAccountHeads(req, res) {
    try {
      const accountHeads = await AccountHead.getActiveAccountHeads();
      res.status(200).json({
        success: true,
        message: 'Active account heads retrieved successfully',
        data: accountHeads
      });
    } catch (error) {
      console.error('Error fetching active account heads:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch active account heads',
        error: error.message
      });
    }
  },

  // Get status counts
  async getStatusCounts(req, res) {
    try {
      const counts = await AccountHead.getStatusCounts();
      res.status(200).json({
        success: true,
        message: 'Status counts retrieved successfully',
        data: counts
      });
    } catch (error) {
      console.error('Error fetching status counts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch status counts',
        error: error.message
      });
    }
  },

  // Restore soft-deleted account head
  async restoreAccountHead(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid account head ID'
        });
      }

      const restored = await AccountHead.restore(id);
      if (!restored) {
        return res.status(404).json({
          success: false,
          message: 'Account head not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Account head restored successfully'
      });
    } catch (error) {
      console.error('Error restoring account head:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to restore account head',
        error: error.message
      });
    }
  }
};

module.exports = accountHeadController;
