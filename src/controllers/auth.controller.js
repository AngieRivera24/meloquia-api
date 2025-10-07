// src/controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// ======================= REGISTRO =======================
const register = async (req, res) => {
  try {
    console.log("📩 Body recibido en /register:", req.body);

    const { Usuario, Nombre, Correo, contrasena, Edad, Descripcion } = req.body;

    // Validar campos obligatorios
    if (!Usuario || !Nombre || !Correo || !contrasena) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Validar duplicados
    const existeCorreo = await User.findOne({ where: { Correo } });
    if (existeCorreo)
      return res.status(400).json({ error: "El correo ya está registrado" });

    const existeNombre = await User.findOne({ where: { Nombre } });
    if (existeNombre)
      return res.status(400).json({ error: "El nombre ya está registrado" });

    // Cifrar contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Crear usuario
    const user = await User.create({
      Usuario,
      Nombre,
      Correo,
      contrasena: hash,
      Edad,
      Descripcion,
    });

    // Respuesta
    return res.status(201).json({
      message: "✅ Usuario registrado correctamente",
      usuario: {
        id: user.ID_Usuario,
        Usuario: user.Usuario,
        Nombre: user.Nombre,
        Correo: user.Correo,
      },
    });
  } catch (err) {
    console.error("❌ Error en /register:", err);
    return res.status(500).json({
      error: "Error interno al registrar usuario",
      detalles: err.message,
    });
  }
};

// ======================= LOGIN =======================
const login = async (req, res) => {
  try {
    console.log("📩 Body recibido en /login:", req.body);

    const { Correo, contrasena } = req.body;

    // Validar campos
    if (!Correo || !contrasena)
      return res.status(400).json({ error: "Faltan campos obligatorios" });

    // Buscar usuario
    const user = await User.findOne({ where: { Correo } });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    // Comparar contraseñas
    const esValida = await bcrypt.compare(contrasena, user.contrasena);
    if (!esValida)
      return res.status(401).json({ error: "Credenciales inválidas" });

    // Generar token JWT
    const token = jwt.sign(
      { id: user.ID_Usuario, correo: user.Correo },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respuesta
    return res.json({
      message: "✅ Inicio de sesión exitoso",
      token,
      usuario: {
        id: user.ID_Usuario,
        Usuario: user.Usuario,
        Nombre: user.Nombre,
        Correo: user.Correo,
      },
    });
  } catch (err) {
    console.error("❌ Error en /login:", err);
    return res.status(500).json({
      error: "Error interno al iniciar sesión",
      detalles: err.message,
    });
  }
};

module.exports = { register, login };
