// models/user.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('T_Usuario', {
  ID_Usuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Usuario: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Correo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  contraseña: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Edad: {
    type: DataTypes.INTEGER
  },
  FechaRegistro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  Descripcion: {
    type: DataTypes.STRING(200)
  }
}, {
  tableName: 'T_Usuario',
  timestamps: false
});

module.exports = User;
