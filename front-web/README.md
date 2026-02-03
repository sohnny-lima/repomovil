# Repomovil - Frontend Web

> **Aplicación web moderna con sitio público y panel de administración**

Frontend web profesional construido con Next.js, React y Tailwind CSS para el sistema Repomovil.

---

## 📋 Descripción

Aplicación web completa que incluye:

- **Sitio Público**: Home con hero carousel, catálogo de categorías, búsqueda de recursos
- **Panel de Administración**: Dashboard, CRUD de categorías, items y hero carousel

---

## 🚀 Características

### Sitio Público

- ✅ **Home**: Hero carousel dinámico, búsqueda rápida, categorías destacadas
- ✅ **Catálogo de Categorías**: Grid responsive con iconos y colores personalizables
- ✅ **Detalle de Categoría**: Lista completa de items organizados
- ✅ **Búsqueda Global**: Búsqueda en tiempo real con resultados filtrados
- ✅ **Diseño Responsive**: Optimizado para desktop, tablet y móvil
- ✅ **Dark Mode**: Soporte completo de tema oscuro

### Panel de Administración

- ✅ **Dashboard**: KPIs y estadísticas del sistema
- ✅ **Gestión de Categorías**: Crear, editar, eliminar con preview en vivo
- ✅ **Gestión de Items**: CRUD completo con detección automática de tipo
- ✅ **Gestión de Hero**: Administrar slides del carousel principal
- ✅ **Autenticación JWT**: Login seguro con persistencia de sesión
- ✅ **UI Moderna**: Interfaz profesional con Tailwind CSS

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16.1.6 (App Router)
- **UI Library**: React 19.2.3
- **Estilos**: Tailwind CSS v4
- **HTTP Client**: Axios v1.13.4
- **Validación**: Zod v4.3.6
- **Iconos**: Lucide React v0.563.0
- **Utilidades**: clsx v2.1.1

---

## ⚙️ Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con la URL del backend
```

---

## 🔧 Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_BASE_URL=http://192.168.100.10:4000
```

**Importante**:

- Cambiar la IP por la de tu servidor backend
- En producción, usar la URL completa del backend (ej: `https://api.repomovil.com`)
- El prefijo `NEXT_PUBLIC_` es necesario para que la variable esté disponible en el cliente

---

## 🏃 Comandos

```bash
# Desarrollo
npm run dev          # Inicia servidor en http://localhost:3000

# Producción
npm run build        # Genera build optimizado
npm start            # Inicia servidor de producción

# Linting
npm run lint         # Ejecutar ESLint
```

---

## 📁 Estructura del Proyecto

```
front-web/
├── src/
│   ├── app/                      # App Router de Next.js
│   │   ├── page.js              # Home pública
│   │   ├── layout.js            # Layout raíz
│   │   ├── globals.css          # Estilos globales
│   │   ├── categories/          # Páginas de categorías
│   │   │   ├── page.js          # Lista de categorías
│   │   │   └── [id]/            # Detalle de categoría
│   │   ├── search/              # Búsqueda
│   │   │   └── page.js
│   │   └── admin/               # Panel de administración
│   │       ├── page.js          # Dashboard
│   │       ├── login/           # Login
│   │       ├── categories/      # CRUD categorías
│   │       └── hero/            # CRUD hero carousel
│   ├── components/
│   │   ├── ui/                  # Componentes UI base
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   └── Card.jsx
│   │   ├── layout/              # Layouts
│   │   │   ├── PublicNavbar.jsx
│   │   │   ├── PublicFooter.jsx
│   │   │   └── AdminSidebar.jsx
│   │   ├── home/                # Componentes del home
│   │   │   ├── HeroCarousel.jsx
│   │   │   └── SearchBar.jsx
│   │   └── admin/               # Componentes admin
│   │       ├── CategoryForm.jsx
│   │       └── ItemForm.jsx
│   ├── context/
│   │   └── AuthContext.jsx      # Contexto de autenticación
│   └── lib/
│       ├── http.js              # Cliente Axios configurado
│       ├── auth.js              # Helpers de autenticación
│       ├── api.js               # Funciones de API
│       └── iconMap.js           # Mapeo de iconos
├── public/                       # Archivos estáticos
│   ├── favicon.ico
│   └── images/
├── .env.local                    # Variables de entorno
├── .env.local.example            # Ejemplo de variables
├── next.config.mjs               # Configuración de Next.js
├── tailwind.config.js            # Configuración de Tailwind
└── package.json
```

---

## 🌐 Rutas Principales

### Públicas

| Ruta               | Descripción                          |
| ------------------ | ------------------------------------ |
| `/`                | Home con hero, búsqueda y categorías |
| `/categories`      | Catálogo completo de categorías      |
| `/categories/[id]` | Detalle de categoría con sus items   |
| `/search`          | Búsqueda global de recursos          |

### Admin (requiere autenticación)

