# Repomovil - Frontend Móvil

> **Aplicación móvil multiplataforma con React Native y Expo**

App móvil para iOS y Android que permite acceder a los recursos de Repomovil desde dispositivos móviles.

---

## 📋 Descripción

Aplicación móvil nativa construida con React Native y Expo que proporciona:

- Navegación por categorías de recursos
- Visualización de items multimedia
- Apertura de recursos en apps externas (YouTube, navegador, etc.)
- Interfaz moderna con NativeWind (Tailwind para React Native)
- Soporte para iOS y Android

---

## 🚀 Estado Actual del Desarrollo

### Funcionalidades Implementadas ✅

- ✅ Navegación entre pantallas (React Navigation)
- ✅ Listado de categorías desde API
- ✅ Detalle de categoría con items
- ✅ Apertura de recursos en apps externas
- ✅ Autenticación de administradores
- ✅ Panel admin básico (CRUD categorías e items)
- ✅ Estilos con NativeWind/Tailwind
- ✅ Iconos personalizables por categoría

### En Desarrollo 🚧

- 🚧 Búsqueda de recursos
- 🚧 Caché offline
- 🚧 Notificaciones push
- 🚧 Compartir recursos

### Próximas Funcionalidades 📋

- 📋 Favoritos
- 📋 Historial de recursos visitados
- 📋 Modo offline completo
- 📋 Sincronización en segundo plano

---

## 🛠️ Stack Tecnológico

- **Framework**: React Native v0.81.5
- **Plataforma**: Expo v54.0.32
- **Navegación**: React Navigation v7
- **Estilos**: NativeWind v4.2.1 + Tailwind CSS v3.4.19
- **HTTP Client**: Axios v1.13.3
- **Persistencia**: AsyncStorage v2.2.0
- **Iconos**: MaterialCommunityIcons (Expo Vector Icons)
- **Gestos**: React Native Gesture Handler v2.28.0
- **Animaciones**: React Native Reanimated v4.2.1

---

## ⚙️ Instalación

```bash
# Instalar dependencias
npm install

# Configurar IP del backend
# Editar src/api/client.js y cambiar SERVER_IP
```

### Configuración de IP del Backend

Editar `src/api/client.js`:

```javascript
// Cambiar esta IP por la de tu máquina donde corre el backend
const SERVER_IP = '192.168.100.10';
const API_BASE_URL = `http://${SERVER_IP}:4000`;
```

**Importante**:

- Usar la IP local de tu PC (no `localhost`)
- Asegurar que el dispositivo/emulador esté en la misma red WiFi
- En producción, usar la URL completa del backend

---

## 🏃 Comandos

```bash
# Iniciar Expo Dev Server
npm start

# Abrir en emulador Android
npm run android

# Abrir en simulador iOS (solo macOS)
npm run ios

# Abrir en navegador (experimental)
npm run web

# Linting
npm run lint
```

### Ejecutar en Dispositivo Físico

1. Instalar **Expo Go** desde App Store o Google Play
2. Ejecutar `npm start`
3. Escanear el QR code con la cámara (iOS) o Expo Go (Android)
4. Asegurar que el dispositivo esté en la misma red WiFi que tu PC

---

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/
│   │   └── client.js           # Cliente Axios configurado
│   ├── components/
│   │   ├── CategoryCard.jsx    # Card de categoría
│   │   ├── ItemCard.jsx        # Card de item
│   │   ├── Header.jsx          # Header de navegación
│   │   └── LoadingSpinner.jsx  # Spinner de carga
│   ├── constants/
│   │   └── icons.js            # Mapeo de iconos
│   ├── context/
│   │   └── AuthContext.jsx     # Contexto de autenticación
│   ├── navigation/
│   │   └── AppNavigator.jsx    # Configuración de navegación
│   └── screens/
│       ├── HomeScreen.jsx      # Pantalla principal
│       ├── CategoryScreen.jsx  # Detalle de categoría
│       ├── LoginScreen.jsx     # Login de admin
│       ├── AdminHomeScreen.jsx # Dashboard admin
│       ├── AdminCategoriesScreen.jsx
│       ├── AdminCategoryFormScreen.jsx
│       ├── AdminItemsScreen.jsx
│       └── AdminItemFormScreen.jsx
├── assets/                      # Imágenes, fuentes, etc.
├── App.js                       # Punto de entrada
├── index.js                     # Registro de la app
├── app.json                     # Configuración de Expo
├── babel.config.js              # Configuración de Babel
├── tailwind.config.js           # Configuración de Tailwind
└── package.json
```

---

## 🌐 Pantallas Principales

### Públicas

| Pantalla   | Descripción                        |
| ---------- | ---------------------------------- |
| `Home`     | Lista de categorías disponibles    |
| `Category` | Detalle de categoría con sus items |

### Admin (requiere autenticación)

