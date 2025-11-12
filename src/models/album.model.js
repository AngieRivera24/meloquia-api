const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Album = sequelize.define("T_Album", {
  ID_Album: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  Titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ID_Artistas: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Añodelanzamiento: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  AVG_Rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.0
  },
  PortadaURL: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: "T_Album",
  timestamps: false
});

module.exports = Album;