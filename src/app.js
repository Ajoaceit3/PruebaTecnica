const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const pinoHttp = require('pino-http');

const buildingRoutes = require('./modules/buildings/building.routes');
const {
  buildingMachinesRouter,
  machineRouter
} = require('./modules/machines/machine.routes');
const {
  machineActionsRouter,
  actionRouter
} = require('./modules/actions/action.routes');
const sequelize = require('./config/database');
const logger = require('./shared/logger');
const AppError = require('./shared/errors/AppError');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.disable('x-powered-by');

app.use(
  pinoHttp({
    logger
  })
);

app.use(helmet());

app.use(cors());

app.use(
  express.json({
    limit: '1mb'
  })
);


// Health check
app.get('/health', async (req, res, next) => {
  try {
    await sequelize.query('SELECT 1');

    return res.status(200).json({
      status: 'ok',
      database: 'connected'
    });
  } catch (error) {
    return next(
      new AppError(
        'Database unavailable',
        503,
        'DATABASE_UNAVAILABLE'
      )
    );
  }
});


// Routes will be registered here later
app.use('/buildings', buildingRoutes);

app.use(
  '/buildings/:buildingId/machines',
  buildingMachinesRouter
);

app.use(
  '/machines',
  machineRouter
);

app.use(
  '/machines/:machineId/actions',
  machineActionsRouter
);

app.use(
  '/actions',
  actionRouter
);


// 404 - must be after all routes
app.use((req, res, next) => {
  next(
    new AppError(
      `Route ${req.method} ${req.originalUrl} not found`,
      404,
      'ROUTE_NOT_FOUND'
    )
  );
});


// Global error handler - must always be last
app.use(errorHandler);

module.exports = app;