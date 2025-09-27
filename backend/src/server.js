import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Import configuration
import config, { serverConfig, apiConfig } from './config/config.js';

// Import routes
import authRoutes from './routes/auth.js';
import discordRoutes from './routes/discord.js';
import discordAuthRoutes from './routes/discordAuth.js';
import staffRoutes from './routes/staff.js';
import userRoutes from './routes/user.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Import database
import './config/database.js';

const app = express();
const PORT = serverConfig.port || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: (apiConfig.rateLimitWindow || 15) * 60 * 1000, // 15 minutes
  max: apiConfig.rateLimitMax || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(cors({
  origin: serverConfig.corsOrigin || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'PX Development Backend API is running',
    timestamp: new Date().toISOString(),
    environment: serverConfig.nodeEnv || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/discord', discordAuthRoutes);
app.use('/api/discord', discordRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/user', userRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 PX Development Backend Server Started!
📍 Port: ${PORT}
🌍 Environment: ${serverConfig.nodeEnv || 'development'}
🔗 Health Check: http://localhost:${PORT}/health
📚 API Base URL: http://localhost:${PORT}/api
  `);
});

export default app;