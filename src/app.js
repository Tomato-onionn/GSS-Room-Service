require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const { testConnection } = require('./config/database');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import routes
const routes = require('./routes');

// Import services
const AutoCompletionService = require('./utils/AutoCompletionService');
const SocketService = require('./services/SocketService');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://gss-room-service.onrender.com', 'http://localhost:5173', 'http://localhost:3000', 'https://globalskill.vercel.app', 'https://global-skill-swap.vercel.app']
  : ['http://localhost:5173', 'http://localhost:3000', 'https://gss-room-service.onrender.com', 'https://globalskill.vercel.app', 'https://global-skill-swap.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Remove trailing slash for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? (process.env.CORS_ORIGIN === '*' ? '*' : process.env.CORS_ORIGIN.split(',').map(o => o.trim().replace(/\/$/, '')))
      : corsOrigins.map(o => o.replace(/\/$/, ''));
    
    if (allowedOrigins === '*' || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Meeting Room Management API Documentation',
  swaggerOptions: {
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    tryItOutEnabled: true,
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Meeting Room API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Meeting Room API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: require('../package.json').version
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize auto-completion service
const autoCompletionService = new AutoCompletionService();

// Initialize Socket.IO
SocketService.initialize(server);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Start auto-completion service
    autoCompletionService.start();
    
    server.listen(PORT, () => {
      console.log(`🚀 Meeting Room API server is running on port ${PORT}`);
      console.log(`📖 API Documentation available at http://localhost:${PORT}/api-docs`);
      console.log(`🔍 Health check available at http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: Connected to ${process.env.DB_NAME || 'room-service'}`);
      console.log(`⏰ Auto-completion: ${autoCompletionService.getStatus().isRunning ? 'Active' : 'Inactive'}`);
      console.log(`🔌 Socket.IO: Initialized and ready`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  autoCompletionService.stop();
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  autoCompletionService.stop();
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  autoCompletionService.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  autoCompletionService.stop();
  process.exit(0);
});

startServer();

module.exports = app;