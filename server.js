process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION');
  console.error(err);

  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION');
  console.error(reason);

  process.exit(1);
});

require('./env.js');

const express = require('express');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

const HTTP_STATUS = require('./src/constants/httpStatus.js');
const HTTP_CODE = require('./src/constants/httpCode.js');

const errorHandler = require('./src/middlewares/error.middleware');

const logger = require('./src/utils/logger.util.js');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());
app.use(cors({ origin: '*', credentials: true }));

app.use(morgan('combined', { stream: logger.stream }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const indexRoutes = require('./src/routes/index.route.js');
app.use('/', indexRoutes);

app.use((req, res) => {
  return res
    .status(HTTP_STATUS.NOT_FOUND)
    .json({ http_code: HTTP_CODE.ROUTE_NOT_FOUND, message: 'Route not found.' });
});

app.use(errorHandler);

const db = require('./models');
const redis = require('./config/redis.js');

const PORT = process.env.PORT || 3000;

let server;

const startServer = async () => {
  try {
    /**
     * * Database connection
     * * Redis connection
     * * Redis workers
     * * Start server
     */

    await db.sequelize.authenticate();

    logger.info('Database connection has been established successfully.');

    const redisResponse = await redis.ping();

    if (redisResponse !== 'PONG') {
      throw new Error('Redis ping failed');
    }

    logger.info('Redis connected successfully.');

    server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT} with build ${process.env.BUILD}`);
    });
  } catch (error) {
    logger.error('Critical failure during server startup:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(() => {
      logger.info('HTTP server closed.');
    });
  }

  try {
    /**
     * * Close database connection
     * * Close redis connection
     * * Close server
     */
    await db.sequelize.close();

    logger.info('Database connection closed.');

    await redis.quit();

    logger.info('Redis connection closed.');

    logger.info('Graceful shutdown completed. Exiting.');
    process.exit(0);
  } catch (err) {
    logger.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
