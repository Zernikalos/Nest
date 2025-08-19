# Nested Routes System

El router principal ahora soporta rutas anidadas como react-router-dom, eliminando la necesidad de sistemas de routing duplicados.

## 🎯 Arquitectura Unificada

### Antes (Sistema Duplicado)
```
KeepAlive Router (principal)
├── /editor → EditorPage
├── /devices → DevicesPage  
└── /settings → SettingsPage
                └── Settings Router (duplicado)
                    ├── general → GeneralSection
                    └── appearance → AppearanceSection
```

### Ahora (Sistema Unificado)
```
KeepAlive Router (único)
├── /editor → EditorPage
├── /devices → DevicesPage  
└── /settings → SettingsLayoutWithRouter
    ├── /settings/general → GeneralSettingsSection
    └── /settings/appearance → AppearanceSettingsSection
```

## 🚀 Definición de Rutas Anidadas

```tsx
const routeConfigs: RouteConfig[] = [
    {
        path: '/settings',
        component: SettingsLayoutWithRouter,
        title: 'Settings',
        children: [
            {
                path: '/general',
                component: GeneralSettingsSection,
                title: 'General Settings',
            },
            {
                path: '/appearance', 
                component: AppearanceSettingsSection,
                title: 'Appearance Settings',
            },
        ],
    },
];
```

## 🔧 Cómo Funciona Internamente

1. **Aplanamiento de Rutas**: Las rutas anidadas se "aplanan" automáticamente:
   ```tsx
   // Configuración anidada
   { path: '/settings', children: [{ path: '/general' }] }
   
   // Se convierte en rutas planas
   [
     { path: '/settings', component: SettingsLayout },
     { path: '/settings/general', component: GeneralSection }
   ]
   ```

2. **Keep-Alive Universal**: Todas las rutas (principales y anidadas) mantienen su estado:
   - `/settings` se mantiene montado
   - `/settings/general` se mantiene montado
   - `/settings/appearance` se mantiene montado

3. **Navegación Unificada**: Un solo sistema de navegación para todo:
   ```tsx
   // Navegar a ruta principal
   navigate('/editor');
   
   // Navegar a ruta anidada
   navigate('/settings/appearance');
   ```

## 🎨 Layout Component Pattern

Para rutas con sub-rutas, usamos un componente layout que renderiza el `<Outlet>`:

```tsx
// SettingsLayoutWithRouter.tsx
export const SettingsLayoutWithRouter = () => {
    return (
        <SettingsLayout
            sidebar={
                <SettingsSidebar>
                    <NavLink to="/settings/general">General</NavLink>
                    <NavLink to="/settings/appearance">Appearance</NavLink>
                </SettingsSidebar>
            }
            content={
                <div className="p-6">
                    <Outlet /> {/* Renderiza la sub-ruta actual */}
                </div>
            }
        />
    );
};
```

## 🔗 Navegación en Rutas Anidadas

```tsx
// Usar NavLink para navegación con estado activo
<NavLink to="/settings/general">
    {({ isActive }) => (
        <Button variant={isActive ? "secondary" : "ghost"}>
            General
        </Button>
    )}
</NavLink>

// Navegación programática
const navigate = useNavigate();
navigate('/settings/appearance');
```

## ✨ Beneficios del Sistema Unificado

### ✅ Ventajas
- **Un solo router**: Eliminamos duplicación de lógica
- **Consistencia**: Misma API para todas las rutas
- **Keep-alive completo**: Estado preservado en todos los niveles
- **URLs correctas**: `/settings/general`, `/settings/appearance`
- **Navegación directa**: Funciona con URLs directas
- **Mantenibilidad**: Un solo sistema que mantener

### 🆚 Comparación

| Aspecto | Sistema Anterior | Sistema Actual |
|---------|------------------|----------------|
| **Routers** | 2 sistemas separados | 1 sistema unificado |
| **Complejidad** | Alta (lógica duplicada) | Baja (un solo sistema) |
| **Consistencia** | Diferentes APIs | API unificada |
| **Mantenimiento** | Doble trabajo | Mantenimiento único |
| **Keep-alive** | Parcial | Completo en todos los niveles |

## 🎯 Agregar Nuevas Rutas Anidadas

### Ejemplo: Agregar Security Settings

```tsx
// 1. Crear el componente
const SecuritySettingsSection = () => (
    <div>Security Settings Content</div>
);

// 2. Agregar a la configuración
{
    path: '/settings',
    component: SettingsLayoutWithRouter,
    children: [
        // ... rutas existentes
        {
            path: '/security',
            component: SecuritySettingsSection,
            title: 'Security Settings',
        },
    ],
}

// 3. Agregar navegación en el layout
<NavLink to="/settings/security">Security</NavLink>
```

## 🌟 Resultado Final

Ahora tenemos un sistema de routing elegante, unificado y potente que:

- ✅ Soporta rutas anidadas como react-router-dom
- ✅ Mantiene keep-alive en todos los niveles  
- ✅ Usa una sola API consistente
- ✅ Elimina duplicación de código
- ✅ Es fácil de extender y mantener

**¡El router está ahora completo y listo para cualquier estructura de rutas que necesites!**
