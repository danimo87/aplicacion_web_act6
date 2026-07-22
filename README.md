# Aplicación Web ACT6

Aplicación web full-stack para la gestión de libros, préstamos, reservas, usuarios, reportes y configuración del sistema.

## Tecnologías

- Backend: NestJS + TypeORM + SQLite
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Contenedores: Docker Compose

## Requisitos

- Node.js 18 o superior
- npm
- Docker y Docker Compose (opcional, para ejecutar con contenedores)

## Estructura del proyecto

- backend_app/: backend NestJS
- backend_app/frontend/: frontend React/Vite
- docker-compose.yml: configuración para levantar la aplicación con Docker

## Ejecutar localmente

### 1. Backend

```bash
cd backend_app
npm install
npm run start:dev
```

El backend quedará disponible en:
- http://localhost:3000

### 2. Frontend

```bash
cd backend_app/frontend
npm install
npm run dev
```

El frontend quedará disponible en:
- http://localhost:5173

## Ejecutar con Docker

```bash
docker compose up --build
```

## Funcionalidades principales

- Registro e inicio de sesión de usuarios
- Gestión de libros
- Gestión de préstamos
- Gestión de reservas
- Reportes del sistema
- Configuración general

## Notas

Este proyecto ya fue probado localmente en el entorno actual y está listo para ser compartido en GitHub.
