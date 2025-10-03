const { sequelize } = require('../config/database');
const initModels = require('./init-models');

// Initialize all models
const models = initModels(sequelize);

// Export models và sequelize
module.exports = {
  sequelize,
  ...models
};