| Pantalla            | Descripción                       |
| ------------------- | --------------------------------- |
| `Login`             | Login de administrador            |
| `AdminHome`         | Dashboard con opciones de gestión |
| `AdminCategories`   | Lista de categorías               |
| `AdminCategoryForm` | Crear/editar categoría            |
| `AdminItems`        | Items de una categoría            |
| `AdminItemForm`     | Crear/editar item                 |

---

## 🔌 Integración con Backend

### Configuración de Axios

Cliente HTTP en `src/api/client.js`:

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_IP = '192.168.100.10';
const API_BASE_URL = `http://${SERVER_IP}:4000`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Endpoints Utilizados

**Públicos**:

- `GET /api/categories` - Lista categorías activas
- `GET /api/categories/:id/items` - Items de una categoría

**Autenticación**:

- `POST /api/auth/login` - Login de admin

**Admin**:

- `POST /api/admin/categories` - Crear categoría
- `PUT /api/admin/categories/:id` - Actualizar categoría
- `DELETE /api/admin/categories/:id` - Eliminar categoría
- `POST /api/admin/items` - Crear item
- `PUT /api/admin/items/:id` - Actualizar item
- `DELETE /api/admin/items/:id` - Eliminar item

---

## 🔐 Autenticación

### Flujo de Autenticación

1. Usuario ingresa credenciales en `LoginScreen`
2. Backend valida y devuelve token JWT
3. Token se guarda en `AsyncStorage`
4. Axios interceptor agrega automáticamente el token
5. Si token expira (401), se redirige a login

### Credenciales por Defecto

- **Email**: `admin@repomovil.com`
- **Password**: `Admin12345`

---

## 🎨 Personalización

### Iconos

El sistema usa MaterialCommunityIcons de Expo. Mapeo en `src/constants/icons.js`:

```javascript
export const getIconName = (iconKey) => {
  const iconMap = {
    book: 'book-open-variant',
    video: 'video',
    'file-text': 'file-document',
    music: 'music',
    image: 'image',
    folder: 'folder',
    star: 'star',
    heart: 'heart',
    users: 'account-group',
    settings: 'cog',
  };
  return iconMap[iconKey] || 'file-document';
};
```

### Estilos con NativeWind

Usar clases de Tailwind directamente en componentes:

```jsx
<View className="flex-1 bg-gray-100 p-4">
  <Text className="text-2xl font-bold text-gray-900">Título</Text>
</View>
```

---

## 📱 Builds de Producción

### Build para Android (APK)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login en Expo
eas login

# Configurar proyecto
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### Build para iOS (IPA)

```bash
# Build para iOS (requiere cuenta de Apple Developer)
eas build --platform ios --profile production
```

### Publicar en Stores

```bash
# Publicar en Google Play
eas submit --platform android

# Publicar en App Store
eas submit --platform ios
```

Documentación completa: [Expo EAS Build](https://docs.expo.dev/build/introduction/)

---

## 🐛 Troubleshooting

### Error: "Cannot connect to backend"

**Soluciones**:

1. Verificar que backend esté corriendo
2. Actualizar `SERVER_IP` en `src/api/client.js`
3. Verificar que dispositivo y PC estén en la misma red WiFi
4. Probar con IP explícita (ej: `192.168.1.100`)
5. Desactivar firewall temporalmente

### Error: "Network request failed"

**Soluciones**:

1. Verificar conexión a internet
2. Revisar URL del backend
3. Verificar que backend acepte conexiones desde la red local

### App se cierra al abrir

**Soluciones**:

1. Revisar logs: `npx expo start` y ver consola
2. Limpiar caché: `npx expo start -c`
3. Reinstalar dependencias: `rm -rf node_modules && npm install`

### Estilos no se aplican

**Soluciones**:

1. Verificar que NativeWind esté configurado correctamente
2. Reiniciar servidor: `npx expo start -c`
3. Verificar `tailwind.config.js`

---

## 📝 Notas Importantes

- La app solo muestra categorías e items con `isActive: true`
- Los recursos se abren en apps externas (YouTube, navegador, etc.)
- AsyncStorage se usa para persistir el token de autenticación
- La navegación usa stack navigator de React Navigation
- Los iconos son de MaterialCommunityIcons (incluidos en Expo)

---

## 🚀 Próximas Funcionalidades

### Corto Plazo

- [ ] Búsqueda de recursos
- [ ] Compartir recursos
- [ ] Favoritos

### Mediano Plazo

- [ ] Caché offline
- [ ] Sincronización en segundo plano
- [ ] Notificaciones push

### Largo Plazo

- [ ] Modo offline completo
- [ ] Descarga de recursos
- [ ] Estadísticas de uso

---

## 📄 Licencia

Parte del proyecto Repomovil - Mayordomía 2026 - Unión Peruana del Sur
