import debug from 'debug';
import { 
  DEFAULT_CONFIG, 
  COLORS, 
  getLevelColor, 
  getLevelName, 
  formatContext, 
  truncateMessage, 
  formatTimestamp, 
  isLoggingEnabled,
} from './utils';
import { LogLevel } from './LogLevel';

// Environment-based configuration
const getEnvironmentConfig = () => {
  const isDev = import.meta.env?.DEV || process.env.NODE_ENV === 'development';
  const isProd = import.meta.env?.PROD || process.env.NODE_ENV === 'production';
  
  // Get log level from environment variables
  const envLogLevel = import.meta.env?.VITE_LOG_LEVEL || process.env.LOG_LEVEL;
  const envDebugNamespaces = import.meta.env?.VITE_DEBUG_NAMESPACES || process.env.DEBUG_NAMESPACES;
  
  return {
    isDev,
    isProd,
    envLogLevel,
    envDebugNamespaces
  };
};

// Auto-configure logging based on environment
const autoConfigureLogging = () => {
  const { isDev, isProd, envLogLevel, envDebugNamespaces } = getEnvironmentConfig();
  
  if (envLogLevel) {
    // Parse environment log level
    const levelMap: Record<string, LogLevel> = {
      'error': LogLevel.ERROR,
      'warn': LogLevel.WARN,
      'info': LogLevel.INFO,
      'debug': LogLevel.DEBUG,
      'trace': LogLevel.TRACE
    };
    
    const level = levelMap[envLogLevel.toLowerCase()];
    if (level !== undefined) {
      setGlobalLogLevel(level);
    }
  } else if (isDev) {
    // Development defaults
    setGlobalLogLevel(LogLevel.DEBUG);
    if (envDebugNamespaces) {
      enableDebug(envDebugNamespaces.split(','));
    } else {
      enableDebug('*');
    }
  } else if (isProd) {
    // Production defaults
    setGlobalLogLevel(LogLevel.WARN);
    disableDebug();
  }
};


export interface LogContext {
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  namespace: string;
  message: string;
  context?: LogContext;
  timestamp: Date;
  data?: any[];
}

export interface LoggerConfig {
  level: LogLevel;
  enableTimestamp: boolean;
  enableColors: boolean;
  maxContextDepth: number;
  truncateLongMessages: boolean;
  maxMessageLength: number;
}

export interface Logger {
  error(message: string, context?: LogContext, ...data: any[]): void;
  warn(message: string, context?: LogContext, ...data: any[]): void;
  info(message: string, context?: LogContext, ...data: any[]): void;
  debug(message: string, context?: LogContext, ...data: any[]): void;
  trace(message: string, context?: LogContext, ...data: any[]): void;
  
  // Utility methods
  group(label: string, collapsed?: boolean): void;
  groupEnd(): void;
  table(data: any): void;
  time(label: string): void;
  timeEnd(label: string): void;
  
  // Context management
  withContext(context: LogContext): Logger;
  clearContext(): Logger;
  
  // Configuration
  setLevel(level: LogLevel): void;
  getLevel(): LogLevel;
  isEnabled(level: LogLevel): boolean;
}

/**
 * Main Logger implementation using debug library internally
 */
export class LoggerImpl implements Logger {
  private config: LoggerConfig;
  private context: LogContext = {};
  private debugInstance: debug.Debugger;
  private namespace: string;
  private groupStack: string[] = [];
  private timers: Map<string, number> = new Map();

  constructor(namespace: string, config: Partial<LoggerConfig> = {}) {
    this.namespace = namespace;
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Initialize debug instance
    this.debugInstance = debug(namespace);
    
    // Set debug level based on config
    this.updateDebugLevel();
  }

  // Core logging methods
  error(message: string, context?: LogContext, ...data: any[]): void {
    this.log(LogLevel.ERROR, message, context, data);
  }

  warn(message: string, context?: LogContext, ...data: any[]): void {
    this.log(LogLevel.WARN, message, context, data);
  }

  info(message: string, context?: LogContext, ...data: any[]): void {
    this.log(LogLevel.INFO, message, context, data);
  }

