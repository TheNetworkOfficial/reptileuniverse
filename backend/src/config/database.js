const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// If a dialect is supplied via environment variables, use the provided
// database connection details. Otherwise fall back to an in-memory SQLite
// instance so the app can run without a full database setup.
if (process.env.DB_DIALECT) {
  sequelize = new Sequelize(
    process.env.DB_NAME_DEV,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: process.env.DB_DIALECT,
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        }
      }
    }
  );
} else {
  sequelize = new Sequelize('sqlite::memory:', { logging: false });
}

module.exports = sequelize;
