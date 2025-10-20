# MELOQUIA API  
![Node.js](https://img.shields.io/badge/Node.js-20.x-brightgreen?logo=node.js)  
![Azure](https://img.shields.io/badge/Deployed%20on-Azure-blue?logo=microsoft-azure)  
![Spotify API](https://img.shields.io/badge/Integration-Spotify-green?logo=spotify)  
![Status](https://img.shields.io/badge/Sprint-4%20Completed-success)

---

## Descripción general  
**Meloquia API** es una aplicación backend desarrollada con **Node.js**, **Express** y **MySQL**, desplegada en **Azure App Service**.  
Su objetivo es ofrecer un punto centralizado para la gestión y consumo de datos musicales, incluyendo integración con la **API de Spotify** para obtener artistas, álbumes y canciones populares.

---

## Tecnologías principales
- **Node.js (v20 LTS)**
- **Express.js**
- **Sequelize ORM**
- **MySQL (Azure Database)**
- **Spotify Web API**
- **Azure App Service**

---

## Despliegue en Azure
 **API pública:**  
 https://meloquia-api.azurewebsites.net  

Ejemplo de endpoint:  
```bash
https://meloquia-api.azurewebsites.net/api/spotify/top-artists

## Estructura principal del proyecto 
MELOQUIA/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── spotify.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── spotify.routes.js
│   ├── services/
│   │   └── spotify.service.js
│   └── models/
│       └── index.js
├── config/
│   └── database.js
├── .env.example
└── README.md


