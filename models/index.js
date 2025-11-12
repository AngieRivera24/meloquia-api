// src/index.js
const express = require("express");
require("dotenv").config();
const sequelize = require("./config/db");
const cors = require("cors");

// Importación de rutas
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const spotifyRoutes = require("./routes/spotify.routes");
const resenaRoutes = require("./routes/resena.routes"); // ✅ Nueva ruta

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta base de prueba
app.get("/", (req, res) => {
  res.send("🚀 API de Meloquia corriendo correctamente");
});

// Registro de rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/spotify", spotifyRoutes);
app.use("/api/resenas", resenaRoutes); // ✅ Aquí se activa tu endpoint

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL establecida correctamente");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
}

startServer();