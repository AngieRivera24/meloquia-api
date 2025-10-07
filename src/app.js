// src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importar rutas de microservicios
const userRoutes = require('./routes/user.routes');
// Aquí más adelante podrás añadir authRoutes, albumRoutes, etc.

const app = express();

// Middleware globales
app.use(cors());             // Permite peticiones desde frontend
app.use(morgan('dev'));      // Logs de peticiones en consola
app.use(express.json());     // Parsear JSON en requests

// API Gateway: punto de entrada de rutas principales
app.use('/api/users', userRoutes);   // Microservicio de Usuarios
// app.use('/api/auth', authRoutes); //  Microservicio de Autenticación
// app.use('/api/albums', albumRoutes); //  Microservicio de Álbumes

// Ruta raíz: Healthcheck (útil para saber si la API está viva)
app.get('/', (req, res) => {
  res.json({ message: ' API Gateway de MELOQUIA funcionando' });
});

module.exports = app;
