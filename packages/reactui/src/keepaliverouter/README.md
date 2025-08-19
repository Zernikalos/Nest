# Keep-Alive Router System

Este es un sistema de router personalizado que implementa el comportamiento "keep-alive" similar al de Vue.js. En lugar de desmontar y montar componentes al navegar, los componentes se mantienen montados y solo se ocultan/muestran.

## ¿Por qué usar este sistema?

- **Mantiene el estado**: Los componentes conservan su estado cuando navegas entre páginas
- **Mejor rendimiento**: Evita el remontaje innecesario de componentes
- **Experiencia de usuario mejorada**: Perfecto para aplicaciones de escritorio donde quieres mantener el progreso del usuario

## Cómo usar

### 1. Configurar el Router

```tsx
import { KeepAliveRouterProvider, Route } from '@/router';
import { MainLayout } from '@/layouts/MainLayout';

const routes: Route[] = [
    {
        path: '/editor',
        component: EditorPage,
        title: 'Editor',
    },
    {
        path: '/devices',
        component: DevicesPage,
        title: 'Devices',
    },
    // ... más rutas
];

function App() {
    return (
        <KeepAliveRouterProvider 
            initialRoute="/editor" 
            routes={routes}
        >
            <MainLayout />
        </KeepAliveRouterProvider>
    );
}
```

### 2. Renderizar las rutas

```tsx
import { KeepAliveOutlet } from '@/router';

function MainLayout() {
    return (
        <div className="layout">
            <Sidebar />
            <main>
                <KeepAliveOutlet className="content" />
            </main>
        </div>
    );
}
```

### 3. Navegación

```tsx
import { useNavigate, useCurrentRoute } from '@/router';

function SomeComponent() {
    const navigate = useNavigate();
    const currentRoute = useCurrentRoute();

    const handleNavigation = () => {
        navigate('/devices');
    };

    return (
        <div>
            <p>Ruta actual: {currentRoute}</p>
            <button onClick={handleNavigation}>
                Ir a Devices
            </button>
        </div>
    );
}
```

### 4. Hooks disponibles

#### `useNavigate()`
Hook básico para navegación.

#### `useCurrentRoute()`
Obtiene la ruta actual.

#### `useKeepAliveRouter()`
Hook principal que da acceso a todo el contexto del router.

#### `useCustomNavigate()`
Hook avanzado con utilidades adicionales:
- `navigateWithHistory()`: Navegación con control del historial
- `goBack()` / `goForward()`: Navegación del historial del navegador
- `canGoBack()`: Verifica si se puede ir atrás
- `routeExists()`: Verifica si una ruta existe

#### `useCurrentRouteInfo()`
Obtiene información completa de la ruta actual (path, title, component).

## Características

- ✅ **Keep-alive**: Los componentes se mantienen montados
- ✅ **Historial del navegador**: Funciona con botones atrás/adelante
- ✅ **URLs sincronizadas**: La URL se actualiza correctamente
- ✅ **TypeScript**: Completamente tipado
- ✅ **Hooks personalizados**: Múltiples hooks para diferentes necesidades
- ✅ **Fácil migración**: API similar a react-router

## Ejemplo de uso

Mira `DevicesPage.tsx` para ver un ejemplo completo de cómo el estado se mantiene entre navegaciones.
