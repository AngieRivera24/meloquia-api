const express = require("express");
const router = express.Router();
const multer = require("multer");
const userController = require("../controllers/user.controller");

// ✅ Configuración de multer en memoria (para Azure Blob Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🧩 Registrar nuevo usuario
router.post("/register", userController.createUser);

// 🧩 Obtener todos los usuarios
router.get("/", userController.getUsers);

// 🧩 Obtener un usuario por ID
router.get("/:id", userController.getUser);

// 🧩 Actualizar perfil (usuario, correo, nombre, edad, descripción)
router.put("/:id", userController.updateUser);

// 🧩 Cambiar contraseña
router.put("/:id/password", userController.updatePassword);

// 📸 Subir / Actualizar foto de perfil con Azure Blob Storage
router.put("/:id/foto", upload.single("foto"), userController.actualizarFotoPerfil);

module.exports = router;