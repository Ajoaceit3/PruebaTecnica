const app = require('./app');
const sequelize = require('./config/database');
const env = require('./config/env');
const logger = require('./shared/logger');

let server;

async function startServer() {
  try {
    await sequelize.authenticate();

    logger.info('Database connection established');

    server = app.listen(env.PORT, () => {
      logger.info(
        {
          port: env.PORT,
          environment: env.NODE_ENV
        },
        'API server started'
      );
    });
  } catch (error) {
    logger.fatal(
      {
        err: error
      },
      'Unable to start application'
    );

    process.exit(1);
  }
}

async function shutdown(signal) {
  logger.info({ signal }, 'Shutdown signal received');

  if (server) {
    server.close(async () => {
      await sequelize.close();

      logger.info('Application stopped gracefully');

      process.exit(0);
    });

    return;
  }

  await sequelize.close();
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();