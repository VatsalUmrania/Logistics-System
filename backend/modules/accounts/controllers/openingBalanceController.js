const OpeningBalance = require('../models/OpeningBalance');
const Joi = require('joi');

// ✅ Graceful: Validation schema with comprehensive rules
const openingBalanceSchema = Joi.object({
    account_head_id: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'Account head ID must be a number',
            'number.positive': 'Account head ID must be positive',
            'any.required': 'Account head is required'
        }),
    sub_account_head_id: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'Sub account head ID must be a number',
            'number.positive': 'Sub account head ID must be positive',
            'any.required': 'Sub account head is required'
        }),
    balance_date: Joi.date().iso().required()
        .messages({
            'date.base': 'Invalid date format',
            'any.required': 'Balance date is required'
        }),
    balance_type: Joi.string().valid('Debit', 'Credit').required()
        .messages({
            'any.only': 'Balance type must be either Debit or Credit',
            'any.required': 'Balance type is required'
        }),
    amount: Joi.number().positive().precision(2).required()
        .messages({
            'number.base': 'Amount must be a number',
            'number.positive': 'Amount must be positive',
            'any.required': 'Amount is required'
        }),
    description: Joi.string().max(1000).allow('', null).optional()
        .messages({
            'string.max': 'Description cannot exceed 1000 characters'
        })
});

const openingBalanceController = {
    // ✅ Graceful: Get all with comprehensive error handling
    async getAll(req, res) {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;

            // Pre-check: Validate pagination parameters
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);

            if (isNaN(pageNum) || pageNum < 1) {
                return res.status(400).json({
                    success: false,
                    error: 'Page must be a positive number'
                });
            }

            if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
                return res.status(400).json({
                    success: false,
                    error: 'Limit must be between 1 and 100'
                });
            }

            const result = await OpeningBalance.getAll(pageNum, limitNum, search);

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getAll controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching opening balances'
            });
        }
    },

    // ✅ Graceful: Get totals with error handling
    async getTotals(req, res) {
        try {
            const result = await OpeningBalance.getTotals();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error,
                    data: result.data // Return default values even on error
                });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getTotals controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching totals',
                data: {
                    total_debit: 0,
                    total_credit: 0,
                    net_balance: 0,
                    total_entries: 0
                }
            });
        }
    },

    // ✅ Pre-Check & Graceful: Create with validation
    async create(req, res) {
        try {
            // Pre-check: Validate request body
            const { error, value } = openingBalanceSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: error.details[0].message
                });
            }

            const result = await OpeningBalance.create(value);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(201).json({
                success: true,
                message: 'Opening balance created successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error in create controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while creating opening balance'
            });
        }
    },

    // ✅ Pre-Check & Graceful: Update with validation
    async update(req, res) {
        try {
            const { id } = req.params;

            // Pre-check: Validate ID parameter
            if (!id || isNaN(id) || parseInt(id) < 1) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid opening balance ID'
                });
            }

            // Pre-check: Validate request body
            const { error, value } = openingBalanceSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: error.details[0].message
                });
            }

            const result = await OpeningBalance.update(parseInt(id), value);

            if (!result.success) {
                const statusCode = result.error.includes('not found') ? 404 : 400;
                return res.status(statusCode).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Opening balance updated successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error in update controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while updating opening balance'
            });
        }
    },

    // ✅ Pre-Check & Graceful: Delete with validation
    async delete(req, res) {
        try {
            const { id } = req.params;

            // Pre-check: Validate ID parameter
            if (!id || isNaN(id) || parseInt(id) < 1) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid opening balance ID'
                });
            }

            const result = await OpeningBalance.delete(parseInt(id));

            if (!result.success) {
                const statusCode = result.error.includes('not found') ? 404 : 400;
                return res.status(statusCode).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Opening balance deleted successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error in delete controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while deleting opening balance'
            });
        }
    },

    // ✅ Graceful: Get by ID with error handling
    async getById(req, res) {
        try {
            const { id } = req.params;

            // Pre-check: Validate ID parameter
            if (!id || isNaN(id) || parseInt(id) < 1) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid opening balance ID'
                });
            }

            const result = await OpeningBalance.getById(parseInt(id));

            if (!result.success) {
                const statusCode = result.error.includes('not found') ? 404 : 500;
                return res.status(statusCode).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getById controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching opening balance'
            });
        }
    }
};

module.exports = openingBalanceController;
