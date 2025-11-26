// src/routes/like.routes.js
const express = require("express");
const router = express.Router();
const likeCtrl = require("../controllers/like.controller");

router.post("/toggle", likeCtrl.toggleLike);
router.get("/count/:id", likeCtrl.contarLikes);
router.get("/list/:id", likeCtrl.listarLikes);

module.exports = router;