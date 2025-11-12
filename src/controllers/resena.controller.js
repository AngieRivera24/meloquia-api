// src/controllers/resena.controller.js
const Resena = require("../models/resena.model");
const ResenaAuditoria = require("../models/resenaAuditoria.model");
const { getAlbumIfNotExists } = require("../services/spotifyAlbum.service");

// ============================
// Crear Reseña
// ============================
const crearResena = async (req, res) => {
  try {
    const { ID_Usuario, ID_Album, Rating, Opinion } = req.body;

    if (!ID_Usuario || !ID_Album || !Rating) {
      return res.status(400).json({ success: false, error: "Faltan campos obligatorios" });
    }

    const album = await getAlbumIfNotExists(ID_Album);
    if (!album) return res.status(404).json({ success: false, error: "No se encontró el álbum en Spotify" });

    const nuevaResena = await Resena.create({
      ID_Usuario,
      ID_Album,
      Rating,
      Opinion,
    });

    await ResenaAuditoria.create({
      ID_reseña: nuevaResena.ID_reseña,
      ID_Usuario,
      ID_Album,
      Rating,
      Opinion,
      MovimientoAuditoria: "CREAR",
      UsuarioAuditoria: `Usuario ${ID_Usuario}`,
    });

    return res.status(201).json({
      success: true,
      message: "✅ Reseña creada",
      reseña: nuevaResena
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error interno al crear reseña", detalles: err.message });
  }
};

// ============================
// Editar Reseña
// ============================
const editarResena = async (req, res) => {
  try {
    const id = req.params.id;
    const { Rating, Opinion } = req.body;

    const reseña = await Resena.findByPk(id);
    if (!reseña) return res.status(404).json({ success: false, error: "Reseña no encontrada" });

    const reseñaAntigua = reseña.toJSON();

    reseña.Rating = Rating ?? reseña.Rating;
    reseña.Opinion = Opinion ?? reseña.Opinion;
    await reseña.save();

    await ResenaAuditoria.create({
      ID_reseña: id,
      ID_Usuario: reseña.ID_Usuario,
      ID_Album: reseña.ID_Album,
      Rating,
      Opinion,
      MovimientoAuditoria: "EDITAR",
      UsuarioAuditoria: `Usuario ${reseña.ID_Usuario}`,
      Antiguareseña: reseñaAntigua.Rating,
      Antiguaopinion: reseñaAntigua.Opinion
    });

    return res.json({ success: true, message: "✅ Reseña editada", reseña });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error interno al editar reseña", detalles: err.message });
  }
};

// ============================
// Eliminar Reseña
// ============================
const eliminarResena = async (req, res) => {
  try {
    const id = req.params.id;

    const reseña = await Resena.findByPk(id);
    if (!reseña) return res.status(404).json({ success: false, error: "Reseña no encontrada" });

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

    return res.json({ success: true, message: "🗑 Reseña eliminada" });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error al eliminar reseña", detalles: err.message });
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
      reseñas
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error al obtener reseñas por álbum" });
  }
};

// ============================
// Reseñas por Usuario (sugerido)
// ============================
const obtenerResenasPorUsuario = async (req, res) => {
  try {
    const { ID_Usuario } = req.params;
    const reseñas = await Resena.findAll({ where: { ID_Usuario } });

    res.json({
      success: true,
      reseñas
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error al obtener reseñas por usuario" });
  }
};

module.exports = { 
  crearResena, 
  editarResena, 
  eliminarResena,
  obtenerResenasPorAlbum,
  obtenerResenasPorUsuario
};