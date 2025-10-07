// src/index.js
const express = require('express');
require('dotenv').config();
const sequelize = require('./config/db');

// Rutas
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middlewares
app.use(express.json());

// Ruta raíz para probar que el servidor está vivo
app.get('/', (req, res) => {
  res.send('🚀 API de Meloquia corriendo en Azure');
});

// Rutas principales
app.use('/api/users', userRoutes);   // CRUD de usuarios
app.use('/api/auth', authRoutes);    // Registro y login

// Puerto (Azure inyecta uno automáticamente en process.env.PORT)
const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Verificar conexión con la BD
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL en Azure establecida con éxito');

    // Escuchar en todas las interfaces (0.0.0.0 es importante para Azure)
    app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    console.log('🌐 Disponible públicamente en Azure App Service');
  });
  } catch (error) {
    console.error('❌ Error al iniciar la app:', error);
  }
}

startServer();
