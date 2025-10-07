'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('T_Usuario', {
      ID_Usuario: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      Usuario: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      Nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      Correo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      contraseña: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      Edad: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      FechaRegistro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      Descripcion: {
        type: Sequelize.STRING(200),
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('T_Usuario');
  }
};
