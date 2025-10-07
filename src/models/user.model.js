// src/models/user.model.js
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
  Nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  Correo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  contrasena: { // usamos "contrasena" en JS
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'contraseña' // Sequelize lo mapea a la columna real
  },
  Edad: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  FechaRegistro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  Descripcion: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  tableName: 'T_Usuario',
  timestamps: false
});

module.exports = User;





