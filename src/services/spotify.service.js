// src/services/spotify.service.js
const axios = require("axios");

/* ======================================================
   🔐 AUTENTICACIÓN AUTOMÁTICA DE SPOTIFY
   ====================================================== */
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

  console.log("✅ Token de Spotify obtenido correctamente.");
  return cachedToken;
}

/* ======================================================
   🎵 BÚSQUEDAS EN SPOTIFY
   ====================================================== */

// 🔎 Buscar canciones
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
    año: t.album.release_date?.substring(0, 4),
    spotify_url: t.external_urls.spotify,
    preview_url: t.preview_url,
    imagen: t.album.images?.[0]?.url,
  }));
}

// 👩‍🎤 Buscar artistas
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

// 💿 Buscar álbumes
async function searchAlbum(query) {
  const token = await getAccessToken();
  const response = await axios.get("https://api.spotify.com/v1/search", {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: "album", limit: 10 },
  });

  return response.data.albums.items.map((a) => ({
    nombre: a.name,
    artista: a.artists.map((x) => x.name).join(", "),
    año: a.release_date?.substring(0, 4),
    spotify_url: a.external_urls.spotify,
    imagen: a.images?.[0]?.url,
  }));
}

/* ======================================================
   🏆 TOP CANCIONES Y ARTISTAS
   ====================================================== */

// 🏆 Canciones más populares (por país o global)
async function getTopTracks(country = "GLOBAL") {
  const token = await getAccessToken();

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: "Top 50",
        type: "track",
        market: country !== "GLOBAL" ? country : "US",
        limit: 10,
      },
    });

    return response.data.tracks.items.map((t) => ({
      nombre: t.name,
      artista: t.artists.map((a) => a.name).join(", "),
      album: t.album.name,
      año: t.album.release_date?.substring(0, 4),
      spotify_url: t.external_urls.spotify,
      preview_url: t.preview_url,
      imagen: t.album.images?.[0]?.url,
    }));
  } catch (err) {
    console.error("❌ Error al obtener top tracks:", err.response?.data || err.message);
    throw new Error("No se pudieron obtener las canciones más escuchadas desde Spotify");
  }
}

/* ======================================================
   🆕 NUEVOS LANZAMIENTOS (MIX DE ÁLBUMES Y CANCIONES)
   ====================================================== */
async function getNewReleases(country = "GLOBAL") {
  const token = await getAccessToken();

  try {
    const params =
      country !== "GLOBAL" ? { country, limit: 10 } : { limit: 10 };

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
      año: a.release_date?.substring(0, 4),
      spotify_url: a.external_urls.spotify,
      imagen: a.images?.[0]?.url,
    }));
  } catch (err) {
    console.error("❌ Error al obtener nuevos lanzamientos:", err.response?.data || err.message);

    // Fallback de emergencia
    const fallback = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: "new album", type: "album", limit: 10 },
    });

    return fallback.data.albums.items.map((a) => ({
      nombre: a.name,
      artista: a.artists.map((x) => x.name).join(", "),
      año: a.release_date?.substring(0, 4),
      spotify_url: a.external_urls.spotify,
      imagen: a.images?.[0]?.url,
    }));
  }
}

/* ======================================================
   💿 TOP ÁLBUMES GLOBAL/PAÍS (ROBUSTO)
   ====================================================== */
async function getTopAlbums(country = "GLOBAL") {
  const token = await getAccessToken();

  const market = country && country !== "GLOBAL" ? country.toUpperCase() : "US";
  const countryName =
    country?.toUpperCase() === "MX"
      ? "Mexico"
      : country?.toUpperCase() === "US"
      ? "USA"
      : "Global";

  const posiblesTitulos = [
    `Top 50 - ${countryName}`,
    `Top 50 ${countryName}`,
    `Éxitos ${countryName}`,
    "Top 50 - Latin",
    "Top 50 - Global",
    "Today's Top Hits",
  ];

  async function findPlaylistId() {
    for (const titulo of posiblesTitulos) {
      try {
        const resp = await axios.get("https://api.spotify.com/v1/search", {
          headers: { Authorization: `Bearer ${token}` },
          params: { q: titulo, type: "playlist", limit: 5, market },
        });

        const playlist = resp.data.playlists?.items?.[0];
        if (playlist) {
          console.log(`🎯 Playlist encontrada: ${playlist.name}`);
          return playlist.id;
        }
      } catch (err) {
        console.warn(`⚠️ No se encontró playlist: ${titulo}`);
      }
    }
    return null;
  }

  let playlistId = await findPlaylistId();
  if (!playlistId) {
    console.warn("⚠️ No se encontró playlist específica; usando búsqueda global genérica.");
    return await fallbackAlbumsSearch(token, market);
  }

  try {
    const plResp = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { market },
    });

    const items = plResp.data.tracks?.items || [];
    if (!items.length) {
      console.warn("⚠️ Playlist vacía o no accesible, usando fallback.");
      return await fallbackAlbumsSearch(token, market);
    }

    const albumMap = new Map();
    for (const it of items) {
      const track = it.track;
      if (!track || !track.album) continue;
      const album = track.album;
      const albumId = album.id || album.uri;
      if (!albumMap.has(albumId)) {
        albumMap.set(albumId, {
          album: album.name,
          artista: track.artists.map((a) => a.name).join(", "),
          año: album.release_date?.substring(0, 4),
          url: album.external_urls.spotify,
          imagen: album.images?.[0]?.url,
        });
      }
    }

    const resultado = Array.from(albumMap.values()).slice(0, 20);
    if (!resultado.length) {
      console.warn("⚠️ Playlist vacía, usando fallback de búsqueda.");
      return await fallbackAlbumsSearch(token, market);
    }

    return resultado;
  } catch (err) {
    console.error("❌ Error al obtener playlist:", err.response?.status, err.response?.data);
    return await fallbackAlbumsSearch(token, market);
  }
}

