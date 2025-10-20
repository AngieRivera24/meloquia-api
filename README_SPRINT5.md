# 🏁 Sprint 5 — Meloquia API

## 🎯 Objetivo general
Ampliar las funcionalidades de la API **Meloquia** integrando tareas asíncronas, generación de reportes, y pipelines de despliegue continuo (CI/CD), consolidando la arquitectura final del proyecto.

---

## 🧩 Objetivos específicos

- 🔔 Implementar **notificaciones o procesos asíncronos** (Node Schedule, colas, o eventos).  
- 📊 Generar un **reporte estadístico** (ej. canciones más consultadas, artistas más buscados).  
- 💾 Optimizar la base de datos: agregar índices o vistas si aplica.  
- 🧪 Crear **pruebas unitarias y de integración** con Jest o Supertest.  
- ⚙️ Configurar un flujo básico de **CI/CD** (Azure Pipelines o GitHub Actions).  
- 🧠 Mejorar documentación y manejo de errores en la API.  

---

## 🧱 Entregables

| Tipo | Descripción | Estado |
|------|--------------|--------|
| Código | Módulo de notificaciones o tareas asíncronas | ☐ |
| Código | Reporte de estadísticas con endpoint `/api/spotify/stats` | ☐ |
| Código | Pruebas unitarias para controladores principales | ☐ |
| Infraestructura | Pipeline CI/CD automatizado en GitHub Actions o Azure | ☐ |
| Documentación | README Sprint 5 con evidencias | ☐ |

---

## 🧠 Herramientas sugeridas

| Propósito | Herramienta | Descripción |
|------------|--------------|-------------|
| Tareas programadas | `node-cron` o `node-schedule` | Ejecutar procesos automáticos |
| Testing | `jest`, `supertest` | Pruebas unitarias y de endpoints |
| CI/CD | `GitHub Actions` / `Azure Pipelines` | Automatizar el despliegue |
| Análisis de rendimiento | `morgan`, `winston` | Logs y monitoreo |

---

## 🧩 Ejemplo de endpoint de reporte
```bash
GET /api/spotify/stats

# Respuesta ejemplo:
{
  "artistas_populares": ["Bad Bunny", "Peso Pluma", "Rauw Alejandro"],
  "canciones_mas_solicitadas": ["Un Preview", "Lady Gaga", "Luna"]
}
