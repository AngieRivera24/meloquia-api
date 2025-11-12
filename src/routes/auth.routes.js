// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

// Registro de usuario
router.post('/register', register);

// Login de usuario
router.post('/login', login);

// ====================== DEPURACIÓN ======================
router.post("/debug", (req, res) => {
  console.log("🧩 Body recibido en /auth/debug:", req.body);
  res.json({
    recibido: req.body,
    tipo: typeof req.body,
    keys: Object.keys(req.body)
  });
});

module.exports = router;
