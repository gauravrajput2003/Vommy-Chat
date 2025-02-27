const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./config/database');
const { configSecurity } = require('./middleware/securityConfig');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const errorHandler = require('./middleware/errorHandler');
const configSession = require('./middleware/sessionConfig');

// Load env vars
dotenv.config();

// Route files
const authRoutes = require('./routes/authRoutes');
const referralRoutes = require('./routes/referralRoutes');

const app = express();

// Body parser
app.use(express.json());

// Apply session configuration
configSession(app);

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Apply security configuration
configSecurity(app);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Mount routers
app.use('/api', authRoutes);
app.use('/api/referrals', referralRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Error handler (should be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();

    if (process.env.NODE_ENV !== 'test') {
      const server = app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      });

      // Handle graceful shutdown
      process.on('SIGTERM', () => {
        console.info('SIGTERM signal received');
        server.close(() => {
          console.log('Server closed');
          process.exit(0);
        });
      });

      // Handle unhandled promise rejections
      process.on('unhandledRejection', (err) => {
        console.log('Unhandled Rejection:', err.message);
        server.close(() => process.exit(1));
      });
    }

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;