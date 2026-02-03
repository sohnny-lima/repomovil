# Repomovil

> **Sistema de gestión y distribución de recursos multimedia para Mayordomía 2026**

Monorepo completo con API REST, aplicación web pública con panel de administración, y aplicación móvil multiplataforma.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

---

## 📋 Descripción

**Repomovil** es un sistema integral para la gestión y distribución de recursos educativos multimedia organizados por categorías. Permite a administradores gestionar contenido (videos de YouTube, documentos de Drive, OneDrive, y otros enlaces) y a usuarios finales acceder a estos recursos de manera organizada tanto desde la web como desde dispositivos móviles.

### Características Principales

- ✅ **Gestión de Categorías**: Crear, editar y eliminar categorías con iconos y colores personalizables
- ✅ **Gestión de Recursos**: Administrar items multimedia con detección automática de tipo
- ✅ **Autenticación Segura**: Sistema de login con JWT para administradores
- ✅ **Búsqueda Avanzada**: Búsqueda en tiempo real por título, descripción y URL
- ✅ **Interfaz Moderna**: UI responsive con diseño profesional
- ✅ **Multiplataforma**: Web (Next.js) y móvil (React Native/Expo)
- ✅ **Hero Carousel**: Carrusel de imágenes destacadas en la página principal

---

## 🏗️ Arquitectura

### Estructura del Monorepo

```
repomovil/
├── backend/          # API REST (Node.js + Express + Prisma + PostgreSQL)
├── front-web/        # Aplicación web (Next.js + React + Tailwind)
├── frontend/         # App móvil (React Native + Expo)
└── README.md         # Este archivo
```

### Flujo de Datos

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│  Frontend   │────────▶│   Backend   │────────▶│  PostgreSQL  │
│  (Web/Móvil)│◀────────│  (API REST) │◀────────│   Database   │
└─────────────┘         └─────────────┘         └──────────────┘
```

- **Frontend Web/Móvil** → Consume API REST vía HTTP/Axios
- **Backend** → Procesa requests, valida datos, ejecuta lógica de negocio
- **PostgreSQL** → Almacena datos (usuarios, categorías, items, hero slides)

---

## 🛠️ Stack Tecnológico

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma v7.3.0
- **Autenticación**: JWT (jsonwebtoken v9.0.3)
- **Validación**: Zod v4.3.6
- **Seguridad**: bcrypt v6.0.0

### Frontend Web

- **Framework**: Next.js 16.1.6 (App Router)
- **UI**: React 19.2.3
- **Estilos**: Tailwind CSS v4
- **HTTP Client**: Axios v1.13.4
- **Validación**: Zod v4.3.6
- **Iconos**: Lucide React

### Frontend Móvil

- **Framework**: React Native v0.81.5
- **Plataforma**: Expo v54.0.32
- **Navegación**: React Navigation v7
- **Estilos**: NativeWind v4.2.1 + Tailwind CSS
- **HTTP Client**: Axios v1.13.3
- **Persistencia**: AsyncStorage v2.2.0

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js v18+ instalado
- PostgreSQL v14+ instalado y corriendo
- npm o yarn
- (Opcional) Expo Go para pruebas en dispositivo móvil

### Instalación General

#### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd repomovil
```

#### 2. Configurar Backend

```bash
cd backend
npm install

# Crear archivo .env
cat > .env << EOF
DATABASE_URL="postgresql://usuario:password@localhost:5432/repomovil?schema=public"
JWT_SECRET="tu_secreto_super_seguro_cambiar_en_produccion"
PORT=4000
PRISMA_CLIENT_ENGINE_TYPE=library
EOF

# Ejecutar migraciones
npx prisma migrate dev

# Generar Prisma Client
npx prisma generate

# Crear usuario admin inicial
node src/seed.js
# Credenciales: admin@repomovil.com / Admin12345

# Iniciar servidor
npm run dev
```

#### 3. Configurar Frontend Web

```bash
cd ../front-web
npm install

# Crear archivo .env.local
echo 'NEXT_PUBLIC_API_BASE_URL=http://localhost:4000' > .env.local

# Iniciar en desarrollo
npm run dev
```

#### 4. Configurar Frontend Móvil

```bash
cd ../frontend
npm install

# Actualizar SERVER_IP en src/api/client.js con tu IP local
# Ejemplo: const SERVER_IP = '192.168.1.100';

# Iniciar Expo
npm start
```

---

## 🎯 Ejecución en Desarrollo

### Backend

