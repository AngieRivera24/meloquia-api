// src/services/spotifyAlbum.service.js
const axios = require("axios");
const { getAccessToken } = require("./spotify.service");

/**
 * Obtiene datos del álbum desde Spotify usando su ID.
 */
async function getAlbumById(albumId) {
  try {
    const token = await getAccessToken();
    const url = `https://api.spotify.com/v1/albums/${albumId}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const a = response.data;

    return {
      id: a.id,
      nombre: a.name,
      artista: a.artists.map(x => x.name).join(", "),
      año: a.release_date?.substring(0, 4),
      portada: a.images?.[0]?.url
    };

  } catch (err) {
    console.error("❌ Error en getAlbumById Spotify:", {
    status: err.response?.status,
    data: err.response?.data,
    message: err.message
  });
  return null;
  }
}

/**
 * Simple helper para nuestro backend:
 * - Siempre intenta obtener el álbum desde Spotify.
 * - No guarda nada aún (eso lo hará después cuando Aldo ajuste la BD).
 */
async function getAlbumIfNotExists(ID_Album) {
  return await getAlbumById(ID_Album);
}

module.exports = { getAlbumIfNotExists, getAlbumById };