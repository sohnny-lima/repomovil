# Repomovil Project

Este proyecto consiste en una aplicación móvil para gestionar y visualizar recursos (videos, archivos) organizados por categorías. El sistema utiliza una arquitectura cliente-servidor con un backend en Node.js y una aplicación móvil en React Native (Expo).

## Estructura del Proyecto

El repositorio está organizado como un monorepo:

- **`/backend`**: Servidor API RESTful construido con Express y Prisma ORM.
- **`/frontend`**: Aplicación móvil construida con React Native y Expo.

## Backend

El backend gestiona la autenticación de administradores y el CRUD (Crear, Leer, Actualizar, Borrar) de Categorías e Ítems.

### Tecnologías
- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Zod

### Modelos de Datos (Prisma)
- **AdminUser**: Usuarios administradores (Email, Password, Rol).
- **Category**: Categorías de recursos (Nombre, Descripción, Activo).
- **Item**: Recursos individuales (Youtube, Drive, OneDrive) vinculados a una categoría.

### Scripts
Desde el directorio `backend`:
- `npm run dev`: Inicia el servidor en modo desarrollo (con nodemon).
- `npm start`: Inicia el servidor en modo producción.
- `npm run prisma:studio`: Abre la interfaz visual de Prisma para gestionar la base de datos.
- `npx prisma migrate dev`: Ejecuta migraciones de base de datos.

## Frontend

La aplicación móvil es el cliente que consume la API del backend.

### Tecnologías
- **Framework**: React Native
- **Herramienta de Build**: Expo
- **Estilos**: (Pendiente de definir, actualmente React Native StyleSheet)

### Scripts
Desde el directorio `frontend`:
- `npm start` / `npx expo start`: Inicia el servidor de desarrollo de Expo.
- `npm run android`: Inicia en emulador Android.
- `npm run ios`: Inicia en simulador iOS.
- `npm run web`: Inicia versión web.

## Configuración Inicial

### Requisitos Previos
- Node.js instalado.
- PostgreSQL instalado y corriendo.

### Pasos para Ejecutar

1. **Configurar Backend**:
   ```bash
   cd backend
   npm install
   # Crear archivo .env basado en la configuración necesaria (DATABASE_URL, JWT_SECRET, etc.)
   npx prisma migrate dev --name init # Para inicializar la base de datos
   npm run dev
   ```

2. **Configurar Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Estado Actual
- **Backend**: Estructura base implementada, modelos definidos, rutas configuradas.
- **Frontend**: Proyecto inicializado (Hello World), pendiente de implementación de pantallas y lógica.
