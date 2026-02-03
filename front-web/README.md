# Repomovil - Frontend Web

Frontend web moderno y profesional para Repomovil, construido con Next.js, React y Tailwind CSS.

## 🚀 Características

- **Sitio Público**:
  - Home con hero section, búsqueda y estadísticas
  - Catálogo de categorías con filtros
  - Detalle de categoría con items organizados
  - Búsqueda global de recursos

- **Panel de Administración**:
  - Dashboard con KPIs
  - CRUD completo de categorías
  - CRUD completo de items
  - Autenticación con JWT
  - UI moderna y responsive

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Backend de Repomovil corriendo (ver `../backend/README.md`)

## ⚙️ Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con la URL del backend
```

## 🔧 Variables de Entorno

Crear archivo `.env.local` con:

```env
NEXT_PUBLIC_API_BASE_URL=http://192.168.100.10:4000
```

**Importante**: Cambiar la IP por la de tu máquina donde corre el backend.

## 🏃 Comandos

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint
```

## 📁 Estructura del Proyecto

```
front-web/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── page.js            # Home pública
│   │   ├── categories/        # Páginas de categorías
│   │   ├── search/            # Búsqueda
│   │   └── admin/             # Panel admin
│   ├── components/
│   │   ├── ui/                # Componentes UI base
│   │   └── layout/            # Layouts (navbar, footer, sidebar)
│   └── lib/
│       ├── http.js            # Cliente Axios
│       ├── auth.js            # Helpers de autenticación
│       ├── api.js             # Funciones de API
│       └── iconMap.js         # Mapeo de iconos
├── .env.local                 # Variables de entorno
└── package.json
```

## 🌐 Rutas Principales

### Públicas

- `/` - Home
- `/categories` - Catálogo de categorías
- `/categories/[id]` - Detalle de categoría
- `/search` - Búsqueda global

### Admin (requiere autenticación)

- `/admin/login` - Login
- `/admin` - Dashboard
- `/admin/categories` - Lista de categorías
- `/admin/categories/new` - Crear categoría
- `/admin/categories/[id]/edit` - Editar categoría
- `/admin/categories/[id]/items` - Items de categoría
- `/admin/categories/[id]/items/new` - Crear item
- `/admin/categories/[id]/items/[itemId]/edit` - Editar item

## 🔌 Integración con Backend

Este frontend consume la API del backend ubicado en `../backend/`.

### Endpoints Utilizados

**Públicos** (sin autenticación):

- `GET /api/categories` - Lista categorías activas
- `GET /api/categories/:id/items` - Items de una categoría
- `GET /api/search?q=...` - Búsqueda de items

**Autenticación**:

- `POST /api/auth/login` - Login de admin

**Admin** (requiere token Bearer):

- `POST /api/admin/categories` - Crear categoría
- `PUT /api/admin/categories/:id` - Actualizar categoría
- `DELETE /api/admin/categories/:id` - Eliminar categoría
- `POST /api/admin/items` - Crear item
- `PUT /api/admin/items/:id` - Actualizar item
- `DELETE /api/admin/items/:id` - Eliminar item

### Cambiar Prefijos de API

Si el backend cambia el prefijo `/api`, actualizar en:

- `src/lib/api.js` - Todas las rutas de funciones

## 🔐 Autenticación

El sistema usa JWT Bearer tokens:

1. Login en `/admin/login` con credenciales
2. Token se guarda en `localStorage`
3. Axios interceptor agrega automáticamente el token a requests
4. Si token expira (401), redirige a login

**Credenciales por defecto**:

- Email: `admin@repomovil.com`
- Password: `Admin12345`

## 🎨 Tecnologías

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19
- **Estilos**: Tailwind CSS
- **HTTP Client**: Axios
- **Validación**: Zod
- **Iconos**: Lucide React
- **Utilidades**: clsx

## 🐛 Troubleshooting

### Error de conexión al backend

Verificar que:

1. El backend esté corriendo en el puerto configurado
2. La variable `NEXT_PUBLIC_API_BASE_URL` apunte a la IP correcta
3. No haya firewall bloqueando la conexión

### Error 401 en admin

El token expiró o es inválido. Hacer logout y login nuevamente.

### Categorías no aparecen

Verificar que el backend tenga categorías con `isActive: true`.

## 📝 Notas Importantes

- El frontend solo muestra categorías e items con `isActive: true` en el sitio público
- El panel admin usa el mismo endpoint público para listar categorías (no hay endpoint admin específico)
- Las imágenes de preview de iconos se generan dinámicamente con colores personalizables
- La detección automática de tipo de URL (YouTube, Drive, etc.) se hace en el backend

## 🚀 Despliegue

Para producción:

```bash
# Build
npm run build

# Iniciar
npm start
```

Configurar `NEXT_PUBLIC_API_BASE_URL` con la URL del backend en producción.

## 📄 Licencia

Parte del proyecto Repomovil - Mayordomía 2026
