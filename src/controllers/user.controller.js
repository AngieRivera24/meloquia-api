// src/controllers/user.controller.js
const userRepository = require("../repositories/user.repository");

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("❌ Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Obtener usuario por ID
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

// Crear nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { Usuario, Nombre, Correo, contrasena, Edad, Descripcion } = req.body;

    if (!Usuario || !Nombre || !Correo || !contrasena) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const user = await userRepository.createUser({
      Usuario,
      Nombre,
      Correo,
      contrasena,
      Edad,
      Descripcion
    });

    res.status(201).json({ message: "✅ Usuario creado correctamente", user });
  } catch (err) {
    console.error("❌ Error al crear usuario:", err);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};
