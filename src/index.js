// src/index.js
require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db'); // 👈 Importamos la conexión MySQL

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    // Probar la conexión con MySQL
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos MySQL en Azure');

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar la app:', err);
    process.exit(1);
  }
})();