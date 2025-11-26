// src/index.js
const express = require("express");
require("dotenv").config();
const sequelize = require("./config/db");
const cors = require("cors");

// Rutas
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const spotifyRoutes = require("./routes/spotify.routes");
const resenaRoutes = require("./routes/resena.routes");
const likeRoutes = require("./routes/like.routes");
const comentarioRoutes = require("./routes/comentario.routes");

const app = express();

/* ============================================
   🧩 MIDDLEWARES PRINCIPALES
   ============================================ */

// 🔓 Permitir solicitudes desde el frontend (meloquia.site)
app.use(cors({
  origin: ["https://meloquia.site", "https://www.meloquia.site", "*"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 🧠 Permitir parseo de JSON y formularios
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ============================================
   🚀 RUTA DE PRUEBA
   ============================================ */
app.get("/", (req, res) => {
  res.send("🚀 API de Meloquia corriendo correctamente en Azure");
});

/* ============================================
   🧭 RUTAS PRINCIPALES
   ============================================ */
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/spotify", spotifyRoutes);
app.use("/api/resenas", resenaRoutes);
app.use("/api/listas", require("./routes/lista.routes"));
app.use("/api/likes", likeRoutes);
app.use("/api/comentarios", comentarioRoutes);

/* ============================================
   ⚙️ INICIO DEL SERVIDOR
   ============================================ */
const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL lista");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🌍 Servidor corriendo en: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error iniciando servidor:", err);
  }
}

startServer(); 