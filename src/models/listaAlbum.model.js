const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ListaAlbum = sequelize.define(
  "T_Lista_Album",
  {
    ID_Lista: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    ID_Album: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    Fechaagregada: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    tableName: "T_Lista_Album",
    timestamps: false,
  }
);

module.exports = ListaAlbum;