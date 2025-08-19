# Router API Examples

Esta es la nueva API elegante del KeepAlive Router que emula react-router-dom pero con keep-alive.

## 🚀 Definición de Rutas

### Método 1: Configuración simple
```tsx
import { createRoutes, KeepAliveRouterProvider } from '@/router';

const routes = createRoutes([
    {
        path: '/editor',
        component: EditorPage,
        title: 'Editor',
        description: 'Main workspace'
    },
    {
        path: '/settings',
        component: SettingsPage,
        title: 'Settings',
        description: 'App configuration'
    }
]);

function App() {
    return (
        <KeepAliveRouterProvider initialRoute="/editor" routes={routes}>
            <MainLayout />
        </KeepAliveRouterProvider>
    );
}
```

### Método 2: Fluent API (Builder Pattern)
```tsx
import { route } from '@/router';

const routes = [
    route()
        .path('/editor')
        .component(EditorPage)
        .title('Editor')
        .description('Main workspace')
        .build(),
    
    route()
        .path('/settings')
        .component(SettingsPage)
        .title('Settings')
        .build()
];
```

## 🔗 Navegación con Link y NavLink

### Link básico
```tsx
import { Link } from '@/router';

function Navigation() {
    return (
        <nav>
            <Link to="/editor" className="nav-item">
                Editor
            </Link>
            <Link to="/settings" className="nav-item">
                Settings
            </Link>
        </nav>
    );
}
```

### NavLink con estado activo
```tsx
import { NavLink } from '@/router';

function Navigation() {
    return (
        <nav>
            <NavLink 
                to="/editor" 
                className="nav-item"
                activeClassName="nav-item-active"
            >
                {({ isActive }) => (
                    <span className={isActive ? 'font-bold' : ''}>
                        Editor
                    </span>
                )}
            </NavLink>
        </nav>
    );
}
```

## 🎯 Hooks disponibles

### useNavigate - Navegación programática
```tsx
import { useNavigate } from '@/router';

function MyComponent() {
    const navigate = useNavigate();
    
    const handleSave = () => {
        // Lógica de guardado...
        navigate('/editor');
    };
    
    return <button onClick={handleSave}>Save & Go to Editor</button>;
}
```

### useLocation - Información de la ruta actual
```tsx
import { useLocation } from '@/router';

function CurrentPath() {
    const location = useLocation();
    
    return <div>Current path: {location.pathname}</div>;
}
```

### useRouteInfo - Metadata de la ruta
```tsx
import { useRouteInfo } from '@/router';

function PageTitle() {
    const { title, path } = useRouteInfo();
    
    return <h1>{title} ({path})</h1>;
}
```

### useIsActive - Verificar si una ruta está activa
```tsx
import { useIsActive } from '@/router';

function ConditionalComponent() {
    const isEditorActive = useIsActive('/editor');
    
    return isEditorActive ? <EditorTools /> : null;
}
```

## 📄 Layout con Outlet

```tsx
import { Outlet } from '@/router';

function MainLayout() {
    return (
        <div className="layout">
            <Sidebar />
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}
```

## 🔄 Comparación con react-router-dom

| react-router-dom | KeepAlive Router | Descripción |
|------------------|------------------|-------------|
| `<Link to="/path">` | `<Link to="/path">` | Navegación básica |
| `<NavLink to="/path">` | `<NavLink to="/path">` | Link con estado activo |
| `<Outlet />` | `<Outlet />` | Renderiza ruta actual |
| `useNavigate()` | `useNavigate()` | Navegación programática |
| `useLocation()` | `useLocation()` | Info de ruta actual |
| `useParams()` | `useParams()` | Parámetros de ruta |
| `createBrowserRouter([...])` | `createRoutes([...])` | Configuración de rutas |

## ✨ Ventajas del KeepAlive Router

- ✅ **Keep-Alive**: Los componentes se mantienen montados
- ✅ **API familiar**: Misma sintaxis que react-router-dom  
- ✅ **TypeScript**: Completamente tipado
- ✅ **Configuración elegante**: Múltiples formas de definir rutas
- ✅ **Hooks completos**: Todos los hooks necesarios
- ✅ **Fácil migración**: Drop-in replacement para react-router-dom
