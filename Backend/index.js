const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();
const cache = require('./services/cacheService');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim()).filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:5174'];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50kb' }));

app.get('/', (req, res) => {
  res.send('AI Content Strategy Engine API is running!');
});

app.get('/health', (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  const cacheStatus = cache.getStatus();
  const ready = databaseConnected;
  res.status(ready ? 200 : 503).json({
    status: ready ? 'ok' : 'degraded',
    database: databaseConnected ? 'connected' : 'disconnected',
    cache: cacheStatus,
  });
});

const trends = require('./routes/trends');
const strategy = require('./routes/strategy');
const competitors = require('./routes/competitors');
const auth = require('./routes/auth'); // <-- Import auth router

// Mount routers
app.use('/api/trends', trends);
app.use('/api/strategy', strategy);
app.use('/api/competitors', competitors);
app.use('/api/auth', auth);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  const shutdown = async signal => {
    console.log(`${signal} received. Shutting down.`);
    server.close(async () => {
      await mongoose.disconnect();
      await cache.close();
      process.exit(0);
    });
  };

  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch(error => {
  console.error('Server startup failed:', error.message);
  process.exit(1);
});