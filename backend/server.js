const app = require('./src/app');
const config = require('./src/config/env');
const { dbPath } = require('./src/config/database');

const server = app.listen(config.PORT, () => {
  console.log('====================================================');
  console.log(`🗡️  POWER PUFF RPG BACKEND RUNNING ON PORT ${config.PORT}`);
  console.log(`🎮 Health Check: http://localhost:${config.PORT}/api/health`);
  console.log(`🌐 CORS Enabled: ${config.ALLOWED_ORIGINS.join(', ')}`);
  console.log(`📦 Database: SQLite (${dbPath})`);
  console.log('====================================================');
});

module.exports = server;
