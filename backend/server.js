// // require('dotenv').config();
// // const express = require('express');
// // const app = express();
// // const PORT = process.env.PORT || 5000;
// // const cors = require('cors');

// // app.use(cors({
// //   origin: 'http://localhost:5173',  // frontend URL
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// // }));
// // // Middleware
// // app.use(express.json());

// // // Combined routes
// // app.use('/api', require('./modules/masterdata/masterDataRoutes'));

// // // Error handling middleware
// // app.use((err, req, res, next) => {
// //   console.error(err.stack);
// //   res.status(500).json({ error: 'Internal Server Error' });
// // });

// // app.listen(PORT, () => 
// //   console.log(`Server running on port ${PORT}`));

// // app.get('/', (req, res) => res.send('Logistics Backend Running ✅'));

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Security middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });

// // Apply rate limiting to all routes
// app.use(limiter);

// // Special rate limit for login
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5 // limit each IP to 5 login requests per windowMs
// });

// // Middleware
// app.use(express.json());

// // Apply login rate limiter
// app.use('/api/login', loginLimiter);

// // Routes
// app.use('/api', require('./modules/masterdata/masterDataRoutes'));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     success: false, 
//     message: 'Internal Server Error' 
//   });
// });

// app.listen(PORT, () => 
//   console.log(`Server running on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);
app.use(express.json());

// Apply login rate limiter to login route only
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { 
    success: false, 
    message: 'Too many login attempts, please try again later' 
  }
});

// Routes
app.use('/api', require('./modules/masterdata/masterDataRoutes'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error' 
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));