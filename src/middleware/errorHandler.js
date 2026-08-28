const { ZodError } = require('zod');
const env = require('../config/env');

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      }
    });
  }

  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_SERVER_ERROR';

  if (statusCode >= 500) {
    req.log?.error({ err: error }, 'Unhandled application error');
  } else {
    req.log?.warn(
      {
        err: error,
        statusCode
      },
      'Request failed'
    );
  }

  const message =
    statusCode === 500 && env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message;

  const response = {
    error: {
      code,
      message
    }
  };

  if (error.details) {
    response.error.details = error.details;
  }

  return res.status(statusCode).json(response);
}

module.exports = errorHandler;