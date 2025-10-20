const express = require("express");
const router = express.Router();
const { 
    buscarCancion, 
    buscarArtista, 
    buscarAlbum, 
    topCanciones,
    topArtistas,
    nuevosLanzamientos
} = require("../controllers/spotify.controller");

// 🎵 Buscar canciones
router.get("/search", buscarCancion);

// 👩‍🎤 Buscar artistas
router.get("/artist", buscarArtista);

// 💿 Buscar álbumes
router.get("/album", buscarAlbum);

// 🏆 Top canciones globales o por país
router.get("/top-tracks", topCanciones);

// 🌍 Top artistas globales o por país
router.get("/top-artists", topArtistas);

// 🆕 Nuevos lanzamientos
router.get("/new-releases", nuevosLanzamientos);

module.exports = router;