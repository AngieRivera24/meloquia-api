const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Ruta para registrar usuario
router.post('/register', userController.createUser);

module.exports = router;
