// src/controllers/comentario.controller.js
const Comentario = require("../models/comentario.model");

/* ======================================================
   📝 CREAR COMENTARIO
   ====================================================== */
exports.crearComentario = async (req, res) => {
  try {
    const { ID_Usuario, ID_reseña, Comentario } = req.body;

    if (!ID_Usuario || !ID_reseña || !Comentario)
      return res.status(400).json({ error: "Faltan datos obligatorios" });

    const nuevo = await db.T_Comentarios.create({
      ID_Usuario,
      ID_reseña,
      Comentario
    });

    res.json({
      message: "Comentario agregado",
      data: nuevo
    });

  } catch (err) {
    console.error("❌ Error en crearComentario:", err);
    res.status(500).json({ error: "Error al agregar comentario" });
  }
};

/* ======================================================
   📋 LISTAR COMENTARIOS DE UNA RESEÑA
   ====================================================== */
exports.listarComentarios = async (req, res) => {
  try {
    const { id } = req.params;

    const comentarios = await db.T_Comentarios.findAll({
      where: { ID_reseña: id },
      order: [["Fecha", "DESC"]],
    });

    res.json(comentarios);

  } catch (err) {
    console.error("❌ Error en listarComentarios:", err);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
};