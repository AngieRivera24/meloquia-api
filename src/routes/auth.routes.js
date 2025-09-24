// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

// Ruta de registro
router.post('/register', register);

// Ruta de login
router.post('/login', login);

module.exports = router;