const express = require('express');
const { crearUsuario } = require('../controllers/user.controller');

const router = express.Router();

// Nuevo registro de usuario usando MySQL (SP_Usuario_Alta)
router.post('/register', crearUsuario);

module.exports = router;