# Meloquia API 

Proyecto backend del sistema Meloquia, una plataforma para catalogar canciones y albumes.
Desarrollado como parte del curso "Administracion de Proyectos de Computacion" en la Facultad de Informatica (UAQ).

## Tecnologias utilizadas
- Node.js
- Express.js
- Sequelize ORM
- MySQL (Azure Database)
- JWT para autenticacion
- Azure App Service (Despliegue)

## Endpoints principales
| Metodo | Endpoint | Descripcion | Body esperado |
|--------|-----------|--------------|----------------|
| POST | /api/auth/register | Registra un usuario nuevo | { "Usuario": "...", "Nombre": "...", "Correo": "...", "contrasena": "...", "Edad": 25, "Descripcion": "..." } |
| POST | /api/auth/login | Inicia sesion y devuelve un token JWT | { "Correo": "...", "contrasena": "..." } |
| GET | /api/users | Lista todos los usuarios registrados | _No requiere body_ |

## Scrum Team
| Nombre | Rol | Responsabilidad |
|---------|-----|----------------|
| Angie Rivera Morgado | Backend Developer | API REST, Azure, MySQL |
| Diego | Frontend Developer | Interfaz y pruebas |
| Edgar | Documentation and QA | Manuales, evidencias |

URL del proyecto en Azure:
https://meloquia-api-bpadcyajdwgcbpgn.canadacentral-01.azurewebsites.net/
