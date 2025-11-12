// src/index.js
const express = require("express");
require("dotenv").config();
const sequelize = require("./config/db");
const cors = require("cors");

// Rutas
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const spotifyRoutes = require("./routes/spotify.routes");
const resenaRoutes = require("./routes/resena.routes"); // ✅ ESTA ES LA NUEVA

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 API de Meloquia corriendo correctamente");
});

// Registrar rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/spotify", spotifyRoutes);
app.use("/api/resenas", resenaRoutes); // ✅ ESTA LÍNEA EXPONE EL ENDPOINT

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