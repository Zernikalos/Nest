# ElectronProvider

## Overview
The `ElectronProvider` is a React provider that manages Electron-specific functionality and provides access to Electron APIs throughout the React application. It handles the communication bridge between the main Electron process and the renderer process.

## Purpose
- **Electron Context**: Provides Electron APIs to child components
- **Process Communication**: Manages IPC (Inter-Process Communication)
- **Environment Detection**: Determines if running in Electron vs web browser
- **API Access**: Exposes Electron methods to React components

## Architecture
```
App.tsx → ElectronProvider → Electron APIs + IPC
```

## Key Features
1. **IPC Management**: Handles communication with main process
2. **API Exposure**: Provides Electron methods to components
3. **Environment Detection**: Distinguishes between Electron and web
4. **Event Handling**: Manages Electron-specific events

## Dependencies
- Electron main process
- React Context API
- IPC (Inter-Process Communication)

## Usage
```tsx
// In App.tsx
<ElectronProvider>
  <AppContent />
</ElectronProvider>

// In AppContent component
function AppContent() {
    useElectronProjectIntegration() // Hook for Electron integration
    return <YourApp />
}
```

## Available APIs
- **File Operations**: File import, export, management
- **Window Management**: Window controls, sizing, positioning
- **System Integration**: Native OS integration
- **IPC Events**: Custom event handling

## Important Notes
- **Electron Only**: Most functionality only works in Electron environment
- **Main Process Dependency**: Requires Electron main process to be running
- **Security**: Follows Electron security best practices
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Related Components
- `useElectronEvents` - Hook for Electron event handling
- `useElectronProjectIntegration` - Hook for Electron project integration (replaces ZkProjectProvider)
- All components that need Electron APIs
