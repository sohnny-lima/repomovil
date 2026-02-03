# Repomovil - Backend API

> **API REST para gestión de recursos multimedia**

Backend completo con Node.js, Express, Prisma y PostgreSQL para el sistema Repomovil.

---

## 📋 Descripción

API RESTful que proporciona endpoints para:

- Gestión de categorías de recursos
- Gestión de items multimedia (YouTube, Drive, OneDrive, otros)
- Autenticación de administradores con JWT
- Búsqueda de recursos
- Gestión de hero carousel para la página principal
- Detección automática de tipo de recurso por URL

---

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma v7.3.0
- **Autenticación**: JWT (jsonwebtoken v9.0.3)
- **Validación**: Zod v4.3.6
- **Encriptación**: bcrypt v6.0.0
- **CORS**: cors v2.8.6
- **Upload**: multer v2.0.2

---

## ⚙️ Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar migraciones
npx prisma migrate dev

# Generar Prisma Client
npx prisma generate

# Crear usuario admin inicial
node src/seed.js
```

---

## 🔧 Variables de Entorno

Crear archivo `.env` en la raíz del backend:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:password@localhost:5432/repomovil?schema=public"

# Secreto para JWT (cambiar en producción)
JWT_SECRET="secreto_aleatorio_fuerte_minimo_32_caracteres"

# Puerto del servidor
PORT=4000

# Configuración de Prisma
PRISMA_CLIENT_ENGINE_TYPE=library
```

### Ejemplo de DATABASE_URL

```env
# Desarrollo local
DATABASE_URL="postgresql://postgres:password@localhost:5432/repomovil?schema=public"

# Producción (ejemplo con servicio cloud)
DATABASE_URL="postgresql://user:pass@db.example.com:5432/repomovil_prod?schema=public&sslmode=require"
```

---

## 🗄️ Migraciones y Prisma

### Comandos Principales

```bash
# Generar Prisma Client después de cambios en schema
npx prisma generate

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Abrir Prisma Studio (interfaz visual de BD)
npm run prisma:studio

# Resetear base de datos (¡CUIDADO! Borra todos los datos)
npx prisma migrate reset
```

### Modelos de Datos

#### AdminUser

```prisma
model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  role         String   @default("ADMIN")
  createdAt    DateTime @default(now())
}
```

#### Category

```prisma
model Category {
  id          String   @id @default(cuid())
  name        String
  description String?
  iconKey     String?
  iconColor   String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  items       Item[]
}
```

#### Item

```prisma
model Item {
  id          String   @id @default(cuid())
  categoryId  String
  type        ItemType
  title       String
  url         String
  description String?
  iconKey     String?
  iconColor   String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
}

enum ItemType {
  YOUTUBE
  DRIVE
  ONEDRIVE
  OTHER
}
```

#### HeroSlide

```prisma
model HeroSlide {
  id       String   @id @default(cuid())
  title    String?
  subtitle String?
  imageUrl String
  linkUrl  String?
  order    Int      @default(0)
  isActive Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

---

## 📜 Scripts Disponibles

```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm run build          # Genera Prisma Client
npm start              # Inicia servidor

