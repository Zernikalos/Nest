# Coding Standards & Best Practices

## Overview

This document outlines the coding standards, patterns, and best practices for the Zernikalos Studio React UI project. These standards ensure consistency, maintainability, and optimal performance across the codebase.

## 🌐 Language Standards

### English Only (Required)
All code, comments, documentation, and identifiers must be written in English:

```typescript
// ✅ Correct - English comments and code
export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    // Update user profile when data changes
    const handleProfileUpdate = (newData: ProfileData) => {
        updateUserProfile(newData);
    };
    
    return (
        <div className="user-profile">
            <h2>User Profile</h2>
            {/* Display user information */}
            <UserInfo data={user} />
        </div>
    );
};

// ❌ Incorrect - Spanish comments or identifiers
export const PerfilUsuario: React.FC<PerfilUsuarioProps> = ({ usuario }) => {
    // Actualizar perfil cuando cambien los datos
    const manejarActualizacionPerfil = (nuevosDatos: DatosPerfil) => {
        actualizarPerfilUsuario(nuevosDatos);
    };
    
    return (
        <div className="perfil-usuario">
            <h2>Perfil de Usuario</h2>
            {/* Mostrar información del usuario */}
            <InfoUsuario datos={usuario} />
        </div>
    );
};
```

### Naming Conventions in English
- **Variables**: `userName`, `isLoading`, `handleSubmit`
- **Functions**: `getUserData`, `validateInput`, `processResults`
- **Components**: `UserProfile`, `DataTable`, `NavigationMenu`
- **Types/Interfaces**: `UserData`, `ApiResponse`, `FormState`
- **Constants**: `API_ENDPOINTS`, `DEFAULT_TIMEOUT`, `ERROR_MESSAGES`

### Comments and Documentation
All comments must explain the **WHY**, not the **WHAT**, and be written in clear English:

```typescript
// ✅ Good - Explains the reasoning
// Use debouncing to prevent excessive API calls during typing
const debouncedSearch = useMemo(() => 
    debounce(searchFunction, 300), [searchFunction]
);

// ❌ Bad - States the obvious or uses Spanish
// Call the search function with debounce
// Usar debounce para evitar llamadas excesivas
```

## 📦 Export/Import Patterns

### Named Exports (Required)
All components and utilities must use named exports for better tree-shaking and explicit imports:

```typescript
// ✅ Correct - Named exports
export const MyComponent: React.FC<MyComponentProps> = ({ prop }) => {
    return <div>{prop}</div>;
};

export const MyUtility = (param: string) => {
    return param.toUpperCase();
};

// ❌ Incorrect - Default exports
const MyComponent: React.FC<MyComponentProps> = ({ prop }) => {
    return <div>{prop}</div>;
};
export default MyComponent;
```

### Import Patterns
```typescript
// ✅ Correct - Named imports
import { MyComponent, MyUtility } from './MyModule';
import { Button } from '@/components/ui/button';

// ❌ Incorrect - Default imports
import MyComponent from './MyModule';
```

### Index File Exports
Use index files to create clean module boundaries:

```typescript
// src/components/MyModule/index.ts
export { MyComponent } from './MyComponent';
export { MyUtility } from './MyUtility';
export type { MyComponentProps } from './MyComponent';
```

## 🏗️ Component Architecture

### Component Structure
```typescript
import React from 'react';
import { ComponentDependency } from './dependency';

// Types first
interface ComponentProps {
    prop: string;
    onAction?: () => void;
}

// Component implementation
export const Component: React.FC<ComponentProps> = ({ 
    prop, 
    onAction 
}) => {
    // Hooks
    const [state, setState] = useState('');
    
    // Event handlers
    const handleClick = () => {
        onAction?.();
    };
    
    // Render
    return (
        <div onClick={handleClick}>
            {prop}
        </div>
    );
};
```

### Custom Hooks
```typescript
// Use descriptive names with 'use' prefix
export const useMyFeature = (config: Config) => {
    const [state, setState] = useState();
    
    // Return object with descriptive names
    return {
        data: state,
        loading: isLoading,
        error: error,
        actions: {
            refresh: handleRefresh,
            update: handleUpdate
        }
    };
};
```

## 🎨 Styling Standards

### Tailwind CSS Classes
```typescript
// ✅ Correct - Organized class order
<div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">

// Group related classes
const styles = {
    container: 'flex flex-col h-full w-full',
    header: 'flex items-center justify-between p-4 border-b',
    content: 'flex-1 overflow-auto p-6'
};
```

### CSS Variables
Use CSS variables for consistent theming:
```css
/* Use semantic color names */
.my-component {
    background-color: var(--background);
    color: var(--foreground);
    border: 1px solid var(--border);
}
```

## 📁 File Organization

### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── custom/         # Project-specific components
├── pages/              # Page components
├── providers/          # React context providers
├── stores/            # Zustand stores
├── hooks/             # Custom hooks
├── lib/               # Utilities and helpers
└── types/             # TypeScript type definitions
```

### File Naming
- **Components**: PascalCase (`MyComponent.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useMyHook.ts`)
- **Utilities**: camelCase (`myUtility.ts`)
- **Types**: camelCase (`myTypes.ts`)
- **Stores**: camelCase with Store suffix (`myStore.ts`)

## 🔧 TypeScript Standards

### Type Definitions
```typescript
// Use interfaces for component props
interface ComponentProps {
    title: string;
    isActive?: boolean;
    onSelect: (id: string) => void;
}

