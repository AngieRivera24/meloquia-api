const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Lista = sequelize.define(
  "T_Lista",
  {
    ID_Lista: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_Usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "T_Lista",
    timestamps: false,
  }
);

module.exports = Lista;