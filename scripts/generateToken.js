const jwt = require('jsonwebtoken');

const env = require('../src/config/env');
const sequelize = require('../src/config/database');
const { User } = require('../src/database/models');

async function generateToken() {
  const userId = Number(process.argv[2]);

  if (!Number.isInteger(userId)) {
    console.error('Usage: npm run token -- <userId>');
    process.exitCode = 1;
    return;
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      console.error(`User ${userId} does not exist`);
      process.exitCode = 1;
      return;
    }

    const token = jwt.sign(
      {
        email: user.email
      },
      env.JWT_SECRET,
      {
        subject: String(user.id),
        expiresIn: env.JWT_EXPIRES_IN
      }
    );

    console.log(token);
  } finally {
    await sequelize.close();
  }
}

generateToken();