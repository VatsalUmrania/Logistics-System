const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const db = require('./config/db');
const { sequelize } = require('./modules/accounts/index');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());

// Fixed routes with correct module names and commas
app.use('/api', require('./modules/masterdata/masterDataRoutes'));
app.use('/api', require('./modules/suppliers/index'));
app.use('/api', require('./modules/clerances/index')); // Fixed typo: clerances -> clearances
app.use('/api', require('./modules/accounts/index')); // Added missing comma

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

// Start server after DB connection
(async () => {
  try {
    const connection = await db.getConnection();
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server: DB not ready', err.message);
    process.exit(1);
  }
})();