// src/models/comentario.model.js
module.exports = (sequelize, DataTypes) => {
  const Comentario = sequelize.define("T_Comentarios", {
    ID_Comentario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_reseña: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_Usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Comentario: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "T_Comentarios",
    timestamps: false,
  });

  return Comentario;
};