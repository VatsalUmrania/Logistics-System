const express = require('express');
const router = express.Router();

router.use('/accounts-head', require('./routes/accountHeadRoutes'));


module.exports = router;