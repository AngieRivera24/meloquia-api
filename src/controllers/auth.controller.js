// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// Registro de usuario
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar campos
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos' });
    }

    // Verificar si ya existe el correo
    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar contraseña con bcrypt
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const user = await User.create({ nombre, email, password: hash });

    // Responder sin enviar el password
    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      usuario: {
        id: user._id,
        nombre: user.nombre,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) { // Error de índice único
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

// Inicio de sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan campos' });
    }

    // Buscar usuario e incluir el password (por defecto no se selecciona)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Comparar password ingresado con el hash
    const esValida = await bcrypt.compare(password, user.password);
    if (!esValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Respuesta exitosa
    return res.json({
      message: 'Inicio de sesión exitoso',
      usuario: {
        id: user._id,
        nombre: user.nombre,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { register, login };