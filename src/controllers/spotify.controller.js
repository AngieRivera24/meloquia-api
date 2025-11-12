// src/controllers/spotify.controller.js
const axios = require("axios");
const {
  searchTrack,
  searchArtist,
  searchAlbum,
  getTopTracks,
  getNewReleases,
  getAccessToken,
  searchGeneral,
  getTopAlbums,
  getNewAlbumReleases
} = require("../services/spotify.service");

/* ======================================================
   🎵 BÚSQUEDAS INDIVIDUALES
   ====================================================== */

// 🎧 Buscar canciones
exports.buscarCancion = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q)
      return res
        .status(400)
        .json({ error: "Debes enviar el parámetro 'q' en la búsqueda." });

    const resultados = await searchTrack(q);
    res.json({ resultados });
  } catch (err) {
    console.error("❌ Error en /search:", err.message);
    res.status(500).json({ error: "Error al buscar canciones en Spotify" });
  }
};

// 👩‍🎤 Buscar artistas
exports.buscarArtista = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q)
      return res
        .status(400)
        .json({ error: "Debes enviar el parámetro 'q' en la búsqueda." });

    const resultados = await searchArtist(q);
    res.json({ resultados });
  } catch (err) {
    console.error("❌ Error en /artist:", err.message);
    res.status(500).json({ error: "Error al buscar artistas en Spotify" });
  }
};

// 💿 Buscar álbumes
exports.buscarAlbum = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q)
      return res
        .status(400)
        .json({ error: "Debes enviar el parámetro 'q' en la búsqueda." });

    const resultados = await searchAlbum(q);
    res.json({ resultados });
  } catch (err) {
    console.error("❌ Error en /album:", err.message);
    res.status(500).json({ error: "Error al buscar álbumes en Spotify" });
  }
};

// 🔍 Buscar general (artistas, canciones y álbumes en un solo endpoint)
exports.buscarGeneral = async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q)
      return res
        .status(400)
        .json({ error: "Debes enviar el parámetro 'q' en la búsqueda." });

    const resultados = await searchGeneral(q, type);
    res.json({ resultados });
  } catch (err) {
    console.error("❌ Error en /search/all:", err.message);
    res.status(500).json({ error: "Error al realizar búsqueda general en Spotify" });
  }
};

/* ======================================================
   🏆 TOP CANCIONES Y ARTISTAS
   ====================================================== */

// 🏆 Top canciones globales o por país
exports.topCanciones = async (req, res) => {
  try {
    const { country } = req.query; // Ejemplo: ?country=MX
    const resultados = await getTopTracks(country);
    res.json({ resultados });
  } catch (err) {
    console.error("❌ Error en /top-tracks:", err.message);
    res.status(500).json({ error: "Error al obtener canciones populares" });
  }
};

// 🌍 Top artistas por género (o globales)
exports.topArtistas = async (req, res) => {
  try {
    const { genre = "latin" } = req.query; // Género por defecto
    const token = await getAccessToken();

    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: `genre:${genre}`, type: "artist", limit: 10 },
    });

    const artistas = response.data.artists.items.map((a) => ({
      nombre: a.name,
      seguidores: a.followers?.total,
      popularidad: a.popularity,
      generos: a.genres?.slice(0, 3),
      spotify_url: a.external_urls.spotify,
      imagen:
        a.images?.[0]?.url ||
        "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg",
    }));

    res.json({ resultados: artistas });
  } catch (err) {
    console.error("❌ Error en /top-artists:", err.message);
    res.status(500).json({ error: "No se pudieron obtener los artistas desde Spotify." });
  }
};

/* ======================================================
   💿 TOP ÁLBUMES Y LANZAMIENTOS
   ====================================================== */

// 💿 Top álbumes globales o por país
exports.topAlbums = async (req, res) => {
  try {
    const { country } = req.query; // Ejemplo: ?country=MX
    const resultados = await getTopAlbums(country);
    res.json({ resultados });
  } catch (err) {
    console.error("❌ Error en /top-albums:", err.message);
    res.status(500).json({ error: "Error al obtener los top álbumes" });
  }
};

// 🆕 Nuevos lanzamientos (mezcla de álbumes y canciones)
exports.nuevosLanzamientos = async (req, res) => {
  try {
    const resultados = await getNewReleases();
    res.json({ resultados });
  } catch (err) {
    console.error("❌ Error en /new-releases:", err.message);
    res.status(500).json({ error: "Error al obtener nuevos lanzamientos" });
  }
};

// 🆕 Nuevos lanzamientos de álbumes (detallado)
exports.nuevosLanzamientosAlbums = async (req, res) => {
  try {
    const resultados = await getNewAlbumReleases();
    res.json({ resultados });
  } catch (err) {
    console.error("❌ Error en /new-releases/albums:", err.message);
    res.status(500).json({ error: "Error al obtener nuevos lanzamientos de álbumes" });
  }
};

/* ======================================================
   🎶 DETALLES DE UN ÁLBUM
   ====================================================== */

// 📀 Obtener detalles de un álbum desde Spotify por su ID
exports.detallesAlbum = async (req, res) => {
  try {
    const albumId = req.query.id;
    if (!albumId) {
      return res
        .status(400)
        .json({ success: false, error: "Falta el parámetro 'id' del álbum." });
    }

    const token = await getAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const album = response.data;

    // Estructurar los datos que regresaremos
    const info = {
      id: album.id,
      nombre: album.name,
      artista: album.artists.map((a) => a.name).join(", "),
      imagen: album.images?.[0]?.url || null,
      totalCanciones: album.total_tracks,
      fechaLanzamiento: album.release_date,
      urlSpotify: album.external_urls.spotify,
    };

    return res.json({
      success: true,
      album: info,
    });
  } catch (err) {
    console.error("❌ Error al obtener detalles del álbum:", err.message);
    return res.status(500).json({
      success: false,
      error: "Error al obtener los detalles del álbum desde Spotify",
    });
  }
};