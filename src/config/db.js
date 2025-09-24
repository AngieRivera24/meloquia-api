// src/config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('meloquia', 'meloquiaadmin', 'xAn4pT6uVvJPhEc', {
  host: '<TU-SERVIDOR>.mysql.database.azure.com',
  dialect: 'mysql',
  port: 3306,
  dialectOptions: {
    ssl: { require: true } // Azure requiere SSL
  }
});

module.exports = sequelize;