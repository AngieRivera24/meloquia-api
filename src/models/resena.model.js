const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model'); // Asegúrate que este archivo existe
// Si tienes modelo Album, importalo también:
// const Album = require('./album.model');

const Resena = sequelize.define(
  "T_Reseña",
  {
    ID_reseña: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ID_Usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ID_Album: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Rating: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    Opinion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    Likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    tableName: "T_Reseña",
    timestamps: false
  }
);

// Relaciones (si quieres agregarlas luego)
// Resena.belongsTo(User, { foreignKey: "ID_Usuario" });
// Resena.belongsTo(Album, { foreignKey: "ID_Album" });

module.exports = Resena;