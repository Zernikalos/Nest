# Logger System

## Overview

The logger system provides a centralized, configurable logging solution built on top of `loglevel`. It supports multiple log levels, automatic error detection, context management, and global level control.

## Architecture

### Core Components

- **LoggerImpl**: Main logger class implementing the `Logger` interface
- **LogLevel**: Enum defining log levels (ERROR, WARN, INFO, DEBUG, TRACE)
- **LoggerConfig**: Configuration interface for logger instances
- **Global Registry**: Static registry tracking all logger instances for global control

### Key Features

1. **Automatic Error Detection**: Automatically detects and formats Error objects in log arguments
2. **Context Management**: Support for structured context data in logs
3. **Global Level Control**: Set log level for all loggers programmatically
4. **Namespace-based Loggers**: Each logger has a unique namespace for identification
5. **Environment-based Configuration**: Auto-configures based on development/production environment

## Log Levels

```typescript
enum LogLevel {
  ERROR = 0,  // Critical errors only
  WARN = 1,   // Warnings and errors
  INFO = 2,   // Informational messages
  DEBUG = 3,  // Debug information
  TRACE = 4   // Detailed tracing
}
```

## Usage

### Creating Loggers

```typescript
import { createLogger, LogLevel } from '@/logger';

// Basic logger
const logger = createLogger('my-module');

// Logger with custom config
const logger = createLogger('my-module', {
  level: LogLevel.DEBUG,
  enableTimestamp: true,
  enableColors: true
});

// Specialized logger creators
const componentLogger = createComponentLogger('MyComponent');
const featureLogger = createFeatureLogger('authentication');
const apiLogger = createApiLogger('users');
```

### Logging Messages

```typescript
// Basic logging
logger.info('User logged in');
logger.debug('Processing request', { userId: 123 });
logger.error('Failed to connect', error);

// With context
logger.info('Operation completed', {
  duration: 150,
  status: 'success'
});

// Automatic error detection
logger.error('Something went wrong', error); // Error is automatically formatted
logger.error('Context', { error }); // Error in context is also detected
```

### Global Level Control

```typescript
import { setGlobalLogLevel, getGlobalLogLevel, clearGlobalLogLevel, LogLevel } from '@/logger';

// Set level for ALL loggers (existing and future)
setGlobalLogLevel(LogLevel.DEBUG);

// Get current global level
const currentLevel = getGlobalLogLevel();

// Clear global level (allows individual logger levels)
clearGlobalLogLevel();
```

**Important**: When a global level is set, it takes precedence over individual logger levels. All loggers (existing and newly created) will use the global level.

### Environment Configuration

The logger auto-configures based on environment:

- **Development**: Default level is `DEBUG`
- **Production**: Default level is `WARN`
- **Custom**: Set via `VITE_LOG_LEVEL` environment variable

```bash
# Development with debug logs
VITE_LOG_LEVEL=debug npm run dev

# Production with only warnings
VITE_LOG_LEVEL=warn npm run dev
```

## Advanced Features

### Context Management

```typescript
// Add persistent context to a logger
const loggerWithContext = logger.withContext({
  userId: 123,
  sessionId: 'abc-123'
});

loggerWithContext.info('Action performed'); // Includes context automatically

// Clear context
logger.clearContext();
```

### Utility Methods

```typescript
// Console groups
logger.group('Processing Steps');
logger.debug('Step 1');
logger.debug('Step 2');
logger.groupEnd();

// Tables
logger.table(dataArray);

// Timers
logger.time('operation');
// ... do work ...
logger.timeEnd('operation'); // Logs duration
```

### Error Handling

The logger automatically detects Error objects and extracts:
- `message`
- `name`
- `stack`
- `cause` (if present)

```typescript
try {
  // some code
} catch (error) {
  // Error is automatically formatted - no manual extraction needed
  logger.error('Operation failed', error);
  
  // Works with context too
  logger.error('Operation failed', { operation: 'save', error });
}
```

## Configuration Options

