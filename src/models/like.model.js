// src/models/like.model.js
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define("T_Likes", {
    ID_Like: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_Usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_reseña: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "T_Likes",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["ID_Usuario", "ID_reseña"]
      }
    ]
  });

  return Like;
};