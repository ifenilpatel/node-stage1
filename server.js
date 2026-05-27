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

const app = require('./src/app.js');

const db = require('./models');
const redis = require('./config/redis.js');

const logger = require('./src/utils/logger.util.js');

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
