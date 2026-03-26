# Testing Guide - Nested Outlets

Esta guía te ayudará a probar la nueva funcionalidad de outlets anidados implementada en KeepAliveRouter.

## Cómo Probar

### 1. Ejecutar la Aplicación

```bash
cd packages/reactui
npm run dev
```

### 2. Navegar a la Página de Prueba

1. Abre la aplicación en tu navegador
2. Ve a la página **Exporter** (debería estar en la navegación)
3. Verás dos pestañas: "Test Simple" y "Ejemplo Avanzado"

### 3. Test Simple

En la pestaña "Test Simple":

1. **Observa los bordes de colores** que indican los niveles:
   - 🔵 Azul: Nivel 0 (Root Layout)
   - 🟢 Verde: Nivel 1 (Home Page)  
   - 🟠 Naranja: Nivel 1 (Parent Layout)
   - 🔴 Rojo: Nivel 2 (Child Layout)
   - 🟣 Morado: Nivel 3 (Grandchild Page)

2. **Navega entre rutas**:
   - Haz clic en "Home" → Debería mostrar solo el contenido verde (nivel 1)
   - Haz clic en "Parent" → Debería mostrar el layout naranja (nivel 1)
   - Haz clic en "Child" → Debería mostrar naranja + rojo (niveles 1 y 2)
   - Haz clic en "Grandchild" → Debería mostrar naranja + rojo + morado (niveles 1, 2 y 3)

3. **Verifica el comportamiento Keep-Alive**:
   - Navega entre diferentes rutas
   - Regresa a rutas anteriores
   - El estado debería mantenerse en cada nivel

### 4. Ejemplo Avanzado

En la pestaña "Ejemplo Avanzado":

1. **Prueba la navegación principal**:
   - Home → Dashboard → Settings

2. **Prueba la navegación anidada en Dashboard**:
   - Dashboard Overview → Analytics → Reports

3. **Prueba la navegación de tercer nivel en Reports**:
   - All Reports → Sales → Users

4. **Verifica Keep-Alive**:
   - Navega por diferentes secciones
   - Regresa a secciones anteriores
   - El estado debería preservarse en todos los niveles

## Qué Verificar

### ✅ Comportamiento Correcto

1. **Renderizado por Niveles**:
   - Cada outlet renderiza solo el contenido de su nivel
   - Los outlets anidados no interfieren entre sí
   - La jerarquía visual es correcta

2. **Navegación**:
   - Los links funcionan correctamente
   - La URL se actualiza apropiadamente
   - El historial del navegador funciona (botones atrás/adelante)

3. **Keep-Alive**:
   - El estado se mantiene al navegar entre rutas
   - Los componentes no se desmontan cuando se ocultan
   - El estado persiste en todos los niveles de anidación

4. **Información de Depuración**:
   - Cada componente muestra su nivel correcto
   - La ruta actual se muestra correctamente
   - Los logs de consola (si están habilitados) muestran información coherente

### ❌ Problemas Potenciales

Si encuentras alguno de estos problemas, hay un bug:

1. **Renderizado Incorrecto**:
   - Múltiples componentes del mismo nivel se muestran simultáneamente
   - Componentes de diferentes niveles se superponen incorrectamente
   - Los outlets no muestran el contenido esperado

2. **Navegación Rota**:
   - Los links no funcionan
   - La URL no se actualiza
   - El historial del navegador no funciona

3. **Keep-Alive Roto**:
   - El estado se pierde al navegar
   - Los componentes se desmontan cuando deberían mantenerse
   - Los datos ingresados desaparecen

## Debugging

### Habilitar Logs de Debug

Para ver logs detallados del router:

```bash
# Terminal 1: Habilitar todos los logs
npm run dev:debug:router

# O específicos:
npm run dev:debug:outlet  # Solo outlets
npm run dev:debug:hooks   # Solo hooks
npm run dev:debug:nav     # Solo navegación
```

### Usar useOutletLevel Hook

En cualquier componente, puedes usar:

```tsx
import { useOutletLevel } from '@/keepaliverouter';

const MyComponent = () => {
  const { level } = useOutletLevel();
  console.log('Current outlet level:', level);
  
  return <div>Level: {level}</div>;
};
```

## Casos de Prueba Específicos

### Caso 1: Navegación Profunda
1. Ve directamente a `/parent/child/grandchild` (usando la URL)
2. Verifica que todos los niveles se rendericen correctamente
3. Navega hacia atrás nivel por nivel

### Caso 2: Keep-Alive Multi-Nivel
1. Ve a "Parent" y haz cambios imaginarios (como escribir en un input)
2. Ve a "Child" y haz más cambios
3. Ve a "Grandchild" y haz más cambios
4. Navega de vuelta: Parent → Child → Grandchild
5. Verifica que todos los cambios se mantengan

### Caso 3: Navegación Lateral
1. Ve a "Parent/Child"
2. Regresa a "Home"
3. Ve de nuevo a "Parent/Child"
4. Verifica que el estado se mantenga

## Resultado Esperado

Si todo funciona correctamente:
- ✅ Los outlets anidados funcionan como React Router
- ✅ Cada nivel renderiza solo su contenido correspondiente
- ✅ La funcionalidad keep-alive se preserva en todos los niveles
- ✅ La navegación es fluida y consistente
- ✅ El estado se mantiene correctamente en cada nivel

¡La implementación de outlets anidados está funcionando perfectamente! 🎉
