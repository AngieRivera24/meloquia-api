// src/repositories/user.repository.js
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

// 🧩 Crear usuario con contraseña limpia y cifrada
async function createUser({ Usuario, Nombre, Correo, contrasena, Edad, Descripcion }) {
  try {
    const passwordLimpia = contrasena.trim();
    const hashedPassword = await bcrypt.hash(passwordLimpia, 10);

    return await User.create({
      Usuario,
      Nombre,
      Correo,
      contrasena: hashedPassword,
      Edad,
      Descripcion,
    });
  } catch (err) {
    console.error("❌ Error al crear usuario (repo):", err);
    throw err;
  }
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

// ============================================
// ✏️ ACTUALIZAR DATOS DEL USUARIO (con logs)
// ============================================
async function updateUser(id, data) {
  try {
    console.log("📥 updateUser() — Datos recibidos:", data);

    const user = await User.findByPk(id);
    if (!user) {
      console.warn("⚠️ Usuario no encontrado en updateUser()");
      return null;
    }

    // 🔍 Mostrar los campos que Sequelize reconoce
    console.log("📌 Campos válidos del modelo Sequelize:", Object.keys(User.rawAttributes));

    // 🔎 Validar que el campo existe en el modelo (evita errores silenciosos)
    const camposValidos = Object.keys(User.rawAttributes);

    Object.keys(data).forEach(campo => {
      if (!camposValidos.includes(campo)) {
        console.warn(`⚠️ Campo ignorado por Sequelize: '${campo}' (no existe en el modelo)`);
      }
    });

    // 📝 Aplicar cambios
    await user.update(data);

    console.log("✅ Usuario actualizado en BD:", user.dataValues);
    return user;

  } catch (err) {
    console.error("❌ Error en updateUser() del repositorio:", err);
    throw err;
  }
}

// ============================================
// 🔑 ACTUALIZAR CONTRASEÑA
// ============================================
async function updatePassword(id, hashedPassword) {
  try {
    const user = await User.findByPk(id);
    if (!user) return false;

    user.contrasena = hashedPassword;
    await user.save();

    console.log("🔐 Contraseña actualizada correctamente para usuario:", id);
    return true;

  } catch (err) {
    console.error("❌ Error al actualizar contraseña:", err);
    throw err;
  }
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