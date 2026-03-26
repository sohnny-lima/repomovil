# Front-Web - Repomovil

Una aplicación web con renderizado dinámico e híbrido generada desde cero en **Next.js 16 (App Router)** y **React 19**. Dispone tanto del catálogo público como del centro de control administrativo para las bases de datos de Mayordomía 2026.

---

## 🚀 1. Funcionalidades y Secciones

- **Vista Pública (`/`, `/categories`, `/search`)**: Portafolios navegables de recursos, banners rotativos (Hero Slider) y categorizaciones visuales.
- **Panel Intranet (`/admin`)**: Zonas ocultas por tokens JWT que interactúan transaccionalmente creando/editando categorías, items y slides.

---

## 🛠️ 2. Arquitectura de Interfaces (Tailwind v4)

Todo el estilo centralizado utiliza las nuevas especificaciones orientadas a JIT nativo de **Tailwind CSS versión 4**, junto a íconos base de **Lucide React**. Se han dividido las responsabilidades de UI en:
- `/components/ui`: Piezas Lego atómicas (Botones, Tags, Cards).
- `/components/layout`: Barras de navegación persistentes.

---

## 🔌 3. Gestión de Datos Actual

**Axios** protagoniza el despacho e intercepción de Peticiones REST HTTP. 
En `src/lib/http.js` existe un interceptor global que recolecta el token de `localStorage` y lo adjunta automáticamente en cada petición que salga al Backend bajo el estándar `Authorization: Bearer <TOKEN>`.

---

## 📈 4. Mejoras Propuestas (Roadmap Frontend)

Para profesionalizar aún más el entorno cliente, el análisis indica aplicar:

1. **Gestor de Estado Complejo (React Query):** En vez del uso extensivo de `useEffect` / `useState` con Axios, refactorizar el fetching hacía **TanStack Query**. Proveerá invalidaciones de caché eficientes, evitará pantallas de loading manuales y reducirá código repetitivo.
2. **Bibliotecas de UI Maduras (shadcn/ui):** Para escalar escalabilidad y accesibilidad (WAI-ARIA) de la carpeta `/components/ui`, incorporar Radix UI / shadcn permitiendo componentes desplegables u hojas de diálogos (Modals) premium sin dependencias infladas.
3. **Manejo Declarativo de Formularios:** Introducir `React Hook Form` ensamblado a `@hookform/resolvers/zod` para el Admin. Controlará renders innecesarios en inputs largos, validaciones instantaneas locales contra el Backend.
4. **Optimización SEO Radical:** Transformar las páginas de categorías a **SSG (Static Site Generation)** para disminuir TTFB en load público y exprimir la API de metadatos del App Router garantizando comparticiones elegantes en WhatsApp / RRSS.

---

## ⚙️ 5. Despliegue Configurado

Necesitarás definir el siguiente `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```
*(Cambiar a la ruta HTTP del API rest consumido en producción).*

| Comando | Acción |
| --- | --- |
| `npm run dev` | Arranca en caliente `localhost:3000` |
| `npm run build` | Limpia, minifica y compila pre-renders en `.next/` |
| `npm run lint` | Chequea el código con Next Eslint |