# Prisma Studio
npm run prisma:studio  # Interfaz visual de BD
```

---

## 📁 Estructura de Carpetas

```
backend/
├── src/
│   ├── index.js              # Punto de entrada
│   ├── prisma.js             # Cliente Prisma
│   ├── seed.js               # Script de seed
│   ├── middleware/
│   │   └── auth.js           # Middleware de autenticación JWT
│   ├── routes/
│   │   ├── public.routes.js  # Rutas públicas
│   │   ├── auth.routes.js    # Autenticación
│   │   ├── admin.routes.js   # Rutas admin (CRUD)
│   │   └── upload.routes.js  # Upload de archivos
│   └── utils/
│       ├── jwt.js            # Helpers JWT
│       └── detectType.js     # Detección de tipo de URL
├── prisma/
│   ├── schema.prisma         # Esquema de base de datos
│   └── migrations/           # Migraciones
├── public/
│   └── uploads/              # Archivos subidos
├── .env                      # Variables de entorno
└── package.json
```

---

## 🔌 Endpoints de la API

### Base URL

```
http://localhost:4000
```

---

### Públicos (sin autenticación)

#### `GET /api/categories`

Lista todas las categorías activas con sus items.

**Response:**

```json
[
  {
    "id": "clx123...",
    "name": "Ministerio Infantil",
    "description": "Recursos para niños",
    "iconKey": "baby",
    "iconColor": "#3b82f6",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "items": [
      {
        "id": "clx456...",
        "title": "Video tutorial",
        "type": "YOUTUBE",
        "url": "https://youtube.com/watch?v=...",
        "description": "Descripción del video"
      }
    ]
  }
]
```

#### `GET /api/categories/:id/items`

Obtiene todos los items de una categoría específica.

**Response:**

```json
[
  {
    "id": "clx456...",
    "type": "YOUTUBE",
    "title": "Video tutorial",
    "url": "https://youtube.com/watch?v=...",
    "description": "Descripción",
    "iconKey": "video",
    "iconColor": "#ef4444",
    "createdAt": "2026-01-15T10:00:00.000Z"
  }
]
```

#### `GET /api/search?q=término`

Busca items por título, descripción o URL.

**Query Params:**

- `q` (string): Término de búsqueda

**Response:**

```json
[
  {
    "id": "clx456...",
    "type": "YOUTUBE",
    "title": "Video tutorial",
    "url": "https://youtube.com/watch?v=...",
    "description": "Descripción",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "category": {
      "id": "clx123...",
      "name": "Ministerio Infantil"
    }
  }
]
```

#### `GET /api/hero`

Obtiene slides del hero carousel.

**Response:**

```json
[
  {
    "id": "clx789...",
    "title": "Bienvenidos",
    "subtitle": "Recursos para mayordomía",
    "imageUrl": "/uploads/hero1.jpg",
    "linkUrl": "/categories",
    "order": 0,
    "isActive": true,
    "createdAt": "2026-01-15T10:00:00.000Z"
  }
]
```

---

### Autenticación

#### `POST /api/auth/login`

Login de administrador.

**Request Body:**

```json
{
  "email": "admin@repomovil.com",
  "password": "Admin12345"
}
```

**Response:**

```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx000...",
    "email": "admin@repomovil.com",
    "role": "ADMIN"
  }
}
```

---

### Admin (requiere JWT Bearer token)

**Headers requeridos:**

```
Authorization: Bearer <token>
```

#### Categorías

##### `POST /api/admin/categories`

Crear categoría.

**Request Body:**

```json
{
  "name": "Nueva Categoría",
  "description": "Descripción opcional",
  "iconKey": "book",
  "iconColor": "#3b82f6",
  "isActive": true
}
```

##### `PUT /api/admin/categories/:id`

Actualizar categoría.

##### `DELETE /api/admin/categories/:id`

Eliminar categoría (también elimina sus items).

---

#### Items

##### `POST /api/admin/items`

Crear item.

**Request Body:**

```json
{
  "categoryId": "clx123...",
  "type": "YOUTUBE",
  "title": "Título del recurso",
  "url": "https://youtube.com/watch?v=...",
  "description": "Descripción opcional",
  "iconKey": "video",
  "iconColor": "#ef4444",
  "isActive": true
}
```

**Nota**: El campo `type` es opcional. Si no se proporciona, se detecta automáticamente por la URL.

##### `PUT /api/admin/items/:id`

Actualizar item.

##### `DELETE /api/admin/items/:id`

Eliminar item.

---

#### Hero Carousel

##### `POST /api/admin/hero`

Crear slide.

**Request Body:**

```json
{
  "title": "Título",
  "subtitle": "Subtítulo",
  "imageUrl": "/uploads/imagen.jpg",
  "linkUrl": "/categories",
  "order": 0,
  "isActive": true
}
```

##### `PUT /api/admin/hero/:id`

Actualizar slide.

##### `DELETE /api/admin/hero/:id`

Eliminar slide.

---

## 🔐 Autenticación y Seguridad

### JWT

- Los tokens JWT se firman con `JWT_SECRET`
- Expiración: 7 días (configurable en `src/utils/jwt.js`)
- Payload incluye: `sub` (user ID), `role`, `email`

### Middleware de Autenticación

```javascript
// Proteger rutas
router.use(requireAuth, requireAdmin);
```

### Contraseñas

- Hasheadas con bcrypt (10 rounds)
- Nunca se devuelven en responses

---

## 🚀 Ejecución en Producción

```bash
# 1. Configurar variables de entorno de producción
# Editar .env con credenciales de producción

# 2. Ejecutar migraciones
npx prisma migrate deploy

# 3. Generar Prisma Client
npm run build

# 4. Iniciar servidor
npm start
```

### Consideraciones de Producción

- Configurar CORS para dominios específicos en `src/index.js`
- Usar HTTPS para todas las comunicaciones
- Cambiar `JWT_SECRET` a valor aleatorio fuerte
- Implementar rate limiting en endpoints de login
- Configurar logs apropiados
- Usar variables de entorno para configuración sensible
- Configurar backup automático de base de datos

---

## 🐛 Troubleshooting

### Error: "Prisma Client not found"

```bash
npx prisma generate
```

### Error: "Can't reach database server"

- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `DATABASE_URL`
- Verificar firewall/red

### Error: "JWT_SECRET not defined"

Crear archivo `.env` con la variable `JWT_SECRET`.

### Error: "Port already in use"

Cambiar `PORT` en `.env` o matar el proceso usando el puerto:

```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4000 | xargs kill -9
```

---

## 📝 Notas Importantes

- La detección automática de tipo de URL soporta YouTube, Google Drive, OneDrive
- Los archivos subidos se guardan en `public/uploads/`
- Las migraciones se aplican automáticamente en desarrollo con `prisma migrate dev`
- En producción usar `prisma migrate deploy`
- El seed crea un usuario admin con credenciales por defecto

---

## 📄 Licencia

Parte del proyecto Repomovil - Mayordomía 2026 - Unión Peruana del Sur