```bash
cd backend
npm run dev          # Servidor con auto-reload (nodemon) en puerto 4000
```

### Frontend Web

```bash
cd front-web
npm run dev          # Next.js dev server en puerto 3000
```

### Frontend Móvil

```bash
cd frontend
npm start            # Expo dev server
npm run android      # Abrir en emulador Android
npm run ios          # Abrir en simulador iOS
```

---

## 🚀 Ejecución en Producción

### Backend

```bash
cd backend
npm run build        # Genera Prisma Client
npm start            # Inicia servidor en producción
```

### Frontend Web

```bash
cd front-web
npm run build        # Genera build optimizado
npm start            # Inicia servidor Next.js en producción
```

### Frontend Móvil

```bash
cd frontend
# Seguir guía de Expo para builds de producción:
# https://docs.expo.dev/build/introduction/
```

---

## 🔧 Variables de Entorno

### Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/repomovil?schema=public"
JWT_SECRET="secreto_aleatorio_fuerte_minimo_32_caracteres"
PORT=4000
PRISMA_CLIENT_ENGINE_TYPE=library
```

### Frontend Web (`front-web/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://192.168.100.10:4000
```

**Nota**: Cambiar la IP por la de tu servidor backend.

### Frontend Móvil

Configurar directamente en `frontend/src/api/client.js`:

```javascript
const SERVER_IP = "192.168.100.10"; // Tu IP local
```

---

## 🔐 Credenciales de Administrador

**Email**: `admin@repomovil.com`  
**Password**: `Admin12345`

> ⚠️ **IMPORTANTE**: Cambiar estas credenciales en producción ejecutando un script de actualización o directamente en la base de datos.

---

## 📚 Documentación Detallada

Cada parte del proyecto tiene su propia documentación:

- **[Backend README](backend/README.md)** - API, endpoints, base de datos
- **[Frontend Web README](front-web/README.md)** - Aplicación web y panel admin
- **[Frontend Móvil README](frontend/README.md)** - Aplicación móvil

---

## 🔌 API Endpoints Principales

### Públicos (sin autenticación)

- `GET /api/categories` - Lista categorías activas con items
- `GET /api/categories/:id/items` - Items de una categoría
- `GET /api/search?q=...` - Búsqueda de items
- `GET /api/hero` - Slides del hero carousel

### Autenticación

- `POST /api/auth/login` - Login de administrador

### Admin (requiere JWT Bearer token)

**Categorías**:

- `POST /api/admin/categories` - Crear categoría
- `PUT /api/admin/categories/:id` - Actualizar categoría
- `DELETE /api/admin/categories/:id` - Eliminar categoría

**Items**:

- `POST /api/admin/items` - Crear item
- `PUT /api/admin/items/:id` - Actualizar item
- `DELETE /api/admin/items/:id` - Eliminar item

**Hero Carousel**:

- `POST /api/admin/hero` - Crear slide
- `PUT /api/admin/hero/:id` - Actualizar slide
- `DELETE /api/admin/hero/:id` - Eliminar slide

---

## 🐛 Troubleshooting

### Error: "Cannot connect to backend"

- Verificar que backend esté corriendo
- Actualizar variables de entorno con IP correcta
- Verificar que dispositivo y PC estén en la misma red WiFi (móvil)
- Revisar firewall/antivirus

### Error: "Prisma Client not found"

```bash
cd backend
npx prisma generate
```

### Error: "JWT_SECRET not defined"

Crear archivo `.env` en `backend/` con las variables requeridas.

### Error de CORS

Configurar CORS en `backend/src/index.js` para permitir tu dominio/IP.

---

## 🤝 Contribución

### Workflow

1. Crear rama feature: `git checkout -b feature/nombre-funcionalidad`
2. Hacer commits descriptivos: `git commit -m "feat: descripción"`
3. Push y crear Pull Request: `git push origin feature/nombre-funcionalidad`

### Convenciones de Commits

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `refactor:` Refactorización de código
- `style:` Formato, estilos (sin cambios de lógica)
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

---

## 📄 Licencia

Este proyecto es privado y está desarrollado para uso interno de la organización **Mayordomía 2026 - Unión Peruana del Sur**.

---

## 📞 Soporte

Para problemas o preguntas:

1. Revisar la documentación específica de cada módulo
2. Consultar la sección de Troubleshooting
3. Contactar al equipo de desarrollo

---

**Última actualización**: 2026-02-03  
**Versión**: 1.0.0  
**Estado**: Activo en producción
