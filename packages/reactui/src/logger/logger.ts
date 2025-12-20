import log from 'loglevel';
import { 
  DEFAULT_CONFIG, 
  COLORS, 
  getLevelColor, 
  getLevelName, 
  formatContext, 
  truncateMessage, 
  formatTimestamp, 
  isLoggingEnabled,
  processLogArgs,
} from './utils';
import { LogLevel } from './LogLevel';

// Environment-based configuration
const getEnvironmentConfig = () => {
  const isDev = import.meta.env?.DEV || process.env.NODE_ENV === 'development';
  const isProd = import.meta.env?.PROD || process.env.NODE_ENV === 'production';
  
  // Get log level from environment variables
  const envLogLevel = import.meta.env?.VITE_LOG_LEVEL || process.env.LOG_LEVEL;
  
  return {
    isDev,
    isProd,
    envLogLevel
  };
};

// Map our LogLevel to loglevel's numeric levels
// loglevel: 0=TRACE, 1=DEBUG, 2=INFO, 3=WARN, 4=ERROR, 5=SILENT
const mapToLoglevel = (level: LogLevel): log.LogLevelNumbers => {
  switch (level) {
    case LogLevel.TRACE: return 0;
    case LogLevel.DEBUG: return 1;
    case LogLevel.INFO: return 2;
    case LogLevel.WARN: return 3;
    case LogLevel.ERROR: return 4;
    default: return 2; // INFO as default
  }
};

// Auto-configure logging based on environment
const autoConfigureLogging = () => {
  const { isDev, isProd, envLogLevel } = getEnvironmentConfig();
  
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
  } else if (isProd) {
    // Production defaults
    setGlobalLogLevel(LogLevel.WARN);
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
 * Main Logger implementation using loglevel library internally
 */
export class LoggerImpl implements Logger {
  // Static registry of all logger instances
  private static readonly loggerRegistry = new Set<LoggerImpl>();
  
  // Static global log level that affects all loggers
  private static globalLogLevel: LogLevel | null = null;
  
  private config: LoggerConfig;
  private context: LogContext = {};
  private logInstance: log.Logger;
  private namespace: string;
  private groupStack: string[] = [];
  private timers: Map<string, number> = new Map();
  
  // Static methods to access registry and global level
  static getRegistry(): Set<LoggerImpl> {
    return LoggerImpl.loggerRegistry;
  }
  
  static getGlobalLogLevel(): LogLevel | null {
    return LoggerImpl.globalLogLevel;
  }
  
  static setGlobalLogLevel(level: LogLevel | null): void {
    LoggerImpl.globalLogLevel = level;
  }

  constructor(namespace: string, config: Partial<LoggerConfig> = {}) {
    this.namespace = namespace;
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Create loglevel instance for this namespace
    this.logInstance = log.getLogger(namespace);
    
    // Register this logger in the static registry
    LoggerImpl.loggerRegistry.add(this);
    
    // Apply global log level if set, otherwise use config level
    if (LoggerImpl.globalLogLevel !== null) {
      this.config.level = LoggerImpl.globalLogLevel;
    }
    
    // Set log level based on config or global level
    this.updateLogLevel();
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
    // If global log level is set, individual loggers should respect it
    // But we still allow setting it for when global level is cleared
    this.config.level = level;
    this.updateLogLevel();
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

    // Process arguments to automatically detect and handle Errors
    const { processedContext, processedData } = processLogArgs(context, ...data);
    const mergedContext = { ...this.context, ...processedContext };
    const timestamp = new Date();
    
    // Create log entry
    const entry: LogEntry = {
      level,
      namespace: this.namespace,
      message,
      context: mergedContext,
      timestamp,
      data: processedData
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

    // Format context
    let contextStr = '';
    if (context && Object.keys(context).length > 0) {
      contextStr = ` ${formatContext(context, this.config.maxContextDepth)}`;
    }

    // Build formatted message with prefix
    const prefix = this.config.enableTimestamp 
      ? `[${formatTimestamp(timestamp)}] `
      : '';
    
    const levelPrefix = this.config.enableColors
      ? `${getLevelColor(level)}${getLevelName(level)}${COLORS.reset}`
      : getLevelName(level);
    
    const fullMessage = `${prefix}[${this.namespace}] ${levelPrefix} ${displayMessage}${contextStr}`;

    // Use loglevel library as primary output mechanism
    switch (level) {
      case LogLevel.ERROR:
        this.logInstance.error(fullMessage, ...(data || []));
        break;
      case LogLevel.WARN:
        this.logInstance.warn(fullMessage, ...(data || []));
        break;
      case LogLevel.INFO:
        this.logInstance.info(fullMessage, ...(data || []));
        break;
      case LogLevel.DEBUG:
        this.logInstance.debug(fullMessage, ...(data || []));
        break;
      case LogLevel.TRACE:
        this.logInstance.trace(fullMessage, ...(data || []));
        break;
    }
  }

  private updateLogLevel(): void {
    // Use global level if set, otherwise use config level
    const effectiveLevel = LoggerImpl.globalLogLevel !== null ? LoggerImpl.globalLogLevel : this.config.level;
    const loglevelLevel = mapToLoglevel(effectiveLevel);
    this.logInstance.setLevel(loglevelLevel, false);
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
 * Set global log level for all loggers (existing and future)
 * This function updates all currently registered loggers and sets the default
 * level for any new loggers that will be created.
 */
export function setGlobalLogLevel(level: LogLevel): void {
  // Store the global level
  LoggerImpl.setGlobalLogLevel(level);
  
  // Update all existing loggers
  LoggerImpl.getRegistry().forEach(logger => {
    logger.setLevel(level);
  });
  
  // Also set the default loglevel instance for any direct usage
  log.setLevel(mapToLoglevel(level), false);
}

/**
 * Get the current global log level
 */
export function getGlobalLogLevel(): LogLevel | null {
  return LoggerImpl.getGlobalLogLevel();
}

/**
 * Clear the global log level, allowing individual loggers to use their own levels
 */
export function clearGlobalLogLevel(): void {
  LoggerImpl.setGlobalLogLevel(null);
}

// Auto-configure logging on module load
autoConfigureLogging();
