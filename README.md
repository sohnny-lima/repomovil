# Repomovil

> **Aplicación móvil para gestión y visualización de recursos educativos organizados por categorías**

Sistema completo de gestión de contenido educativo para "Mayordomía 2026 - Unión Peruana del Sur" con panel de administración y aplicación móvil multiplataforma.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

---

## 📋 Características Principales

- ✅ **Gestión de Categorías**: Crear, editar y eliminar categorías con iconos y colores personalizables
- ✅ **Gestión de Recursos**: Administrar items (YouTube, Google Drive, OneDrive, otros enlaces)
- ✅ **Autenticación Segura**: Sistema de login con JWT para administradores
- ✅ **Detección Automática**: Identificación automática del tipo de recurso por URL
- ✅ **Interfaz Moderna**: UI responsive con TailwindCSS/NativeWind
- ✅ **Multiplataforma**: Android, iOS y Web (experimental)

---

## 🏗️ Arquitectura

### Monorepo Structure

```
repomovil/
├── backend/          # API RESTful (Node.js + Express + Prisma)
├── frontend/         # App móvil (React Native + Expo)
└── README.md
```

### Stack Tecnológico

#### Backend

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma v7.3.0
- **Autenticación**: JWT (jsonwebtoken v9.0.3)
- **Validación**: Zod v4.3.6
- **Seguridad**: bcrypt v6.0.0

#### Frontend

- **Framework**: React Native v0.81.5
- **Plataforma**: Expo v54.0.32
- **Navegación**: React Navigation v7
- **Estilos**: TailwindCSS v3.4.19 + NativeWind v4.2.1
- **HTTP Client**: Axios v1.13.3
- **Persistencia**: AsyncStorage v2.2.0
- **Iconos**: MaterialCommunityIcons

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js v18+ instalado
- PostgreSQL v14+ instalado y corriendo
- Expo Go (opcional, para pruebas en dispositivo físico)

### Instalación

#### 1. Backend

```bash
cd backend
npm install

# Crear archivo .env
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/repomovil"' > .env
echo 'JWT_SECRET="tu_secreto_super_seguro"' >> .env
echo 'PORT=4000' >> .env

# Ejecutar migraciones
npx prisma migrate dev --name init

# Crear usuario admin inicial
node src/seed.js
# Credenciales: admin@repomovil.com / Admin12345

# Iniciar servidor
npm run dev
```

#### 2. Frontend

```bash
cd frontend
npm install

# Actualizar SERVER_IP en src/api/client.js con tu IP local
# Ejemplo: const SERVER_IP = '192.168.1.100';

# Iniciar Expo
npm start
```

---

## 📱 Uso

### Usuario Final

1. Abrir app en Expo Go o emulador
2. Ver categorías disponibles en pantalla principal
3. Tocar categoría para ver sus recursos
4. Tocar recurso para abrirlo en navegador/app externa

### Administrador

1. Tocar botón "Admin" en header
2. Login con credenciales
3. Acceder a panel de administración
4. Gestionar categorías e items

---

## 🗄️ Modelos de Datos

### AdminUser

- `id`: Identificador único
- `email`: Email único del administrador
- `passwordHash`: Contraseña hasheada (bcrypt)
- `role`: Rol del usuario (default: "ADMIN")
- `createdAt`: Fecha de creación

### Category

- `id`: Identificador único
- `name`: Nombre de la categoría
- `description`: Descripción (opcional)
- `iconKey`: Clave de icono (10 opciones disponibles)
- `iconColor`: Color en formato hex (opcional)
- `isActive`: Estado activo/inactivo
- `createdAt`: Fecha de creación
- `items`: Relación con items

### Item

- `id`: Identificador único
- `categoryId`: ID de categoría padre
- `type`: Tipo de recurso (YOUTUBE | DRIVE | ONEDRIVE | OTHER)
- `title`: Título del recurso
- `url`: URL del recurso
- `description`: Descripción (opcional)
- `iconKey`: Icono personalizado (opcional)
- `iconColor`: Color personalizado (opcional)
- `isActive`: Estado activo/inactivo
- `createdAt`: Fecha de creación

---

## 🔌 API Endpoints

### Públicos (sin autenticación)

- `GET /api/categories` - Lista categorías activas con items
- `GET /api/categories/:id/items` - Items de una categoría
- `GET /api/search?q=...` - Búsqueda de items

### Autenticación

- `POST /api/auth/login` - Login de administrador

### Admin (requiere JWT)

**Categorías**:

- `POST /api/admin/categories` - Crear categoría
- `PUT /api/admin/categories/:id` - Actualizar categoría
- `DELETE /api/admin/categories/:id` - Eliminar categoría

**Items**:

- `POST /api/admin/items` - Crear item
- `PUT /api/admin/items/:id` - Actualizar item
- `DELETE /api/admin/items/:id` - Eliminar item

> Ver documentación completa de API en los archivos de documentación

---

## 📚 Documentación Completa

Este proyecto incluye documentación detallada en los siguientes archivos:

- **[Documentación General](docs/project_overview.md)**: Arquitectura completa, características, y visión general
- **[Referencia de API](docs/api_reference.md)**: Todos los endpoints con ejemplos y formatos
- **[Guía de Desarrollo](docs/development_guide.md)**: Setup, workflows, estándares de código, y debugging

---

## 🛠️ Scripts Disponibles

### Backend

```bash
npm run dev          # Servidor con auto-reload (nodemon)
npm start            # Servidor en producción
npm run prisma:studio # Interfaz visual de base de datos
```

### Frontend

```bash
npm start            # Iniciar Expo Dev Server
npm run android      # Abrir en emulador Android
npm run ios          # Abrir en simulador iOS
npm run web          # Versión web (experimental)
npm run lint         # Ejecutar linter
```

---

## 🔐 Seguridad

### Credenciales por Defecto

**Email**: `admin@repomovil.com`  
**Password**: `Admin12345`

> ⚠️ **Importante**: Cambiar estas credenciales en producción

### Consideraciones de Producción

- Configurar CORS para dominios específicos
- Usar HTTPS para todas las comunicaciones
- Cambiar `JWT_SECRET` a valor aleatorio fuerte
- Implementar rate limiting en endpoints de login
- Validar y sanitizar todas las entradas

---

## 🐛 Troubleshooting

**Error: "Cannot connect to backend"**

- Verificar que backend esté corriendo
- Actualizar `SERVER_IP` en `frontend/src/api/client.js`
- Verificar que dispositivo y PC estén en la misma red WiFi

**Error: "Prisma Client not found"**

```bash
cd backend
npx prisma generate
```

**Error: "JWT_SECRET not defined"**

- Crear archivo `.env` en `backend/` con las variables requeridas

---

## 🤝 Contribución

### Workflow

1. Crear rama feature: `git checkout -b feature/nombre`
2. Hacer commits: `git commit -m "feat: descripción"`
3. Push y crear PR: `git push origin feature/nombre`

### Convenciones de Commits

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `refactor:` Refactorización de código
- `style:` Formato, estilos
- `test:` Agregar tests
- `chore:` Tareas de mantenimiento

---

## 📄 Licencia

Este proyecto es privado y está desarrollado para uso interno de la organización.

---

## 📞 Soporte

Para problemas o preguntas, consultar la [Guía de Desarrollo](docs/development_guide.md) o contactar al equipo de desarrollo.

---

**Última actualización**: 2026-01-28  
**Versión**: 1.0.0  
**Estado**: Activo en desarrollo
