require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'room-service', // database name
  'avnadmin',     // username
  'AVNS_UQoE8v7UAxMD6Newbta', // password
  {
    host: 'globalskill-globalskill.e.aivencloud.com',
    port: 23246,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: console.log, // Set to false in production
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
  }
};

module.exports = { sequelize, testConnection };