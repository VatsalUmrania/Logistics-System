require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',  // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
// Middleware
app.use(express.json());

// Combined routes
app.use('/api', require('./routes/masterDataRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => res.send('Logistics Backend Running ✅'));
// Add these to server.js
