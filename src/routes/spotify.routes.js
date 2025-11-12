// src/routes/spotify.routes.js
const express = require("express");
const router = express.Router();

// 📦 Importar controladores de Spotify
const { 
  buscarCancion, 
  buscarArtista, 
  buscarAlbum, 
  topCanciones,
  topArtistas,
  nuevosLanzamientos,
  buscarGeneral,
  topAlbums,
  nuevosLanzamientosAlbums
} = require("../controllers/spotify.controller");

/* ======================================================
   🎵 ENDPOINTS DE BÚSQUEDA
   ====================================================== */

// 🔎 Buscar canciones
router.get("/search", buscarCancion);

// 👩‍🎤 Buscar artistas
router.get("/artist", buscarArtista);

// 💿 Buscar álbumes
router.get("/album", buscarAlbum);

// 🔍 Búsqueda general (artista / álbum / canción)
router.get("/search/all", buscarGeneral);

/* ======================================================
   🏆 ENDPOINTS DE TENDENCIAS Y POPULARES
   ====================================================== */

// 🎧 Top canciones globales o por país
// Ejemplo: /api/spotify/top-tracks?country=MX
router.get("/top-tracks", topCanciones);

// 🌍 Top artistas globales o por género
// Ejemplo: /api/spotify/top-artists?genre=latin
router.get("/top-artists", topArtistas);

// 💿 Top álbumes globales o por país
// Ejemplo: /api/spotify/top-albums?country=MX
router.get("/top-albums", topAlbums);

/* ======================================================
   🆕 ENDPOINTS DE LANZAMIENTOS
   ====================================================== */

// 🎶 Nuevos lanzamientos (mezcla de álbumes y canciones)
router.get("/new-releases", nuevosLanzamientos);

// 💿 Nuevos lanzamientos de álbumes con año y artista
router.get("/new-releases/albums", nuevosLanzamientosAlbums);

/* ======================================================
   📦 EXPORTAR ROUTER
   ====================================================== */
module.exports = router;