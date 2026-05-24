require('../env.js');

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'postgres',
    timezone: process.env.DB_TIMEZONE,
    logging: false,
    pool: {
      max: 50,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  }
};
