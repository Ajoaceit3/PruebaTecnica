const jwt = require('jsonwebtoken');
const env = require('../../src/config/env');

function createToken(userId) {
  return jwt.sign(
    {},
    env.JWT_SECRET,
    {
      subject: String(userId),
      expiresIn: '1h'
    }
  );
}

module.exports = {
  createToken
};