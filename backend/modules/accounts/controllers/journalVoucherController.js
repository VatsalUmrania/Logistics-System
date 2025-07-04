const JournalVoucher = require('../models/JournalVoucher');
const Joi = require('joi');

// ✅ Validation schemas
const voucherSchema = Joi.object({
    voucher_no: Joi.string().required().trim().max(50),
    date: Joi.date().iso().required(),
    payment_type: Joi.string().valid('Cash', 'Bank', 'Credit', 'Cheque', 'Online Transfer', 'Other').required(),
    total_amount: Joi.number().positive().precision(2).required(),
    remarks: Joi.string().max(1000).allow('', null).optional()
});

const entrySchema = Joi.object({
    debit_account_head_id: Joi.number().integer().positive().required(),
    debit_account_subhead_id: Joi.number().integer().positive().required(),
    credit_account_head_id: Joi.number().integer().positive().required(),
    credit_account_subhead_id: Joi.number().integer().positive().required(),
    amount: Joi.number().positive().precision(2).required(),
    remarks: Joi.string().max(500).allow('', null).optional()
});

const journalVoucherController = {
    // ✅ Get all vouchers
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

            const result = await JournalVoucher.getAll(pageNum, limitNum, search);

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
                error: 'Internal server error while fetching journal vouchers'
            });
        }
    },

    // ✅ Create voucher
    async create(req, res) {
        try {
            const { voucherData, entries } = req.body;

            // Pre-check: Validate voucher data
            const { error: voucherError, value: validatedVoucherData } = voucherSchema.validate(voucherData);
            if (voucherError) {
                return res.status(400).json({
                    success: false,
                    error: `Voucher validation error: ${voucherError.details[0].message}`
                });
            }

            // Pre-check: Validate entries
            if (!entries || !Array.isArray(entries) || entries.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'At least one journal entry is required'
                });
            }

            const validatedEntries = [];
            for (let i = 0; i < entries.length; i++) {
                const { error: entryError, value: validatedEntry } = entrySchema.validate(entries[i]);
                if (entryError) {
                    return res.status(400).json({
                        success: false,
                        error: `Entry ${i + 1} validation error: ${entryError.details[0].message}`
                    });
                }
                validatedEntries.push(validatedEntry);
            }

            // Pre-check: Validate total amount matches entries sum
            const entriesSum = validatedEntries.reduce((sum, entry) => sum + entry.amount, 0);
            if (Math.abs(entriesSum - validatedVoucherData.total_amount) > 0.01) {
                return res.status(400).json({
                    success: false,
                    error: 'Total amount does not match sum of entries'
                });
            }

            const result = await JournalVoucher.create(validatedVoucherData, validatedEntries);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(201).json({
                success: true,
                message: 'Journal voucher created successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error in create controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while creating journal voucher'
            });
        }
    },

    // ✅ Get voucher by ID
    async getById(req, res) {
        try {
            const { id } = req.params;

            // Pre-check: Validate ID parameter
            if (!id || isNaN(id) || parseInt(id) < 1) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid journal voucher ID'
                });
            }

            const result = await JournalVoucher.getById(parseInt(id));

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
                error: 'Internal server error while fetching journal voucher'
            });
        }
    },

    // ✅ Update voucher
    async update(req, res) {
      try {
          const { id } = req.params;
          const { voucherData, entries } = req.body;

          // Pre-check: Validate ID parameter
          if (!id || isNaN(id) || parseInt(id) < 1) {
              return res.status(400).json({
                  success: false,
                  error: 'Invalid journal voucher ID'
              });
          }

          // Pre-check: Validate voucher data
          const { error: voucherError, value: validatedVoucherData } = voucherSchema.validate(voucherData);
          if (voucherError) {
              return res.status(400).json({
                  success: false,
                  error: `Voucher validation error: ${voucherError.details[0].message}`
              });
          }

          // Pre-check: Validate entries
          if (!entries || !Array.isArray(entries) || entries.length === 0) {
              return res.status(400).json({
                  success: false,
                  error: 'At least one journal entry is required'
              });
          }

          const validatedEntries = [];
          for (let i = 0; i < entries.length; i++) {
              const { error: entryError, value: validatedEntry } = entrySchema.validate(entries[i]);
              if (entryError) {
                  return res.status(400).json({
                      success: false,
                      error: `Entry ${i + 1} validation error: ${entryError.details[0].message}`
                  });
              }
              validatedEntries.push(validatedEntry);
          }

          // Pre-check: Validate total amount matches entries sum
          const entriesSum = validatedEntries.reduce((sum, entry) => sum + entry.amount, 0);
          if (Math.abs(entriesSum - validatedVoucherData.total_amount) > 0.01) {
              return res.status(400).json({
                  success: false,
                  error: 'Total amount does not match sum of entries'
              });
          }

          const result = await JournalVoucher.update(parseInt(id), validatedVoucherData, validatedEntries);

          if (!result.success) {
              const statusCode = result.error.includes('not found') ? 404 : 400;
              return res.status(statusCode).json({
                  success: false,
                  error: result.error
              });
          }

          res.status(200).json({
              success: true,
              message: 'Journal voucher updated successfully',
              data: result.data
          });
      } catch (error) {
          console.error('Error in update controller:', error);
          res.status(500).json({
              success: false,
              error: 'Internal server error while updating journal voucher'
          });
      }
  },
    // ✅ Delete voucher
    async delete(req, res) {
        try {
            const { id } = req.params;

            // Pre-check: Validate ID parameter
            if (!id || isNaN(id) || parseInt(id) < 1) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid journal voucher ID'
                });
            }

            const result = await JournalVoucher.delete(parseInt(id));

            if (!result.success) {
                const statusCode = result.error.includes('not found') ? 404 : 400;
                return res.status(statusCode).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Journal voucher deleted successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error in delete controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while deleting journal voucher'
            });
        }
    },

    // ✅ Get next voucher number
    async getNextVoucherNo(req, res) {
        try {
            const voucherNo = await JournalVoucher.generateVoucherNumber();
            
            res.status(200).json({
                success: true,
                data: { voucher_no: voucherNo }
            });
        } catch (error) {
            console.error('Error in getNextVoucherNo controller:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate voucher number'
            });
        }
    },

    // ✅ Get account data for dropdowns
    async getAccountData(req, res) {
        try {
            const result = await JournalVoucher.getAccountData();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getAccountData controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching account data'
            });
        }
    },

    // ✅ Get sub accounts for account head
    async getSubAccounts(req, res) {
        try {
            const { accountHeadId } = req.params;

            // Pre-check: Validate account head ID
            if (!accountHeadId || isNaN(accountHeadId) || parseInt(accountHeadId) < 1) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid account head ID'
                });
            }

            const result = await JournalVoucher.getSubAccounts(parseInt(accountHeadId));

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getSubAccounts controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching sub accounts'
            });
        }
    }
};

module.exports = journalVoucherController;
