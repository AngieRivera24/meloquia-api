// src/repositories/user.repository.js
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

// 🆕 Crear usuario
async function createUser({
  Usuario,
  Nombre,
  Correo,
  contrasena,
  Edad,
  Descripcion,
}) {
  return await User.create({
    Usuario,
    Nombre,
    Correo,
    contrasena,
    Edad,
    Descripcion,
  });
}

// 📋 Obtener todos los usuarios
async function getAllUsers() {
  return await User.findAll();
}

// 🔎 Obtener usuario por ID
async function getUserById(id) {
  return await User.findByPk(id);
}

// 🔍 Obtener usuario por correo
async function getUserByEmail(Correo) {
  return await User.findOne({ where: { Correo } });
}

// 🔍 Obtener usuario por nombre de usuario
async function getUserByUsername(Usuario) {
  return await User.findOne({ where: { Usuario } });
}

// ✏️ Actualizar perfil
async function updateUser(id, data) {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.update(data);
  return user;
}

// 🔒 Actualizar contraseña
async function updatePassword(id, hash) {
  const user = await User.findByPk(id);
  if (!user) return null;
  user.contrasena = hash;
  await user.save();
  return user;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUser,
  updatePassword,
};