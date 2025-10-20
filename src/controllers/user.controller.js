// src/controllers/user.controller.js
const userRepository = require("../repositories/user.repository");
const bcrypt = require("bcryptjs");

// 📋 Obtener todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("❌ Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// 🔎 Obtener usuario por ID
exports.getUser = async (req, res) => {
  try {
    const user = await userRepository.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    console.error("❌ Error al obtener usuario:", err);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// 🆕 Crear nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { Usuario, Nombre, Correo, contrasena, Edad, Descripcion } = req.body;

    if (!Usuario || !Nombre || !Correo || !contrasena) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // 🔐 Encriptar la contraseña antes de guardarla
    const hash = await bcrypt.hash(contrasena, 10);

    const user = await userRepository.createUser({
      Usuario,
      Nombre,
      Correo,
      contrasena: hash,
      Edad,
      Descripcion,
    });

    res.status(201).json({ message: "✅ Usuario creado correctamente", user });
  } catch (err) {
    console.error("❌ Error al crear usuario:", err);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// ✏️ Actualizar perfil completo (nombre, usuario, correo, edad, descripción)
exports.updateUser = async (req, res) => {
  try {
    const { Usuario, Nombre, Correo, Edad, Descripcion } = req.body;

    // ⚠️ Verificar que se haya enviado al menos un campo
    if (!Usuario && !Nombre && !Correo && !Edad && !Descripcion) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    // 🧩 Verificar si el usuario existe
    const userExists = await userRepository.getUserById(req.params.id);
    if (!userExists) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 🔍 Verificar si el nuevo correo o usuario ya existen (si se están actualizando)
    if (Correo && Correo !== userExists.Correo) {
      const existingEmail = await userRepository.getUserByEmail(Correo);
      if (existingEmail) {
        return res.status(400).json({ error: "El correo ya está en uso" });
      }
    }

    if (Usuario && Usuario !== userExists.Usuario) {
      const existingUser = await userRepository.getUserByUsername(Usuario);
      if (existingUser) {
        return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
      }
    }

    // 🧱 Actualizar
    const updatedUser = await userRepository.updateUser(req.params.id, {
      Usuario,
      Nombre,
      Correo,
      Edad,
      Descripcion,
    });

    res.json({
      message: "✅ Perfil actualizado correctamente",
      updatedUser,
    });
  } catch (err) {
    console.error("❌ Error al actualizar usuario:", err);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// 🔒 Cambiar contraseña del usuario
exports.updatePassword = async (req, res) => {
  try {
    const { contrasena } = req.body;
    if (!contrasena)
      return res
        .status(400)
        .json({ error: "La nueva contraseña es obligatoria" });

    // Validación simple (mínimo 8 caracteres)
    if (contrasena.length < 8) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 8 caracteres" });
    }

    const hash = await bcrypt.hash(contrasena, 10);
    const updated = await userRepository.updatePassword(req.params.id, hash);

    if (!updated)
      return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ message: "🔐 Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("❌ Error al cambiar contraseña:", err);
    res.status(500).json({ error: "Error al actualizar contraseña" });
  }
};