  debug(message: string, context?: LogContext, ...data: any[]): void {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  trace(message: string, context?: LogContext, ...data: any[]): void {
    this.log(LogLevel.TRACE, message, context, data);
  }

  // Utility methods
  group(label: string, collapsed: boolean = false): void {
    if (!this.isEnabled(LogLevel.DEBUG)) return;
    
    this.groupStack.push(label);
    if (collapsed) {
      console.groupCollapsed(label);
    } else {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (!this.isEnabled(LogLevel.DEBUG) || this.groupStack.length === 0) return;
    
    this.groupStack.pop();
    console.groupEnd();
  }

  table(data: any): void {
    if (!this.isEnabled(LogLevel.DEBUG)) return;
    console.table(data);
  }

  time(label: string): void {
    if (!this.isEnabled(LogLevel.DEBUG)) return;
    this.timers.set(label, performance.now());
    console.time(label);
  }

  timeEnd(label: string): void {
    if (!this.isEnabled(LogLevel.DEBUG)) return;
    const startTime = this.timers.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.debug(`Timer ${label}: ${duration.toFixed(2)}ms`);
      this.timers.delete(label);
    }
    console.timeEnd(label);
  }

  // Context management
  withContext(context: LogContext): Logger {
    const newLogger = new LoggerImpl(this.namespace, this.config);
    newLogger.context = { ...this.context, ...context };
    newLogger.groupStack = [...this.groupStack];
    newLogger.timers = new Map(this.timers);
    return newLogger;
  }

  clearContext(): Logger {
    this.context = {};
    return this;
  }

  // Configuration
  setLevel(level: LogLevel): void {
    this.config.level = level;
    this.updateDebugLevel();
  }

  getLevel(): LogLevel {
    return this.config.level;
  }

  isEnabled(level: LogLevel): boolean {
    return isLoggingEnabled(this.config.level, level);
  }

  // Private methods
  private log(level: LogLevel, message: string, context?: LogContext, data: any[] = []): void {
    if (!this.isEnabled(level)) return;

    const mergedContext = { ...this.context, ...context };
    const timestamp = new Date();
    
    // Create log entry
    const entry: LogEntry = {
      level,
      namespace: this.namespace,
      message,
      context: mergedContext,
      timestamp,
      data
    };

    // Format and output the log
    this.outputLog(entry);
  }

  private outputLog(entry: LogEntry): void {
    const { level, message, context, timestamp, data } = entry;
    
    // Truncate message if needed
    const displayMessage = this.config.truncateLongMessages 
      ? truncateMessage(message, this.config.maxMessageLength)
      : message;

    // Build prefix
    let prefix = '';
    
    if (this.config.enableTimestamp) {
      prefix += `[${formatTimestamp(timestamp)}] `;
    }
    
    prefix += `[${this.namespace}] `;
    
    if (this.config.enableColors) {
      const levelColor = getLevelColor(level);
      prefix += `${levelColor}${getLevelName(level)}${COLORS.reset} `;
    } else {
      prefix += `${getLevelName(level)} `;
    }

    // Format context
    let contextStr = '';
    if (context && Object.keys(context).length > 0) {
      contextStr = ` ${formatContext(context, this.config.maxContextDepth)}`;
    }

    // Output to console with appropriate method
    const fullMessage = `${prefix}${displayMessage}${contextStr}`;
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(fullMessage, ...(data || []));
        break;
      case LogLevel.WARN:
        console.warn(fullMessage, ...(data || []));
        break;
      case LogLevel.INFO:
        console.info(fullMessage, ...(data || []));
        break;
      case LogLevel.DEBUG:
      case LogLevel.TRACE:
        // Use debug library for debug/trace levels
        if (this.debugInstance.enabled) {
          this.debugInstance(`${displayMessage}${contextStr}`, ...(data || []));
        }
        break;
    }
  }

  private updateDebugLevel(): void {
    // Set debug level based on config
    const debugLevel = this.config.level >= LogLevel.DEBUG ? '*' : '';
    debug.enable(`${this.namespace}${debugLevel}`);
  }
}

/**
 * Create a new logger instance
 */
export function createLogger(namespace: string, config?: Partial<LoggerConfig>): Logger {
  return new LoggerImpl(namespace, config);
}

/**
 * Create a logger for a specific component/module
 */
export function createComponentLogger(componentName: string, config?: Partial<LoggerConfig>): Logger {
  return createLogger(`component:${componentName}`, config);
}

/**
 * Create a logger for a specific feature/domain
 */
export function createFeatureLogger(featureName: string, config?: Partial<LoggerConfig>): Logger {
  return createLogger(`feature:${featureName}`, config);
}

/**
 * Create a logger for API calls
 */
export function createApiLogger(apiName: string, config?: Partial<LoggerConfig>): Logger {
  return createLogger(`api:${apiName}`, config);
}

/**
 * Global logger instance for general application logging
 */
export const globalLogger = createLogger('app');



/**
 * Set global log level for all loggers
 */
export function setGlobalLogLevel(level: LogLevel): void {
  globalLogger.setLevel(level);
  
  // Update debug library global setting
  const debugLevel = level >= LogLevel.DEBUG ? '*' : '';
  debug.enable(`*${debugLevel}`);
}

/**
 * Enable/disable debug for specific namespaces
 */
export function enableDebug(namespaces: string | string[]): void {
  const nsArray = Array.isArray(namespaces) ? namespaces : [namespaces];
  const debugString = nsArray.join(',');
  debug.enable(debugString);
}

/**
 * Disable all debug output
 */
export function disableDebug(): void {
  debug.disable();
}

// Auto-configure logging on module load
autoConfigureLogging();
