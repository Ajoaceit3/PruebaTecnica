const jwt = require('jsonwebtoken');

const env = require('../config/env');
const { User } = require('../database/models');
const AppError = require('../shared/errors/AppError');

async function authentication(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next(
        new AppError(
          'Authentication required',
          401,
          'AUTHENTICATION_REQUIRED'
        )
      );
    }

    const token = authorization.substring(7).trim();

    if (!token) {
      return next(
        new AppError(
          'Authentication required',
          401,
          'AUTHENTICATION_REQUIRED'
        )
      );
    }

    const payload = jwt.verify(token, env.JWT_SECRET);

    const userId = Number(payload.sub);

    if (!Number.isInteger(userId)) {
      return next(
        new AppError(
          'Invalid authentication token',
          401,
          'INVALID_TOKEN'
        )
      );
    }

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email']
    });

    if (!user) {
      return next(
        new AppError(
          'Authenticated user does not exist',
          401,
          'INVALID_TOKEN'
        )
      );
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(
        new AppError(
          'Authentication token has expired',
          401,
          'TOKEN_EXPIRED'
        )
      );
    }

    if (error.name === 'JsonWebTokenError') {
      return next(
        new AppError(
          'Invalid authentication token',
          401,
          'INVALID_TOKEN'
        )
      );
    }

    return next(error);
  }
}

module.exports = authentication;