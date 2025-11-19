// src/controllers/user.controller.js
const userRepository = require("../repositories/user.repository");
const bcrypt = require("bcryptjs");
const { uploadImage } = require("../services/azureStorage.service");

// =======================================
// 📌 Obtener todos los usuarios
// =======================================
exports.getUsers = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("❌ Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// =======================================
// 📌 Obtener usuario por ID
// =======================================
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

// =======================================
// 🆕 Crear nuevo usuario
// =======================================
exports.createUser = async (req, res) => {
  try {
    const { Usuario, Nombre, Correo, contrasena, Edad, Descripcion } = req.body;

    if (!Usuario || !Nombre || !Correo || !contrasena) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // 🔐 Encriptar contraseña (eliminando espacios antes y después)
    const passwordLimpia = contrasena.trim();
    const hash = await bcrypt.hash(passwordLimpia, 10);

    const user = await userRepository.createUser({
      Usuario,
      Nombre,
      Correo,
      contrasena: hash,
      Edad,
      Descripcion,
    });

    res.status(201).json({
      message: "✅ Usuario creado correctamente",
      user,
    });
  } catch (err) {
    console.error("❌ Error al crear usuario:", err);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// =======================================
// ✏️ Actualizar perfil (CORREGIDO)
// =======================================
exports.updateUser = async (req, res) => {
  try {
    const { Usuario, Nombre, Correo, Edad, Descripcion, foto } = req.body;

    // Verifica que haya al menos un campo a actualizar
    if (!Usuario && !Nombre && !Correo && !Edad && !Descripcion && !foto) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    const userExists = await userRepository.getUserById(req.params.id);
    if (!userExists) return res.status(404).json({ error: "Usuario no encontrado" });

    // Validar duplicados
    if (Correo && Correo !== userExists.Correo) {
      const existingEmail = await userRepository.getUserByEmail(Correo);
      if (existingEmail)
        return res.status(400).json({ error: "El correo ya está en uso" });
    }

    if (Usuario && Usuario !== userExists.Usuario) {
      const existingUser = await userRepository.getUserByUsername(Usuario);
      if (existingUser)
        return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
    }

    // Actualizar campos (incluye la foto)
    const updatedUser = await userRepository.updateUser(req.params.id, {
      Usuario,
      Nombre,
      Correo,
      Edad,
      Descripcion,
      foto, // 👈 NECESARIO PARA GUARDAR LA FOTO
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

// =======================================
// 🔑 Cambiar contraseña
// =======================================
exports.updatePassword = async (req, res) => {
  try {
    const { contrasena } = req.body;

    if (!contrasena)
      return res.status(400).json({ error: "La nueva contraseña es obligatoria" });

    if (contrasena.length < 8)
      return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });

    const hash = await bcrypt.hash(contrasena, 10);
    const updated = await userRepository.updatePassword(req.params.id, hash);

    if (!updated) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ message: "🔒 Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("❌ Error al cambiar contraseña:", err);
    res.status(500).json({ error: "Error al actualizar contraseña" });
  }
};

// =======================================
// 🖼️ Subir / Actualizar foto de perfil (Azure Blob Storage)
// =======================================
exports.actualizarFotoPerfil = async (req, res) => {
  try {
    const userId = req.params.id;
    const file = req.file;

    if (!file)
      return res.status(400).json({ success: false, error: "No se envió ninguna imagen" });

    // 🚀 Subir imagen a Azure Blob Storage
    const imageUrl = await uploadImage(file, userId);

    // 🗂️ Guardar URL pública en base de datos (campo "foto" o equivalente)
    await userRepository.updateUser(userId, { foto: imageUrl });

    res.json({
      success: true,
      message: "✅ Foto actualizada correctamente",
      imageUrl,
    });
  } catch (err) {
    console.error("❌ Error al actualizar foto:", err);
    res.status(500).json({ error: "Error interno al actualizar foto" });
  }
};