// src/routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// 🆕 Registrar nuevo usuario
router.post("/register", userController.createUser);

// 📋 Obtener todos los usuarios
router.get("/", userController.getUsers);

// 🔎 Obtener un usuario por ID
router.get("/:id", userController.getUser);

// ✏️ Actualizar perfil (usuario, correo, nombre, descripción, edad)
router.put("/:id", userController.updateUser);

// 🔒 Cambiar contraseña
router.put("/:id/password", userController.updatePassword);

module.exports = router;