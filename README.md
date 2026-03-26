# Repomovil

> **Sistema de gestión y distribución de recursos multimedia para Mayordomía 2026**

Un potente monorepo que proporciona una API REST, una aplicación web pública con panel de administración, y una aplicación móvil multiplataforma.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

---

## 📋 Descripción General

**Repomovil** es un sistema integral para la gestión y distribución de recursos educativos multimedia organizados por categorías y ministerios. Permite a los administradores gestionar su contenido fácilmente centralizando enlaces de YouTube, Drive, OneDrive y archivos propios, ofreciendo a los usuarios finales acceder a estos recursos de manera organizada, moderna y veloz desde web o celular.

### Características Principales
- ✅ **Gestión de Recursos y Ministerios**: Organización superior de categorías con íconos, colores e imágenes de portada.
- ✅ **Autenticación JWT Segura**: Panel administrativo privado protegido.
- ✅ **Búsqueda Avanzada**: Sistema de búsqueda instantánea por título, descripciones y tipos.
- ✅ **Arquitectura Full-Stack**: Web (Next.js App Router) y API (Express + MariaDB) separadas para mayor escalabilidad.
- ✅ **Diseño Responsivo e Impactante**: Tailwind CSS v4 con dark mode automático.

---

## 🏗️ Arquitectura y Flujo de Datos

```text
repomovil/
├── backend/          # API REST (Node.js + Express 5 + Prisma 7 + PostgreSQL/MariaDB)
├── front-web/        # Aplicación web (Next.js 16 + React 19 + Tailwind v4)
├── frontend/         # App móvil (React Native + Expo) [Solo referencial]
└── README.md         # Documentación general
```

El **Frontend (Web/Móvil)** consume datos de la **API REST Backend** mediante Axios, la cual se comunica bidireccionalmente usando **Prisma ORM** hacia una base de datos **MariaDB/PostgreSQL**.

---

## 🛠️ Stack Tecnológico

### 🌐 Backend
- Node.js & Express.js v5.2
- **Base de Datos:** MariaDB / PostgreSQL
- **ORM:** Prisma Client v7.3
- **Tools:** multer, jsonwebtoken, bcrypt, zod

### 💻 Front-Web
- **Framework:** Next.js 16.1.6 (App Router)
- **UI:** React 19, Tailwind CSS v4, Lucide React
- **Client HTTP:** Axios 

---

## 🚀 Inicio Rápido (Desarrollo Local)

### Requisitos Previos
- **Node.js**: v20+ recomendado.
- **Base de Datos**: Instancia de MariaDB, MySQL o PostgreSQL activa localmente.

### 1. Backend

```bash
cd backend
npm install
```

Crea tu archivo `.env` en `backend/`:
```env
DATABASE_URL="mysql://root:@localhost:3306/repomovil"
JWT_SECRET="super_secreto_cambiar_en_prod"
PORT=4000
```

Ejecuta las migraciones y arranca:
```bash
# Sigue las instrucciones del README en backend/ para migraciones seguras con Prisma 7.
npx prisma generate
node src/seed.js # Crea admin inicial
npm run dev
```

### 2. Front-Web

```bash
cd ../front-web
npm install
```

Crea tu `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Arranca en puerto 3000:
```bash
npm run dev
```

---

## 🔐 Credenciales de Admin (Por Defecto)

- **Email**: `admin@repomovil.com`
- **Password**: `Admin12345`

> ⚠️ *Modifica esto inmediatamente en producción a través de la base de datos o interfaz.*

---

## 📈 Roadmap de Mejoras Recomendadas

Como parte del análisis de arquitectura, se proponen las siguientes mejoras para siguientes iteraciones:

1. **Monorepo Tools:** Migrar a Turborepo o usar npm workspaces para sincronizar *linting*, *scripts* y compartir dependencias entre backend y frontend.
2. **Dockerización:** Añadir un `docker-compose.yml` maestro para levantar la base de datos, backend y frontend en un solo paso local.
3. **CI/CD:** Crear pipelines de GitHub Actions para despliegues automatizados y tests al confirmar los *commits*.
4. **End-to-End Type Safety:** Compartir esquemas Zod o tipos Prisma exportados con el frontend para evitar que las API's rompan la estructura visual en tiempo de compilación.

---

Para información detallada del desarrollo interno, revisa la documentación específica:
- [Documentación del Backend](./backend/README.md)
- [Documentación del Front-Web](./front-web/README.md)

---
**Proyecto Mayordomía 2026** - Unión Peruana del Sur.
