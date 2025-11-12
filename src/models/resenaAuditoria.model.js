const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ResenaAuditoria = sequelize.define("T_ReseñaAuditoria", {
  ID_ReseñaAuditoria: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ID_reseña: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  MovimientoAuditoria: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  UsuarioAuditoria: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  FechaAuditoria: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  Antiguareseña: {
    type: DataTypes.TINYINT,
    allowNull: true
  },
  Antiguaopinion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: "T_ReseñaAuditoria",
  timestamps: false
});

module.exports = ResenaAuditoria;