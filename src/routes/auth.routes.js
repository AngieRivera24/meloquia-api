// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

// Registro de usuario
router.post('/register', register);

// Login de usuario
router.post('/login', login);

module.exports = router;
