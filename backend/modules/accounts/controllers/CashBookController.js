// const CashBook = require('../models/CashBook');
// const Joi = require('joi');

// // ✅ Validation schemas
// const cashBookFiltersSchema = Joi.object({
//     startDate: Joi.date().iso().optional(),
//     endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
//     cashAccountId: Joi.number().integer().positive().optional(),
//     transactionType: Joi.string().valid('receipts', 'payments', 'all').optional(),
//     page: Joi.number().integer().min(1).optional(),
//     limit: Joi.number().integer().min(1).max(100).optional()
// });

// const cashBookController = {
//     // ✅ Get cash accounts
//     async getCashAccounts(req, res) {
//         try {
//             const result = await CashBook.getCashAccounts();

//             if (!result.success) {
//                 return res.status(500).json({
//                     success: false,
//                     error: result.error
//                 });
//             }

//             res.status(200).json(result);
//         } catch (error) {
//             console.error('Error in getCashAccounts controller:', error);
//             res.status(500).json({
//                 success: false,
//                 error: 'Internal server error while fetching cash accounts'
//             });
//         }
//     },

//     // ✅ Get cash book transactions
//     async getTransactions(req, res) {
//         try {
//             const { error, value } = cashBookFiltersSchema.validate(req.query);
//             if (error) {
//                 return res.status(400).json({
//                     success: false,
//                     error: error.details[0].message
//                 });
//             }

//             const result = await CashBook.getCashBookTransactions(value);

//             if (!result.success) {
//                 return res.status(500).json({
//                     success: false,
//                     error: result.error
//                 });
//             }

//             res.status(200).json(result);
//         } catch (error) {
//             console.error('Error in getTransactions controller:', error);
//             res.status(500).json({
//                 success: false,
//                 error: 'Internal server error while fetching transactions'
//             });
//         }
//     },

//     // ✅ Get cash book summary
//     async getSummary(req, res) {
//         try {
//             const { error, value } = cashBookFiltersSchema.validate(req.query);
//             if (error) {
//                 return res.status(400).json({
//                     success: false,
//                     error: error.details[0].message
//                 });
//             }

//             const result = await CashBook.getCashBookSummary(value);

//             if (!result.success) {
//                 return res.status(500).json({
//                     success: false,
//                     error: result.error
//                 });
//             }

//             res.status(200).json(result);
//         } catch (error) {
//             console.error('Error in getSummary controller:', error);
//             res.status(500).json({
//                 success: false,
//                 error: 'Internal server error while fetching summary'
//             });
//         }
//     },

//     // ✅ Get daily cash summary
//     async getDailySummary(req, res) {
//         try {
//             const { error, value } = cashBookFiltersSchema.validate(req.query);
//             if (error) {
//                 return res.status(400).json({
//                     success: false,
//                     error: error.details[0].message
//                 });
//             }

//             const result = await CashBook.getDailyCashSummary(value);

//             if (!result.success) {
//                 return res.status(500).json({
//                     success: false,
//                     error: result.error
//                 });
//             }

//             res.status(200).json(result);
//         } catch (error) {
//             console.error('Error in getDailySummary controller:', error);
//             res.status(500).json({
//                 success: false,
//                 error: 'Internal server error while fetching daily summary'
//             });
//         }
//     },

//     // ✅ Setup cash account
//     async setupCashAccount(req, res) {
//         try {
//             const { accountHeadId, subAccountId, isDefault } = req.body;

//             // Validation
//             if (!accountHeadId || !subAccountId) {
//                 return res.status(400).json({
//                     success: false,
//                     error: 'Account head ID and sub account ID are required'
//                 });
//             }

//             const result = await CashBook.setupCashAccount(
//                 parseInt(accountHeadId), 
//                 parseInt(subAccountId), 
//                 Boolean(isDefault)
//             );

//             if (!result.success) {
//                 return res.status(400).json({
//                     success: false,
//                     error: result.error
//                 });
//             }

//             res.status(200).json(result);
//         } catch (error) {
//             console.error('Error in setupCashAccount controller:', error);
//             res.status(500).json({
//                 success: false,
//                 error: 'Internal server error while setting up cash account'
//             });
//         }
//     }
// };

// module.exports = cashBookController;


const cashBook = require('../models/CashBook');
const Joi = require('joi');

const schema = Joi.object({
  trx_type: Joi.string().valid('Receipt','Payment').required(),
  payment_type_id: Joi.number().integer().required(),
  transaction_date: Joi.date().required(),
  narration: Joi.string().allow('', null),
  reference_no: Joi.string().allow('', null),
  currency: Joi.string().max(10).default('SAR'),
  amount: Joi.number().positive().required(),
  debit_account_id: Joi.number().integer().required(),
  credit_account_id: Joi.number().integer().required()
});

exports.create = async (req,res) => {
  try {
    const body = await schema.validateAsync(req.body, { abortEarly:false });
    const data = await cashBook.create(body, req.user.id);
    res.status(201).json({ success:true, data });
  } catch (err) {
    res.status(400).json({ success:false, error:err.message });
  }
};

exports.list = async (req,res) => {
  const filter = { from:req.query.from, to:req.query.to, trx_type:req.query.trx_type };
  const rows  = await cashBook.findAll(filter);
  res.json({ success:true, data:rows });
};

exports.update = async (req,res) => {
  try {
    const body = await schema.validateAsync(req.body, { abortEarly:false });
    await cashBook.update(req.params.id, { ...body, updated_by:req.user.id });
    res.json({ success:true, message:'Cash voucher updated' });
  } catch (err) { res.status(400).json({ success:false, error:err.message }); }
};

exports.remove = async (req,res) => {
  try {
    await cashBook.remove(req.params.id);
    res.json({ success:true, message:'Cash voucher removed' });
  } catch (err) { res.status(400).json({ success:false, error:err.message }); }
};
