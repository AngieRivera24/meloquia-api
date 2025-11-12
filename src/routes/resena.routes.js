const express = require("express");
const router = express.Router();
const {
  crearResena,
  editarResena,
  eliminarResena,
  obtenerResenasPorAlbum,
  obtenerResenasPorUsuario
} = require("../controllers/resena.controller");

router.post("/", crearResena);
router.put("/:id", editarResena);
router.delete("/:id", eliminarResena);
router.get("/album/:ID_Album", obtenerResenasPorAlbum);
router.get("/usuario/:ID_Usuario", obtenerResenasPorUsuario);

module.exports = router;
