// src/controllers/lista.controller.js
const listaRepository = require("../repositories/lista.repository");

// =====================================================
// 📝 Crear nueva lista
// POST /api/listas
// =====================================================
exports.crearLista = async (req, res) => {
  try {
    const { ID_Usuario, Nombre, Descripcion } = req.body;

    if (!ID_Usuario || !Nombre) {
      return res.status(400).json({
        success: false,
        message: "ID_Usuario y Nombre son obligatorios",
      });
    }

    const lista = await listaRepository.crearLista({
      ID_Usuario,
      Nombre,
      Descripcion,
    });

    return res.status(201).json({
      success: true,
      message: "Lista creada correctamente",
      lista,
    });
  } catch (err) {
    console.error("❌ Error al crear lista:", err);
    return res.status(500).json({
      success: false,
      error: "Error al crear la lista",
      detalles: err.message,
    });
  }
};

// =====================================================
// 📂 Obtener listas de un usuario
// GET /api/listas/usuario/:id
// =====================================================
exports.obtenerListasPorUsuario = async (req, res) => {
  try {
    const ID_Usuario = req.params.id;
    const listas = await listaRepository.obtenerListasPorUsuario(ID_Usuario);

    return res.json({ success: true, listas });
  } catch (err) {
    console.error("❌ Error al obtener listas:", err);
    return res.status(500).json({
      success: false,
      error: "Error al obtener listas",
      detalles: err.message,
    });
  }
};

// =====================================================
// 🎧 Agregar álbum a una lista
// POST /api/listas/:id/albums
// Body: { "ID_Album": "spotifyAlbumId" }
// =====================================================
exports.agregarAlbumALista = async (req, res) => {
  try {
    const ID_Lista = req.params.id;     // viene de la URL
    const { ID_Album } = req.body;      // viene del body

    if (!ID_Album) {
      return res.status(400).json({
        success: false,
        error: "ID_Album es obligatorio",
      });
    }

    const creado = await listaRepository.agregarAlbumALista(ID_Lista, ID_Album);

    return res.status(201).json({
      success: true,
      message: "Álbum agregado a la lista",
      creado,
    });
  } catch (err) {
    console.error("❌ Error al agregar álbum:", err);
    return res.status(500).json({
      success: false,
      error: "Error al agregar álbum a la lista",
      detalles: err.message,
      sql: err.sql || null,
    });
  }
};

// =====================================================
// 📀 Obtener álbumes de una lista
// GET /api/listas/:id/albums
// =====================================================
exports.obtenerAlbumsDeLista = async (req, res) => {
  try {
    const ID_Lista = req.params.id;
    const albums = await listaRepository.obtenerAlbumsDeLista(ID_Lista);

    return res.json({ success: true, albums });
  } catch (err) {
    console.error("❌ Error al obtener álbumes de lista:", err);
    return res.status(500).json({
      success: false,
      error: "Error al obtener álbumes de la lista",
      detalles: err.message,
    });
  }
};

// =====================================================
// 🗑 Eliminar un álbum de una lista
// DELETE /api/listas/:idLista/albums/:idAlbum
// =====================================================
exports.eliminarAlbumDeLista = async (req, res) => {
  try {
    const { idLista, idAlbum } = req.params;

    await listaRepository.eliminarAlbumDeLista(idLista, idAlbum);

    return res.json({
      success: true,
      message: "Álbum eliminado de la lista",
    });
  } catch (err) {
    console.error("❌ Error al eliminar álbum de lista:", err);
    return res.status(500).json({
      success: false,
      error: "Error al eliminar álbum de la lista",
      detalles: err.message,
    });
  }
};

// =====================================================
// 🗑 Eliminar una lista completa
// DELETE /api/listas/:id
// =====================================================
exports.eliminarLista = async (req, res) => {
  try {
    const ID_Lista = req.params.id;

    await listaRepository.eliminarLista(ID_Lista);

    return res.json({
      success: true,
      message: "Lista eliminada correctamente",
    });
  } catch (err) {
    console.error("❌ Error al eliminar lista:", err);
    return res.status(500).json({
      success: false,
      error: "Error al eliminar lista",
      detalles: err.message,
    });
  }
};

// 👇 MUY IMPORTANTE: exportar todas las funciones
module.exports = {
  crearLista: exports.crearLista,
  obtenerListasPorUsuario: exports.obtenerListasPorUsuario,
  agregarAlbumALista: exports.agregarAlbumALista,
  obtenerAlbumsDeLista: exports.obtenerAlbumsDeLista,
  eliminarAlbumDeLista: exports.eliminarAlbumDeLista,
  eliminarLista: exports.eliminarLista,
};