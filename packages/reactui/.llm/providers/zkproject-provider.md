# ZkProjectProvider

## Overview
The `ZkProjectProvider` is a React provider component that handles the integration between Electron events and the Zustand store for Zernikalos project management. It acts as a bridge between the Electron main process and the React application state.

## Purpose
- **Electron Integration**: Manages file import events from the Electron main process
- **Environment Detection**: Detects if the app is running in Electron environment
- **Event Registration**: Sets up and cleans up Electron event listeners
- **Error Handling**: Sets appropriate errors when not in Electron environment

## Architecture
```
App.tsx → ZkProjectProvider → useElectronEvents + useZkProjectStore
```

## Key Responsibilities
1. **Event Listener Setup**: Registers `onImportFile` callback with Electron
2. **Environment Validation**: Checks `isElectron` flag from `useElectronEvents`
3. **Error Management**: Sets error state when Electron is not available
4. **Cleanup**: Properly removes event listeners on unmount

## Dependencies
- `useElectronEvents` - Hook for Electron communication
- `useZkProjectStore` - Zustand store for project state
- React `useEffect` - For lifecycle management

## Usage
```tsx
// In App.tsx
<ZkProjectProvider>
  <RouterProvider router={router} />
</ZkProjectProvider>
```

## Event Flow
1. **App Start**: Provider mounts and registers Electron listeners
2. **File Import**: Electron sends file data → `handleFileImport` in store
3. **State Update**: Store updates with conversion results
4. **Cleanup**: Listeners removed on unmount

## Important Notes
- **No State Management**: This provider doesn't manage state directly
- **Electron Only**: File import functionality only works in Electron environment
- **Single Instance**: Should be used once at the app root level
- **Automatic Setup**: No manual configuration needed

## Related Components
- `useZkProjectStore` - State management
- `useElectronEvents` - Electron communication
- `useZkProject` - Public hook for components
