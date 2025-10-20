const axios = require("axios");

// ======================================================
// 🔐 TOKEN DE AUTENTICACIÓN AUTOMÁTICO
// ======================================================
let cachedToken = null;
let tokenExpiration = 0;

async function getAccessToken() {
  const now = Date.now();

  if (cachedToken && now < tokenExpiration) return cachedToken;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  console.log("🎧 SPOTIFY CLIENT:", clientId ? "Cargado" : "No encontrado");
  console.log("🟢 Obteniendo token de Spotify...");

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiration = now + response.data.expires_in * 1000;

  console.log("✅ Nuevo token guardado correctamente.");
  return cachedToken;
}

// ======================================================
// 🎵 BUSCAR CANCIONES
// ======================================================
async function searchTrack(query) {
  const token = await getAccessToken();
  const response = await axios.get("https://api.spotify.com/v1/search", {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: "track", limit: 10 },
  });

  return response.data.tracks.items.map((t) => ({
    nombre: t.name,
    artista: t.artists.map((a) => a.name).join(", "),
    album: t.album.name,
    spotify_url: t.external_urls.spotify,
    preview_url: t.preview_url,
    imagen: t.album.images?.[0]?.url,
  }));
}

// ======================================================
// 👩‍🎤 BUSCAR ARTISTAS
// ======================================================
async function searchArtist(query) {
  const token = await getAccessToken();
  const response = await axios.get("https://api.spotify.com/v1/search", {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: "artist", limit: 10 },
  });

  return response.data.artists.items.map((a) => ({
    nombre: a.name,
    seguidores: a.followers.total,
    popularidad: a.popularity,
    generos: a.genres?.slice(0, 3),
    spotify_url: a.external_urls.spotify,
    imagen:
      a.images?.[0]?.url ||
      "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg",
  }));
}

// ======================================================
// 💿 BUSCAR ÁLBUMES
// ======================================================
async function searchAlbum(query) {
  const token = await getAccessToken();
  const response = await axios.get("https://api.spotify.com/v1/search", {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: "album", limit: 10 },
  });

  return response.data.albums.items.map((a) => ({
    nombre: a.name,
    artista: a.artists.map((x) => x.name).join(", "),
    spotify_url: a.external_urls.spotify,
    imagen: a.images?.[0]?.url,
  }));
}

// ======================================================
// 🏆 OBTENER CANCIONES POPULARES (FUNCIONA SIEMPRE)
// ======================================================
async function getTopTracks(country = "GLOBAL") {
  const token = await getAccessToken();

  try {
    // 🔍 Buscamos canciones populares globales o del país
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: "Top 50", // palabra clave que siempre devuelve canciones populares
        type: "track",
        market: country !== "GLOBAL" ? country : "US",
        limit: 10,
      },
    });

    // 📋 Mapeamos las canciones encontradas
    return response.data.tracks.items.map((t) => ({
      nombre: t.name,
      artista: t.artists.map((a) => a.name).join(", "),
      album: t.album.name,
      spotify_url: t.external_urls.spotify,
      preview_url: t.preview_url,
      imagen: t.album.images?.[0]?.url,
    }));
  } catch (err) {
    console.error("❌ Error al obtener top tracks:", err.response?.data || err.message);
    throw new Error("No se pudieron obtener las canciones más escuchadas desde Spotify");
  }
}

// ======================================================
// 🆕 NUEVOS LANZAMIENTOS (DINÁMICO Y CON FALLBACK)
// ======================================================
async function getNewReleases(country = "GLOBAL") {
  const token = await getAccessToken();

  try {
    const params = country !== "GLOBAL" ? { country, limit: 10 } : { limit: 10 };

    const response = await axios.get(
      "https://api.spotify.com/v1/browse/new-releases",
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );

    return response.data.albums.items.map((a) => ({
      nombre: a.name,
      artista: a.artists.map((x) => x.name).join(", "),
      spotify_url: a.external_urls.spotify,
      imagen: a.images?.[0]?.url,
    }));
  } catch (err) {
    console.error("❌ Error al obtener nuevos lanzamientos:", err.response?.data || err.message);

    // 🔁 Fallback: búsqueda general de álbumes recientes
    const fallback = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: "new album", type: "album", limit: 10 },
    });

    return fallback.data.albums.items.map((a) => ({
      nombre: a.name,
      artista: a.artists.map((x) => x.name).join(", "),
      spotify_url: a.external_urls.spotify,
      imagen: a.images?.[0]?.url,
    }));
  }
}

// ======================================================
// 🚀 EXPORTAR FUNCIONES
// ======================================================
module.exports = {
  getAccessToken,
  searchTrack,
  searchArtist,
  searchAlbum,
  getTopTracks,
  getNewReleases,
};