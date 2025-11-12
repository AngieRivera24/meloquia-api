const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Artista = sequelize.define("T_Artistas", {
  ID_Artistas: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Nombreartista: {
    type: DataTypes.STRING(150),
    unique: true,
    allowNull: false
  }
}, {
  tableName: "T_Artistas",
  timestamps: false
});

module.exports = Artista;