// src/repositories/user.repository.js
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

// 🧩 Crear usuario con contraseña limpia y cifrada
async function createUser({ Usuario, Nombre, Correo, contrasena, Edad, Descripcion }) {
  // Elimina espacios invisibles antes y después
  const passwordLimpia = contrasena.trim();

  // Cifra la contraseña limpia
  const hashedPassword = await bcrypt.hash(passwordLimpia, 10);

  // Crea el usuario
  return await User.create({
    Usuario,
    Nombre,
    Correo,
    contrasena: hashedPassword,
    Edad,
    Descripcion,
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

// 🔹 Obtener usuario por nombre de usuario
async function getUserByUsername(Usuario) {
  return await User.findOne({ where: { Usuario } });
}

//  Actualizar datos del usuario (perfil)
async function updateUser(id, data) {
  const user = await User.findByPk(id);
  if (!user) return null;

  await user.update(data); //  Aplica los cambios directamente
  return user;             // Devuelve el usuario actualizado
}

//  Actualizar contraseña
async function updatePassword(id, hashedPassword) {
  const user = await User.findByPk(id);
  if (!user) return false;

  user.contrasena = hashedPassword;
  await user.save();
  return true;
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