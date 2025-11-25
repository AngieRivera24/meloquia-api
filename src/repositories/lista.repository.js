const Lista = require("../models/lista.model");
const ListaAlbum = require("../models/listaAlbum.model");
const Album = require("../models/album.model"); 
const { getAlbumIfNotExists } = require("../services/spotifyAlbum.service");

// Crear lista
async function crearLista({ ID_Usuario, Nombre, Descripcion }) {
  return await Lista.create({
    ID_Usuario,
    Nombre,
    Descripcion,
  });
}

// Obtener listas de un usuario
async function obtenerListasPorUsuario(ID_Usuario) {
  return await Lista.findAll({ where: { ID_Usuario } });
}

// Agregar álbum a lista
async function agregarAlbumALista(ID_Lista, ID_Album) {

  // 1️⃣ Asegurarse de que el álbum existe en T_Album
  await getAlbumIfNotExists(ID_Album);

  // 2️⃣ Ahora sí agregarlo a la lista
  return await ListaAlbum.create({
    ID_Lista,
    ID_Album,
  });
}

// Obtener álbumes dentro de una lista
async function obtenerAlbumsDeLista(ID_Lista) {
  return await ListaAlbum.findAll({
    where: { ID_Lista },
  });
}

// Eliminar álbum de una lista
async function eliminarAlbumDeLista(ID_Lista, ID_Album) {
  return await ListaAlbum.destroy({
    where: { ID_Lista, ID_Album },
  });
}

// Eliminar lista completa
async function eliminarLista(ID_Lista) {
  return await Lista.destroy({
    where: { ID_Lista },
  });
}

module.exports = {
  crearLista,
  obtenerListasPorUsuario,
  agregarAlbumALista,
  obtenerAlbumsDeLista,
  eliminarAlbumDeLista,
  eliminarLista,
};