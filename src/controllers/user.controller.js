// src/controllers/user.controller.js
const sequelize = require('../config/db');

// Controlador para registrar usuario con SP en MySQL
const crearUsuario = async (req, res) => {
  const { nombre, email, password, edad } = req.body;
  try {
    const [result] = await sequelize.query(
      `CALL SP_Usuario_Alta(:nombre, :email, :password, :edad)`,
      {
        replacements: { nombre, email, password, edad }
      }
    );
    res.status(201).json({ message: 'Usuario creado con MySQL', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el procedimiento almacenado' });
  }
};

module.exports = { crearUsuario };