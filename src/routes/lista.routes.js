const express = require("express");
const router = express.Router();

const {
  crearLista,
  obtenerListasPorUsuario,
  agregarAlbumALista,
  obtenerAlbumsDeLista,
  eliminarAlbumDeLista,
  eliminarLista,
} = require("../controllers/lista.controller");

// Crear lista
router.post("/", crearLista);

// Listas de un usuario
router.get("/usuario/:id", obtenerListasPorUsuario);

// Agregar álbum a lista
router.post("/:id/albums", agregarAlbumALista);

// Obtener álbumes de una lista
router.get("/:id/albums", obtenerAlbumsDeLista);

// Eliminar álbum de lista
router.delete("/:idLista/albums/:idAlbum", eliminarAlbumDeLista);

// Eliminar una lista completa
router.delete("/:id", eliminarLista);

module.exports = router;