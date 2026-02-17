# Backend - Repomovil

Este proyecto es el backend de Repomovil, construido con **Node.js** y **Prisma ORM versión 7.x**, conectado a una base de datos **MariaDB 10.4 / MySQL** (entorno XAMPP en Windows).

Este documento detalla la arquitectura, configuración de permisos y flujos de trabajo **críticos** para mantener la integridad de la base de datos y evitar problemas de sincronización (Drift).

---

## 🏗️ 1. Arquitectura de Base de Datos

El proyecto utiliza dos instancias lógicas en la base de datos para separar claramente los datos de producción de los datos efímeros necesarios para las migraciones de Prisma.

- **`repomovil`**: Base de datos PRINCIPAL donde reside la aplicación.
- **`prisma_shadow`**: Base de datos SOMBRA (Shadow Database) utilizada exclusivamente por Prisma para calcular diferencias en el esquema.

### 👥 2. Usuarios y Permisos

Para garantizar la seguridad y el correcto funcionamiento de Prisma 7 (que requiere permisos elevados solo durante las migraciones), se han definido dos usuarios de base de datos distintos:

| Rol               | Usuario (User)   | Permisos                                                   | Uso                                                                        | Comando Típico          |
| :---------------- | :--------------- | :--------------------------------------------------------- | :------------------------------------------------------------------------- | :---------------------- |
| **Runtime (App)** | `repomovil_user` | `SELECT`, `INSERT`, `UPDATE`, `DELETE` sobre `repomovil.*` | Ejecución normal de la API. **NO** tiene permisos DDL (Create/Alter/Drop). | `npm run dev`           |
| **Migraciones**   | `prisma_migrate` | `ALL PRIVILEGES` sobre `repomovil.*` y `prisma_shadow.*`   | Ejecución de migraciones y cambios de esquema.                             | `.\scripts\migrate.ps1` |

> **⚠️ IMPORTANTE:** Nunca uses el usuario `repomovil_user` para ejecutar migraciones, y nunca uses `prisma_migrate` para correr la aplicación en producción.

---

## ⚙️ 3. Configuración de Prisma 7

Este proyecto utiliza **Prisma 7**, lo cual introduce cambios importantes respecto a versiones anteriores (v5/v6).

### ❌ Lo que NO debes hacer en `schema.prisma`

En Prisma 7, el archivo `schema.prisma` **NO debe contener URLs de conexión**. Solo define el proveedor y los modelos.

```prisma
// backend/prisma/schema.prisma (Correcto)
datasource db {
  provider = "mysql"
}

generator client {
  provider = "prisma-client-js"
}

// ... modelos ...
```

### ✅ Dónde están las URLs: `prisma.config.ts`

Las URLs de conexión se definen programáticamente en el archivo de configuración de TypeScript.

```typescript
// backend/prisma.config.ts
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Las variables de entorno son inyectadas aquí
    url: env("DATABASE_URL"),
    shadowDatabaseUrl: env("SHADOW_DATABASE_URL"),
  },
  // ...
});
```

---

## 🚀 4. Flujo de Trabajo: Migraciones

Debido a la separación de usuarios y la configuración de Prisma 7, **NO EJECUTES `npx prisma migrate dev` DIRECTAMENTE.**

Se ha creado un script de PowerShell dedicado para manejar las variables de entorno y usar el usuario correcto (`prisma_migrate`).

### 📜 Script: `backend/scripts/migrate.ps1`

Este script realiza lo siguiente automáticamente:

1. Configura `DATABASE_URL` y `SHADOW_DATABASE_URL` con las credenciales del usuario `prisma_migrate`.
2. Ejecuta la migración de Prisma.
3. Actualiza el cliente de Prisma (`prisma generate`).
4. Verifica el estado de la migración.
5. Limpia las variables de entorno al finalizar.

### 🛠️ Cómo crear una nueva migración

Para aplicar cambios en `schema.prisma` y generar una nueva migración:

```powershell
# Desde la raíz del proyecto (o backend/):
powershell -NoProfile -ExecutionPolicy Bypass -File .\backend\scripts\migrate.ps1 -name "nombre_descriptivo_migracion"
```

**Ejemplo:**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\migrate.ps1 -name "add_category_image"
```

---

## 🚨 5. Manejo de Drift y Emergencias

**Drift** ocurre cuando la base de datos real es diferente a lo que Prisma "cree" que debería ser (según su historial de migraciones). Esto suele pasar si modificas la BD manualmente.

### 🩹 Cómo solucionar Drift (SIN PERDER DATOS)

Si modificaste la BD manualmente (ej. `ALTER TABLE` por emergencia) y `prisma migrate dev` falla pidiendo un reset (`--reset`):

1. **NO aceptes el reset.** Perderás datos.
2. Crea una carpeta de migración vacía manualmente en `prisma/migrations/AAAAMMDDHHMMSS_nombre_fix`.
3. Crea un archivo `migration.sql` dentro de esa carpeta con el SQL que YA aplicaste manualmente.
4. Marca la migración como "ya aplicada" usando `resolve`:

```bash
npx prisma migrate resolve --applied AAAAMMDDHHMMSS_nombre_fix
```

Esto le dice a Prisma: _"Ya hice este cambio, confía en mí y regístralo como hecho"_.

---

## 📜 6. Scripts Disponibles

| Comando                 | Descripción                                                         |
| :---------------------- | :------------------------------------------------------------------ |
| `npm run dev`           | Inicia el servidor de desarrollo (usa `repomovil_user`).            |
| `npm start`             | Inicia el servidor en producción.                                   |
| `.\scripts\migrate.ps1` | **[CRÍTICO]** Único método aprobado para crear/aplicar migraciones. |

---

## ⛔ 7. Reglas de Oro

1. **PROHIBIDO** editar la estructura de la base de datos manualmente (phpMyAdmin, DBeaver) a menos que sea una emergencia absoluta.
2. **PROHIBIDO** usar `npx prisma db push`. En entornos con migraciones, esto puede desincronizar el historial.
3. **PROHIBIDO** poner credenciales o URLs directamente en `schema.prisma`.
4. **SIEMPRE** usa el script `migrate.ps1` para cambios de esquema.
5. **SIEMPRE** verifica que el servidor de desarrollo (`npm run dev`) funciona después de una migración.
