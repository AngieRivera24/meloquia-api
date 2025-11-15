// src/controllers/auth.controller.js
// =====================================================
// 📦 DEPENDENCIAS
// =====================================================
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// =====================================================
// 🧩 REGISTRO DE USUARIO
// =====================================================
const register = async (req, res) => {
  try {
    console.log("📩 Body recibido en /register:", req.body);

    // 🧹 Normalizar y limpiar entradas
    const Usuario = (req.body.Usuario || req.body.usuario || "").trim();
    const Nombre = (req.body.Nombre || req.body.nombre || "").trim();
    const Correo = (req.body.Correo || req.body.correo || req.body.email || "").trim().toLowerCase();
    const contrasena = (req.body.contrasena || req.body.password || "").trim();
    const Edad = req.body.Edad || req.body.edad || null;
    const Descripcion = (req.body.Descripcion || req.body.descripcion || "").trim();

    // 🛑 Validaciones básicas
    if (!Usuario || !Nombre || !Correo || !contrasena) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    // 📧 Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Correo)) {
      return res.status(400).json({ error: "El formato del correo no es válido." });
    }

    // 🔒 Longitud mínima de contraseña (8 caracteres)
    if (contrasena.length < 8) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres." });
    }

    // 🚫 Validar duplicados
    const [existeCorreo, existeUsuario] = await Promise.all([
      User.findOne({ where: { Correo } }),
      User.findOne({ where: { Usuario } }),
    ]);

    if (existeCorreo)
      return res.status(400).json({ error: "El correo ya está registrado." });

    if (existeUsuario)
      return res.status(400).json({ error: "El nombre de usuario ya está registrado." });

    // 🔐 Cifrar contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // 🧩 Crear usuario
    const user = await User.create({
      Usuario,
      Nombre,
      Correo,
      contrasena: hash,
      Edad,
      Descripcion,
    });

    console.log("✅ Usuario creado:", user.Usuario);

    // 🟢 Respuesta
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
    return res.status(500).json({ error: "Error interno al registrar usuario." });
  }
};

// =====================================================
// 🔐 LOGIN DE USUARIO
// =====================================================
const login = async (req, res) => {
  try {
    console.log("📩 Body recibido en /login:", req.body);

    // 🧹 Normalizar entradas
    const Correo = (req.body.Correo || req.body.correo || req.body.email || "").trim().toLowerCase();
    const contrasena = (req.body.contrasena || req.body.password || "").trim();

    if (!Correo || !contrasena) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    // 🔍 Buscar usuario
    const user = await User.findOne({ where: { Correo } });
    if (!user) {
      console.warn("⚠️ Intento de login con correo inexistente:", Correo);
      return res.status(401).json({ error: "Correo incorrecto." });
    }

    // 🔑 Comparar contraseñas (texto plano vs hash)
    const esValida = await bcrypt.compare(contrasena, user.contrasena);
    if (!esValida) {
      console.warn("⚠️ Contraseña incorrecta para:", Correo);
      return res.status(401).json({ error: "Contraseña incorrecta." });
    }

    // 🎫 Generar token JWT (expira en 2h)
    const token = jwt.sign(
      { id: user.ID_Usuario, correo: user.Correo },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("✅ Login exitoso:", user.Usuario);

    // 🟢 Respuesta
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
    return res.status(500).json({ error: "Error interno al iniciar sesión." });
  }
};

// =====================================================
// 🧪 RUTA DEBUG OPCIONAL (para pruebas desde frontend)
// =====================================================
const debug = async (req, res) => {
  return res.json({
    recibido: req.body,
    tipo: typeof req.body,
    keys: Object.keys(req.body),
  });
};

// =====================================================
// 📤 EXPORTACIÓN DE FUNCIONES
// =====================================================
module.exports = { register, login, debug };