| Ruta                                         | Descripción                |
| -------------------------------------------- | -------------------------- |
| `/admin/login`                               | Login de administrador     |
| `/admin`                                     | Dashboard con estadísticas |
| `/admin/categories`                          | Lista de categorías        |
| `/admin/categories/new`                      | Crear nueva categoría      |
| `/admin/categories/[id]/edit`                | Editar categoría           |
| `/admin/categories/[id]/items`               | Items de una categoría     |
| `/admin/categories/[id]/items/new`           | Crear nuevo item           |
| `/admin/categories/[id]/items/[itemId]/edit` | Editar item                |
| `/admin/hero`                                | Gestión de hero carousel   |

---

## 🔌 Integración con Backend

Este frontend consume la API REST del backend ubicado en `../backend/`.

### Configuración de Axios

El cliente HTTP está configurado en `src/lib/http.js`:

```javascript
import axios from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token JWT
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Endpoints Utilizados

**Públicos** (sin autenticación):

- `GET /api/categories` - Lista categorías activas
- `GET /api/categories/:id/items` - Items de una categoría
- `GET /api/search?q=...` - Búsqueda de items
- `GET /api/hero` - Slides del hero carousel

**Autenticación**:

- `POST /api/auth/login` - Login de admin

**Admin** (requiere token Bearer):

- `POST /api/admin/categories` - Crear categoría
- `PUT /api/admin/categories/:id` - Actualizar categoría
- `DELETE /api/admin/categories/:id` - Eliminar categoría
- `POST /api/admin/items` - Crear item
- `PUT /api/admin/items/:id` - Actualizar item
- `DELETE /api/admin/items/:id` - Eliminar item
- `POST /api/admin/hero` - Crear slide
- `PUT /api/admin/hero/:id` - Actualizar slide
- `DELETE /api/admin/hero/:id` - Eliminar slide

---

## 🔐 Autenticación

El sistema usa JWT Bearer tokens almacenados en `localStorage`:

### Flujo de Autenticación

1. Usuario ingresa credenciales en `/admin/login`
2. Backend valida y devuelve token JWT
3. Token se guarda en `localStorage`
4. Axios interceptor agrega automáticamente el token a todas las requests
5. Si token expira (401), se redirige a login

### Protección de Rutas

Las rutas admin están protegidas con el contexto `AuthContext`:

```javascript
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
```

### Credenciales por Defecto

- **Email**: `admin@repomovil.com`
- **Password**: `Admin12345`

> ⚠️ Cambiar en producción

---

## 🎨 Personalización

### Iconos Disponibles

El sistema soporta los siguientes iconos (configurables por categoría/item):

- `book`, `video`, `file-text`, `music`, `image`, `folder`, `star`, `heart`, `users`, `settings`

Mapeo en `src/lib/iconMap.js`:

```javascript
import {
  Book,
  Video,
  FileText,
  Music,
  Image,
  Folder,
  Star,
  Heart,
  Users,
  Settings,
} from "lucide-react";

export const getIcon = (iconKey) => {
  const iconMap = {
    book: Book,
    video: Video,
    "file-text": FileText,
    music: Music,
    image: Image,
    folder: Folder,
    star: Star,
    heart: Heart,
    users: Users,
    settings: Settings,
  };
  return iconMap[iconKey] || FileText;
};
```

### Colores

Los colores se pueden personalizar usando códigos hex (ej: `#3b82f6`).

---

## 🚀 Despliegue

### Build de Producción

```bash
# 1. Configurar variables de entorno de producción
# Editar .env.local con URL del backend en producción

# 2. Generar build
npm run build

# 3. Iniciar servidor
npm start
```

### Opciones de Despliegue

- **Vercel** (recomendado para Next.js)
- **Netlify**
- **Docker** + servidor Node.js
- **VPS** con PM2

### Variables de Entorno en Producción

Configurar en el servicio de hosting:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.repomovil.com
```

---

## 🐛 Troubleshooting

### Error de conexión al backend

**Síntomas**: "Network Error" o "Failed to fetch"

**Soluciones**:

1. Verificar que backend esté corriendo
2. Verificar `NEXT_PUBLIC_API_BASE_URL` en `.env.local`
3. Revisar CORS en backend
4. Verificar firewall/antivirus

### Error 401 en admin

**Síntomas**: Redirige a login constantemente

**Soluciones**:

1. Token expiró - hacer logout y login nuevamente
2. Verificar que `JWT_SECRET` sea el mismo en backend
3. Limpiar `localStorage` del navegador

### Categorías no aparecen

**Síntomas**: Lista vacía en home o categorías

**Soluciones**:

1. Verificar que backend tenga categorías con `isActive: true`
2. Revisar consola del navegador para errores
3. Verificar que backend esté respondiendo correctamente

### Build falla

**Síntomas**: Error al ejecutar `npm run build`

**Soluciones**:

1. Verificar que todas las variables de entorno estén configuradas
2. Limpiar caché: `rm -rf .next`
3. Reinstalar dependencias: `rm -rf node_modules && npm install`

---

## 📝 Notas Importantes

- El frontend solo muestra categorías e items con `isActive: true` en el sitio público
- El panel admin muestra todos los registros independientemente del estado
- Las imágenes del hero carousel deben subirse al backend primero
- La detección automática de tipo de URL se hace en el backend
- El sistema soporta dark mode automático basado en preferencias del sistema

---

## 📄 Licencia

Parte del proyecto Repomovil - Mayordomía 2026 - Unión Peruana del Sur
