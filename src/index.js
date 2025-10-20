// src/index.js
const express = require('express');
require('dotenv').config();
const sequelize = require('./config/db');
const cors = require('cors');

// Rutas
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const spotifyRoutes = require('./routes/spotify.routes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('🚀 API de Meloquia corriendo en Azure');
});

// Rutas principales
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/spotify', spotifyRoutes);

// Puerto compatible con Azure
const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL en Azure establecida con éxito');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
      console.log('🌐 Disponible públicamente en Azure App Service');
    });
  } catch (error) {
    console.error('❌ Error al iniciar la app:', error);
  }
}

startServer();
