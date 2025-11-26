// src/routes/comentario.routes.js
const express = require("express");
const router = express.Router();
const comentarioCtrl = require("../controllers/comentario.controller");

router.post("/add", comentarioCtrl.crearComentario);
router.get("/list/:id", comentarioCtrl.listarComentarios);

module.exports = router;