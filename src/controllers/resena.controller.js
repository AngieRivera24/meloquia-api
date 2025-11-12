// src/controllers/resena.controller.js
const Resena = require("../models/resena.model");
const ResenaAuditoria = require("../models/resenaAuditoria.model");
const { getAlbumIfNotExists } = require("../services/spotifyAlbum.service");

// ============================
// Crear Reseña (versión flexible)
// ============================
const crearResena = async (req, res) => {
  try {
    console.log("📦 Body recibido en reseñas:", req.body);

    // Aceptar distintos formatos (mayúsculas/minúsculas y traducciones)
    const {
      ID_Usuario,
      Id_Usuario,
      id_usuario,
      ID_Album,
      Id_Album,
      id_album,
      Rating,
      rating,
      Calificacion,
      calificacion,
      Opinion,
      opinion,
    } = req.body;

    // Unificar variables para evitar errores por nombres diferentes
    const idUsuario = ID_Usuario || Id_Usuario || id_usuario;
    const idAlbum = ID_Album || Id_Album || id_album;
    const calif = Rating || rating || Calificacion || calificacion;
    const op = Opinion || opinion || null;

    // Validación de campos obligatorios
    if (!idUsuario || !idAlbum || !calif) {
      return res.status(400).json({
        success: false,
        error: "Faltan campos obligatorios",
      });
    }

    // Verificar si el álbum existe o traerlo de Spotify
    const album = await getAlbumIfNotExists(idAlbum);
    if (!album)
      return res.status(404).json({
        success: false,
        error: "No se encontró el álbum en Spotify",
      });

    // Crear la reseña en la base de datos
    const nuevaResena = await Resena.create({
      ID_Usuario: idUsuario,
      ID_Album: idAlbum,
      Rating: calif,
      Opinion: op,
    });

    // Registrar auditoría de la creación
    await ResenaAuditoria.create({
      ID_reseña: nuevaResena.ID_reseña,
      ID_Usuario: idUsuario,
      ID_Album: idAlbum,
      Rating: calif,
      Opinion: op,
      MovimientoAuditoria: "CREAR",
      UsuarioAuditoria: `Usuario ${idUsuario}`,
    });

    // Respuesta final
    return res.status(201).json({
      success: true,
      message: "✅ Reseña creada correctamente",
      reseña: nuevaResena,
    });
  } catch (err) {
    console.error("❌ Error al crear reseña:", err);
    return res.status(500).json({
      success: false,
      error: "Error interno al crear reseña",
      detalles: err.message,
    });
  }
};

// ============================
// Editar Reseña
// ============================
const editarResena = async (req, res) => {
  try {
    const id = req.params.id;
    const { Rating, rating, Calificacion, calificacion, Opinion, opinion } =
      req.body;

    const calif = Rating || rating || Calificacion || calificacion;
    const op = Opinion || opinion || null;

    const reseña = await Resena.findByPk(id);
    if (!reseña)
      return res
        .status(404)
        .json({ success: false, error: "Reseña no encontrada" });

    const reseñaAntigua = reseña.toJSON();

    reseña.Rating = calif ?? reseña.Rating;
    reseña.Opinion = op ?? reseña.Opinion;
    await reseña.save();

    await ResenaAuditoria.create({
      ID_reseña: id,
      ID_Usuario: reseña.ID_Usuario,
      ID_Album: reseña.ID_Album,
      Rating: calif,
      Opinion: op,
      MovimientoAuditoria: "EDITAR",
      UsuarioAuditoria: `Usuario ${reseña.ID_Usuario}`,
      Antiguareseña: reseñaAntigua.Rating,
      Antiguaopinion: reseñaAntigua.Opinion,
    });

    return res.json({
      success: true,
      message: "✅ Reseña editada correctamente",
      reseña,
    });
  } catch (err) {
    console.error("❌ Error al editar reseña:", err);
    return res.status(500).json({
      success: false,
      error: "Error interno al editar reseña",
      detalles: err.message,
    });
  }
};

// ============================
// Eliminar Reseña
// ============================
const eliminarResena = async (req, res) => {
  try {
    const id = req.params.id;

    const reseña = await Resena.findByPk(id);
    if (!reseña)
      return res
        .status(404)
        .json({ success: false, error: "Reseña no encontrada" });

    await ResenaAuditoria.create({
      ID_reseña: id,
      ID_Usuario: reseña.ID_Usuario,
      ID_Album: reseña.ID_Album,
      Rating: reseña.Rating,
      Opinion: reseña.Opinion,
      MovimientoAuditoria: "ELIMINAR",
      UsuarioAuditoria: `Usuario ${reseña.ID_Usuario}`,
    });

    await reseña.destroy();

    return res.json({
      success: true,
      message: "🗑 Reseña eliminada correctamente",
    });
  } catch (err) {
    console.error("❌ Error al eliminar reseña:", err);
    return res.status(500).json({
      success: false,
      error: "Error interno al eliminar reseña",
      detalles: err.message,
    });
  }
};

// ============================
// Reseñas por Álbum
// ============================
const obtenerResenasPorAlbum = async (req, res) => {
  try {
    const { ID_Album } = req.params;
    const reseñas = await Resena.findAll({ where: { ID_Album } });

    res.json({
      success: true,
      reseñas,
    });
  } catch (err) {
    console.error("❌ Error al obtener reseñas por álbum:", err);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener reseñas por álbum" });
  }
};

// ============================
// Reseñas por Usuario
// ============================
const obtenerResenasPorUsuario = async (req, res) => {
  try {
    const { ID_Usuario } = req.params;
    const reseñas = await Resena.findAll({ where: { ID_Usuario } });

    res.json({
      success: true,
      reseñas,
    });
  } catch (err) {
    console.error("❌ Error al obtener reseñas por usuario:", err);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener reseñas por usuario" });
  }
};

module.exports = {
  crearResena,
  editarResena,
  eliminarResena,
  obtenerResenasPorAlbum,
  obtenerResenasPorUsuario,
};