```typescript
interface LoggerConfig {
  level: LogLevel;                    // Minimum log level
  enableTimestamp: boolean;           // Show timestamps
  enableColors: boolean;              // ANSI color codes
  maxContextDepth: number;            // Max depth for context formatting
  truncateLongMessages: boolean;      // Truncate long messages
  maxMessageLength: number;           // Max message length
}
```

## Best Practices

### 1. Use Appropriate Namespaces

```typescript
// Good: Descriptive and hierarchical
const logger = createLogger('electron:provider');
const logger = createLogger('keepalive:router');
const logger = createLogger('component:MonacoEditor');

// Avoid: Generic names
const logger = createLogger('logger');
const logger = createLogger('app');
```

### 2. Set Levels Appropriately

```typescript
// For critical modules, set explicit level
const electronLogger = createLogger('electron:provider', {
  level: LogLevel.DEBUG
});

// Use global level for development
if (import.meta.env.DEV) {
  setGlobalLogLevel(LogLevel.DEBUG);
}
```

### 3. Include Context for Debugging

```typescript
// Good: Rich context
logger.debug('Route changed', {
  from: '/old',
  to: '/new',
  timestamp: Date.now()
});

// Avoid: Minimal context
logger.debug('Route changed');
```

### 4. Use Error Detection

```typescript
// Good: Let logger handle error formatting
logger.error('Failed to load', error);

// Avoid: Manual error extraction
logger.error('Failed to load', {
  message: error.message,
  stack: error.stack
});
```

## Examples

### Electron Provider Logger

```typescript
import { createLogger, LogLevel } from '@/logger';

const electronLogger = createLogger('electron:provider', {
  level: LogLevel.DEBUG
});

electronLogger.debug('Registering LoadZko callback');
electronLogger.debug('LoadZko callback triggered', { ev, data });
```

### Router Logger

```typescript
import { createLogger } from '@/logger';

const routerLogger = createLogger('keepalive:router');

export const logRouteChange = (from: string, to: string, context?: string) => {
  routerLogger.info(`Route change: ${from} → ${to}`, { from, to, context });
};

export const logError = (message: string, error?: any, context?: any) => {
  // Error is automatically detected and formatted
  routerLogger.error(message, context, error);
};
```

## Implementation Details

### Logger Registry

All loggers are automatically registered in a static registry (`LoggerImpl.loggerRegistry`). This allows:
- Global level updates for all loggers
- Tracking of all logger instances
- Centralized management

### Level Precedence

1. **Global Level** (if set): Applies to all loggers
2. **Logger Config Level**: Individual logger configuration
3. **Default Level**: `INFO` if not specified

### Integration with loglevel

The logger uses `loglevel` as the underlying logging library:
- Each logger gets its own `loglevel` instance via `log.getLogger(namespace)`
- Levels are mapped: `LogLevel` → `loglevel` numeric levels
- Direct `loglevel` usage is also supported for compatibility

## Migration from console.log

When migrating from `console.log`:

1. **Replace console.log with logger.debug**
   ```typescript
   // Before
   console.log('Debug info', data);
   
   // After
   logger.debug('Debug info', data);
   ```

2. **Replace console.error with logger.error**
   ```typescript
   // Before
   console.error('Error occurred', error);
   
   // After
   logger.error('Error occurred', error); // Auto-formats error
   ```

3. **Use appropriate levels**
   ```typescript
   console.log → logger.debug or logger.info
   console.warn → logger.warn
   console.error → logger.error
   ```

## Troubleshooting

### Logs Not Appearing

1. Check global log level: `getGlobalLogLevel()`
2. Verify logger level: `logger.getLevel()`
3. Ensure level is enabled: `logger.isEnabled(LogLevel.DEBUG)`

### Too Many Logs

```typescript
// Set higher level globally
setGlobalLogLevel(LogLevel.WARN);

// Or for specific logger
logger.setLevel(LogLevel.WARN);
```

### Missing Context

Ensure context is passed as second parameter:
```typescript
// Correct
logger.debug('Message', { context: 'data' });

// Incorrect (context won't be formatted)
logger.debug('Message', 'context');
```

