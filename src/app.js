// src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importar rutas
const authRoutes = require('./routes/auth.routes');   // Rutas con MongoDB (antiguas)
const userRoutes = require('./routes/user.routes');   // Rutas nuevas con MySQL

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas principales
app.use('/api/auth', authRoutes);   // MongoDB (temporal, mientras migras)
app.use('/api/users', userRoutes);  // MySQL (nuevo)

// Exportar la app
module.exports = app;