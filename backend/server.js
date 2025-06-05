
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  
  // Custom middleware to log frontend connections
  app.use((req, res, next) => {
    if (req.headers.origin === 'http://localhost:5173') {
      console.log('✅ Frontend Connected:', req.method, req.url);
    }
    next();
  });

app.use(helmet());
app.use(express.json());

// Database connection
const db = require('./config/database');

// Test database connection
db.getConnection()
  .then(connection => {
    console.log('Successfully connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/inventory', require('./routes/inventory.routes'));
app.use('/api/orders', require('./routes/orders.routes'));
app.use('/api/users', require('./routes/users.routes'));
// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});