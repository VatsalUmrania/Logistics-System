const CashBook = require('../models/CashBook');
const Joi = require('joi');

// ✅ Validation schemas
const cashBookFiltersSchema = Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
    cashAccountId: Joi.number().integer().positive().optional(),
    transactionType: Joi.string().valid('receipts', 'payments', 'all').optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional()
});

const cashBookController = {
    // ✅ Get cash accounts
    async getCashAccounts(req, res) {
        try {
            const result = await CashBook.getCashAccounts();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getCashAccounts controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching cash accounts'
            });
        }
    },

    // ✅ Get cash book transactions
    async getTransactions(req, res) {
        try {
            const { error, value } = cashBookFiltersSchema.validate(req.query);
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: error.details[0].message
                });
            }

            const result = await CashBook.getCashBookTransactions(value);

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getTransactions controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching transactions'
            });
        }
    },

    // ✅ Get cash book summary
    async getSummary(req, res) {
        try {
            const { error, value } = cashBookFiltersSchema.validate(req.query);
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: error.details[0].message
                });
            }

            const result = await CashBook.getCashBookSummary(value);

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getSummary controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching summary'
            });
        }
    },

    // ✅ Get daily cash summary
    async getDailySummary(req, res) {
        try {
            const { error, value } = cashBookFiltersSchema.validate(req.query);
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: error.details[0].message
                });
            }

            const result = await CashBook.getDailyCashSummary(value);

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getDailySummary controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching daily summary'
            });
        }
    },

    // ✅ Setup cash account
    async setupCashAccount(req, res) {
        try {
            const { accountHeadId, subAccountId, isDefault } = req.body;

            // Validation
            if (!accountHeadId || !subAccountId) {
                return res.status(400).json({
                    success: false,
                    error: 'Account head ID and sub account ID are required'
                });
            }

            const result = await CashBook.setupCashAccount(
                parseInt(accountHeadId), 
                parseInt(subAccountId), 
                Boolean(isDefault)
            );

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in setupCashAccount controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while setting up cash account'
            });
        }
    }
};

module.exports = cashBookController;
