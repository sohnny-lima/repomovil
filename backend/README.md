# Backend API - Repomovil

API REST construida con **Node.js**, **Express 5** y **Prisma ORM 7.x**, sirviendo como piedra angular de validación, almacenamiento y lógica para Repomovil. Se conecta a una base de datos **MariaDB/MySQL**.

---

## 🏗️ 1. Patrones de Diseño y Modelos Principales

La arquitectura respeta un enrutado aislado por características, un manejador global de errores para Express 5 (que por fin soporta validaciones asíncronas nativas) y manejo especializado para el uso de **BigInts** que genera Prisma nativamente.

**Modelos Clave:**
- `AdminUser`: Autenticación y permisos.
- `Ministry` & `MinistryResource`: Sistema de portales ministeriales con recursos multimedia.
- `Category` & `Item`: Recursos comunes agrupados, para el catálogo global.
- `HeroSlide`: Banners principales de inicio del front-web.

---

## ⚙️ 2. Reglas de Prisma 7 & Migraciones CRÍTICAS

El proyecto utiliza dos instancias en la BD: `repomovil` (Producción) y `prisma_shadow` (Solo para Prisma).

> **⚠️ IMPORTANTE:** NUNCA ejecutes `npx prisma migrate dev` directamente por consola localmente configurado en producción si los permisos están fragmentados.

Se recomienda usar el script de powershell dedicado provisto en `./scripts/migrate.ps1` que asume credenciales especiales de `prisma_migrate` para los Delta changes:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\migrate.ps1 -name "nombre_descriptiva"
```

✅ **Configuración Segura:**
A diferencia de versiones pre-v7, *las credenciales de BD no residen en schema.prisma*, sino importadas condicional y programáticamente a través de `prisma.config.ts`.

---

## 🛡️ 3. Características de Estabilidad Actuales

- **Global Error Handler:** Los endpoints en API/Rutas no crashean el servidor frente a un fallo o valor `undefined`. Pasan en embudo a `errorHandler.js`.
- **Graceful Shutdown:** Un interceptor de señales (`SIGINT`, `SIGTERM`) desconecta educadamente a Prisma antes de matar al proceso de Node.js.
- **Interceptor BigInt**: Middleware de sanitización de payload que convierte proactivamente los objetos BigInt a Number para evitar el odioso error genérico `TypeError: Do not know how to serialize a BigInt` al interactuar `res.json()`.

---

## 📈 4. Mejoras Propuestas (Roadmap del Backend)

El backend actual es robusto, pero el siguiente paso hacia el crecimiento es:

1. **Abstracción del Almacenamiento (Storage):** Actualmente multer deja los archivos estáticos en `/public/uploads`. Si se escala horizontalmente (múltiples servidores o contenedores efímeros) los archivos se pierden o desincronizan. **Mejora:** Implementar servicios S3 (AWS) o Cloudinary.
2. **Validación Zod como Middleware Global:** Estandarizar una pieza de "Pipeline" que capture `req.body` y lo confronte contra un esquema de Zod _antes_ del controlador.
3. **Paginación Estándar:** Añadir cursores limit/offset nativos a las rutas GET que retornen listas (ej: categorías, assets) como prevensión para el sobreconsumo futuro de data.
4. **Documentación Swagger / OpenAPI:** Implementar `swagger-ui-express` para exponer el catálogo final de Endpoints al desarrollador mobile automizado desde comentarios o Zod schemas.

---

## 🔧 5. Scripts Clave

| Comando         | Descripción                               |
| :-------------- | :---------------------------------------- |
| `npm run dev`   | Servidor de dev en `nodemon` (port 4000)  |
| `npm run start` | Node de producción                        |
| `npm run seed`  | Ejecuta `seed.js` para popular DB vacías. |
