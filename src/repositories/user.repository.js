// src/repositories/user.repository.js
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

// 🟢 Crear usuario con contraseña cifrada
async function createUser({ Usuario, Nombre, Correo, contrasena, Edad, Descripcion }) {
  // Cifrar la contraseña antes de guardar
  const hashedPassword = await bcrypt.hash(contrasena, 10);

  return await User.create({
    Usuario,
    Nombre,
    Correo,
    contrasena: hashedPassword,
    Edad,
    Descripcion
  });
}

// 🔹 Obtener todos los usuarios
async function getAllUsers() {
  return await User.findAll();
}

// 🔹 Obtener usuario por ID
async function getUserById(id) {
  return await User.findByPk(id);
}

// 🔹 Obtener usuario por correo (para login)
async function getUserByEmail(Correo) {
  return await User.findOne({ where: { Correo } });
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail
};