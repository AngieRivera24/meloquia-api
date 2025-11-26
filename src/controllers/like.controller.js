// src/controllers/like.controller.js
const Like = require("../models/like.model");

/* ======================================================
   👍 TOGGLE LIKE (Agregar/Quitar)
   ====================================================== */
exports.toggleLike = async (req, res) => {
  try {
    const { ID_Usuario, ID_reseña } = req.body;

    if (!ID_Usuario || !ID_reseña)
      return res.status(400).json({ error: "Faltan datos obligatorios" });

    const existe = await Like.findOne({
      where: { ID_Usuario, ID_reseña }
    });

    if (existe) {
      await existe.destroy();
      return res.json({ liked: false, message: "Like removido" });
    }

    await Like.create({ ID_Usuario, ID_reseña });
    res.json({ liked: true, message: "Like agregado" });

  } catch (err) {
    console.error("❌ Error en toggleLike:", err);
    res.status(500).json({ error: "Error en toggleLike" });
  }
};

/* ======================================================
   🔢 CONTAR LIKES DE UNA RESEÑA
   ====================================================== */
exports.contarLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const total = await Like.count({
      where: { ID_reseña: id }
    });

    res.json({ ID_reseña: id, likes: total });

  } catch (err) {
    console.error("❌ Error en contarLikes:", err);
    res.status(500).json({ error: "Error al contar likes" });
  }
};

/* ======================================================
   📋 LISTAR QUIÉNES DIERON LIKE
   ====================================================== */
exports.listarLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const likes = await Like.findAll({
      where: { ID_reseña: id },
      attributes: ["ID_Like", "ID_Usuario", "Fecha"]
    });

    res.json(likes);

  } catch (err) {
    console.error("❌ Error en listarLikes:", err);
    res.status(500).json({ error: "Error al obtener likes" });
  }
};