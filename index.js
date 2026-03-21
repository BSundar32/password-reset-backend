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

// Database Connection
connectDB();

// Routes
app.use('/username', passwordResetRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Password Reset API: http://localhost:${PORT}/username/password-reset`);
});
