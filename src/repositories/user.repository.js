// src/repositories/user.repository.js
const User = require('../models/user.model');

async function createUser({ Usuario, Nombre, Correo, contrasena, Edad, Descripcion }) {
  return await User.create({ Usuario, Nombre, Correo, contrasena, Edad, Descripcion });
}

async function getAllUsers() {
  return await User.findAll();
}

async function getUserById(id) {
  return await User.findByPk(id);
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById
};
