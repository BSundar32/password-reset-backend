const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const passwordResetRoutes = require('./controllerRoutes/passwordRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request timeout middleware (30 seconds)
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    console.error('[TIMEOUT] Request exceeded 30 seconds:', req.method, req.path);
    res.status(408).json({ error: 'Request timeout' });
  });
  next();
});

// Database Connection
connectDB();

// Routes
app.use('/username', passwordResetRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('[ERROR]', error);
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    timestamp: new Date()
  });
});

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Password Reset API: http://localhost:${PORT}/username/forgot-password`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});