// 🔁 Fallback para Top Albums
async function fallbackAlbumsSearch(token, market) {
  console.log("🔁 Usando fallback: búsqueda genérica de 'Top albums'.");
  const resp = await axios.get("https://api.spotify.com/v1/search", {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: "Top albums", type: "album", limit: 10, market },
  });

  return resp.data.albums.items.map((a) => ({
    album: a.name,
    artista: a.artists.map((b) => b.name).join(", "),
    año: a.release_date?.substring(0, 4),
    url: a.external_urls.spotify,
    imagen: a.images?.[0]?.url,
  }));
}

/* ======================================================
   🆕 NUEVOS LANZAMIENTOS DE ÁLBUMES (ROBUSTO)
   ====================================================== */
async function getNewAlbumReleases(country = "GLOBAL") {
  const token = await getAccessToken();

  try {
    const params =
      country && country !== "GLOBAL"
        ? { limit: 20, country: country.toUpperCase() }
        : { limit: 20 };

    const response = await axios.get(
      "https://api.spotify.com/v1/browse/new-releases",
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );

    if (!response.data.albums?.items?.length) {
      console.warn("⚠️ No se encontraron lanzamientos en este país. Usando fallback...");
      return await fallbackNewAlbums(token);
    }

    const albums = response.data.albums.items.map((a) => ({
      nombre: a.name,
      artista: a.artists.map((b) => b.name).join(", "),
      año: a.release_date?.substring(0, 4),
      total_canciones: a.total_tracks,
      url: a.external_urls.spotify,
      imagen: a.images?.[0]?.url,
    }));

    console.log(`✅ Nuevos lanzamientos obtenidos (${albums.length})`);
    return albums;
  } catch (err) {
    console.error("❌ Error en getNewAlbumReleases:", err.response?.data || err.message);
    return await fallbackNewAlbums(token);
  }
}

// 🔁 Fallback: búsqueda genérica “new albums”
async function fallbackNewAlbums(token) {
  console.log("🔁 Usando fallback de búsqueda: 'new albums'");
  const resp = await axios.get("https://api.spotify.com/v1/search", {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: "new albums", type: "album", limit: 10 },
  });

  return resp.data.albums.items.map((a) => ({
    nombre: a.name,
    artista: a.artists.map((b) => b.name).join(", "),
    año: a.release_date?.substring(0, 4),
    url: a.external_urls.spotify,
    imagen: a.images?.[0]?.url,
  }));
}

/* ======================================================
   💿 OBTENER ÁLBUM POR ID (USADO EN RESEÑAS)
   ====================================================== */
async function getAlbumById(albumId) {
  try {
    const token = await getAccessToken();

    const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const a = response.data;

    return {
      id: a.id,
      nombre: a.name,
      artista: a.artists.map((x) => x.name).join(", "),
      año: a.release_date?.substring(0, 4),
      portada: a.images?.[0]?.url || null
    };

  } catch (err) {
    console.error("❌ Error en getAlbumById:", err.response?.data || err.message);
    return null;
  }
}


/* ======================================================
   🚀 EXPORTAR FUNCIONES
   ====================================================== */
module.exports = {
  getAccessToken,
  searchTrack,
  searchArtist,
  searchAlbum,
  getTopTracks,
  getNewReleases,
  getTopAlbums,
  getNewAlbumReleases,
  getAlbumById, // ✅ NUEVO
};