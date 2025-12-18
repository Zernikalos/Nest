# Providers Documentation

This directory contains documentation for React context providers and system integration.

## Architecture Principle

**Providers are used ONLY when React context is needed for integration with external systems.**

For business logic integration, prefer hooks over providers.

## Current Providers

### Active Providers

1. **[ElectronProvider](./electron-provider.md)** - Electron API management
   - Provides Electron event handlers
   - Environment detection
   - IPC communication setup

2. **ThemeProvider** - UI theming
   - Theme context
   - Theme switching

3. **FontProvider** - Font management
   - Font context
   - Font switching

4. **AppearanceProvider** - Appearance settings
   - Combines theme and font

## Integration Pattern

### Electron Integration (Hook-based)

Instead of a provider, Electron integration uses a hook:

```typescript
// In App.tsx
function AppContent() {
    useElectronProjectIntegration() // Hook, not provider
    return <YourApp />
}
```

**Why a hook instead of a provider?**
- No context needed (no data to share)
- Simpler architecture
- Better separation of concerns
- Easier to test

## Deprecated Providers (Removed)

- ~~`ZkProjectProvider`~~ - Replaced by `useElectronProjectIntegration` hook

## Best Practices

1. **Use providers only when context is needed**
2. **Prefer hooks for integration logic**
3. **Minimize provider nesting**
4. **Implement proper cleanup**

