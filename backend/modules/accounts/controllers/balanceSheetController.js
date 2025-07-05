const BalanceSheet = require('../models/balanceSheetModel');
const Joi = require('joi');

// ✅ Validation schemas
const balanceSheetSchema = Joi.object({
    asOf: Joi.date().iso().max('now').required()
});

const dateRangeSchema = Joi.object({
    from_date: Joi.date().iso().required(),
    to_date: Joi.date().iso().min(Joi.ref('from_date')).required()
});

const balanceSheetController = {
    // ✅ Get balance sheet
    async getBalanceSheet(req, res) {
        try {
            const { asOf } = req.query;

            // Pre-check: Validate parameters
            const { error, value } = balanceSheetSchema.validate({ asOf });
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: `Validation error: ${error.details[0].message}`
                });
            }

            const result = await BalanceSheet.getBalanceSheet(value.asOf);

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Balance sheet generated successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error in getBalanceSheet controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while generating balance sheet'
            });
        }
    },

    // ✅ Get account categories
    async getAccountCategories(req, res) {
        try {
            const result = await BalanceSheet.getAccountCategories();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Account categories retrieved successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error in getAccountCategories controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching account categories'
            });
        }
    },

    // ✅ Get balance sheet summary
    async getBalanceSheetSummary(req, res) {
        try {
            const { from_date, to_date } = req.query;

            // Pre-check: Validate dates
            const { error, value } = dateRangeSchema.validate({ from_date, to_date });
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: `Validation error: ${error.details[0].message}`
                });
            }

            const result = await BalanceSheet.getBalanceSheetSummary(value.from_date, value.to_date);

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Balance sheet summary retrieved successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error in getBalanceSheetSummary controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching balance sheet summary'
            });
        }
    },

    // ✅ Get trial balance
    async getTrialBalance(req, res) {
        try {
            const { asOf } = req.query;

            // Pre-check: Validate date
            if (!asOf) {
                return res.status(400).json({
                    success: false,
                    error: 'asOf date is required'
                });
            }

            const asOfDate = new Date(asOf);
            if (isNaN(asOfDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid date format for asOf'
                });
            }

            const result = await BalanceSheet.getTrialBalance(asOf);

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Trial balance retrieved successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error in getTrialBalance controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching trial balance'
            });
        }
    }
};

module.exports = balanceSheetController;
