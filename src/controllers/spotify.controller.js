const axios = require("axios");
const {
  searchTrack,
  searchArtist,
  searchAlbum,
  getTopTracks,
  getNewReleases,
  getAccessToken,
} = require("../services/spotify.service");

// 🎵 Buscar canciones
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
    console.error("❌ Error en /search:", err);
    res.status(500).json({ error: err.message });
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
    console.error("❌ Error en /artist:", err);
    res.status(500).json({ error: err.message });
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
    console.error("❌ Error en /album:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🏆 Top canciones globales o por país (dinámico)
exports.topCanciones = async (req, res) => {
  try {
    const { country } = req.query; // ejemplo: ?country=MX
    const resultados = await getTopTracks(country);
    res.json({ resultados });
  } catch (err) {
    console.error("❌ Error en /top-tracks:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
};

// 🌍 Top artistas populares (dinámico por género)
exports.topArtistas = async (req, res) => {
  try {
    const { genre = "latin" } = req.query; // Puedes cambiar el género por parámetro
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

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ resultados: artistas }));
  } catch (err) {
    console.error("❌ Error en /top-artists dinámico:");
    if (err.response) {
      console.error("📡 STATUS:", err.response.status);
      console.error("📜 DATA:", err.response.data);
    } else if (err.request) {
      console.error("📨 REQUEST sin respuesta:", err.request);
    } else {
      console.error("⚙️ ERROR:", err.message);
    }
    res
      .status(500)
      .json({ error: "No se pudieron obtener los artistas desde Spotify." });
  }
};

// 🆕 Nuevos lanzamientos (por país, ej. MX)
exports.nuevosLanzamientos = async (req, res) => {
  try {
    const resultados = await getNewReleases();
    res.json({ resultados });
  } catch (err) {
    console.error("❌ Error en /new-releases:", err);
    res.status(500).json({ error: err.message });
  }
};