// backend/sync.js
require('dotenv').config();            // only if you’re using a .env for DB credentials

// adjust path to wherever your models/index.js exports { sequelize, ... }
const { sequelize } = require('./src/models');

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Production database schema updated to match models.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to sync schema:', err);
    process.exit(1);
  }
})();