// Use types for unions and complex types
type ViewMode = 'form' | 'code' | 'preview';
type Status = 'idle' | 'loading' | 'success' | 'error';
```

### Generic Types
```typescript
// Use descriptive generic names
interface ApiResponse<TData = unknown> {
    data: TData;
    status: number;
    message: string;
}

// Constrain generics when appropriate
interface Repository<TEntity extends { id: string }> {
    findById(id: string): Promise<TEntity>;
    save(entity: TEntity): Promise<void>;
}
```

## 🔄 State Management

### Zustand Stores
```typescript
interface MyStore {
    // State
    data: MyData[];
    loading: boolean;
    error: string | null;
    
    // Actions
    fetchData: () => Promise<void>;
    updateItem: (id: string, updates: Partial<MyData>) => void;
    reset: () => void;
}

export const useMyStore = create<MyStore>((set, get) => ({
    // Initial state
    data: [],
    loading: false,
    error: null,
    
    // Actions
    fetchData: async () => {
        set({ loading: true, error: null });
        try {
            const data = await api.fetchData();
            set({ data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
    
    updateItem: (id, updates) => {
        set(state => ({
            data: state.data.map(item => 
                item.id === id ? { ...item, ...updates } : item
            )
        }));
    },
    
    reset: () => set({ data: [], loading: false, error: null })
}));
```

### React Context
```typescript
// Context with proper typing
interface MyContextType {
    state: MyState;
    actions: MyActions;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const useMyContext = () => {
    const context = useContext(MyContext);
    if (context === undefined) {
        throw new Error('useMyContext must be used within MyProvider');
    }
    return context;
};
```

## 🧪 Testing Patterns

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
    it('renders with correct props', () => {
        render(<MyComponent title="Test Title" />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
    
    it('handles user interactions', () => {
        const onSelect = jest.fn();
        render(<MyComponent onSelect={onSelect} />);
        
        fireEvent.click(screen.getByRole('button'));
        expect(onSelect).toHaveBeenCalledWith('expected-value');
    });
});
```

## 📝 Documentation Standards

### Component Documentation
```typescript
/**
 * MyComponent displays data in a structured format
 * 
 * @example
 * ```tsx
 * <MyComponent 
 *   data={myData} 
 *   onSelect={(id) => console.log(id)} 
 * />
 * ```
 */
export const MyComponent: React.FC<MyComponentProps> = ({ ... }) => {
    // Implementation
};
```

### Code Comments
```typescript
// ✅ Correct - English comments explaining WHY
const processData = (data: RawData[]) => {
    // Transform data to match UI expectations
    // This prevents unnecessary re-renders in child components
    return data.map(item => ({
        ...item,
        displayName: item.name || 'Unnamed Item'
    }));
};

// ❌ Incorrect - Spanish comments or explaining WHAT
const procesarDatos = (datos: RawData[]) => {
    // Transformar los datos para que coincidan con las expectativas de la UI
    // Mapear cada elemento del array
    return datos.map(item => ({
        ...item,
        displayName: item.name || 'Elemento sin nombre'
    }));
};
```

## 🚀 Performance Best Practices

### React Optimization
```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
    return <ComplexVisualization data={data} />;
});

// Use useMemo for expensive calculations
const processedData = useMemo(() => {
    return heavyProcessing(rawData);
}, [rawData]);

// Use useCallback for event handlers passed to children
const handleSelect = useCallback((id: string) => {
    onSelect(id);
}, [onSelect]);
```

### Bundle Optimization
```typescript
// Use dynamic imports for code splitting
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Import only what you need from libraries
import { debounce } from 'lodash-es';
// Instead of: import _ from 'lodash';
```

## ⚠️ Error Handling

### Component Error Boundaries
```typescript
interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<
    React.PropsWithChildren<{}>,
    ErrorBoundaryState
> {
    constructor(props: React.PropsWithChildren<{}>) {
        super(props);
        this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }
    
    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} />;
        }
        
        return this.props.children;
    }
}
```

### Async Error Handling
```typescript
const useAsyncOperation = () => {
    const [state, setState] = useState({
        data: null,
        loading: false,
        error: null
    });
    
    const execute = async (operation: () => Promise<any>) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            const data = await operation();
            setState({ data, loading: false, error: null });
        } catch (error) {
            setState(prev => ({ 
                ...prev, 
                loading: false, 
                error: error instanceof Error ? error.message : 'Unknown error'
            }));
        }
    };
    
    return { ...state, execute };
};
```

## 🔍 Code Review Checklist

### Before Submitting
- [ ] **All code, comments, and identifiers are in English**
- [ ] All exports are named exports
- [ ] All imports use named imports
- [ ] TypeScript types are properly defined
- [ ] Components are properly memoized if needed
- [ ] Error handling is implemented
- [ ] Comments explain WHY, not WHAT
- [ ] No console.log statements in production code
- [ ] Proper file naming conventions followed

### Code Quality
- [ ] Single responsibility principle followed
- [ ] DRY principle applied appropriately
- [ ] Proper separation of concerns
- [ ] Consistent code formatting
- [ ] No unused variables or imports
- [ ] Proper TypeScript strict mode compliance

## 📚 Resources

### Documentation
- [React TypeScript Best Practices](https://react-typescript-cheatsheet.netlify.app/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Testing Library**: Component testing
