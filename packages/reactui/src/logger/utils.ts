import { LogLevel } from './LogLevel';
import type { LogContext, LoggerConfig } from './logger';

/**
 * Default logger configuration
 */
export const DEFAULT_CONFIG: LoggerConfig = {
  level: LogLevel.INFO,
  enableTimestamp: true,
  enableColors: true,
  maxContextDepth: 3,
  truncateLongMessages: true,
  maxMessageLength: 1000
};

/**
 * ANSI color codes for console output
 */
export const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 * Get color for log level
 */
export function getLevelColor(level: LogLevel): string {
  switch (level) {
    case LogLevel.ERROR: return COLORS.red;
    case LogLevel.WARN: return COLORS.yellow;
    case LogLevel.INFO: return COLORS.blue;
    case LogLevel.DEBUG: return COLORS.cyan;
    case LogLevel.TRACE: return COLORS.magenta;
    default: return COLORS.white;
  }
}

/**
 * Get level name for display
 */
export function getLevelName(level: LogLevel): string {
  switch (level) {
    case LogLevel.ERROR: return 'ERROR';
    case LogLevel.WARN: return 'WARN ';
    case LogLevel.INFO: return 'INFO ';
    case LogLevel.DEBUG: return 'DEBUG';
    case LogLevel.TRACE: return 'TRACE';
    default: return 'UNKNOWN';
  }
}

/**
 * Format context object for display
 */
export function formatContext(context: LogContext, maxDepth: number = 2, currentDepth: number = 0): string {
  if (!context || typeof context !== 'object') {
    return String(context);
  }

  if (currentDepth >= maxDepth) {
    return '[Object]';
  }

  try {
    const entries = Object.entries(context);
    if (entries.length === 0) return '{}';
    
    const formatted = entries
      .slice(0, 5) // Limit to 5 entries for readability
      .map(([key, value]) => {
        const formattedValue = currentDepth + 1 >= maxDepth 
          ? (typeof value === 'object' ? '[Object]' : String(value))
          : formatContext(value, maxDepth, currentDepth + 1);
        return `${key}: ${formattedValue}`;
      })
      .join(', ');
    
    const suffix = entries.length > 5 ? `... (+${entries.length - 5} more)` : '';
    return `{${formatted}${suffix}}`;
  } catch {
    return '[Circular or Invalid Object]';
  }
}

/**
 * Truncate long messages
 */
export function truncateMessage(message: string, maxLength: number): string {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength - 3) + '...';
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date): string {
  return date.toISOString().split('T')[1].split('.')[0]; // HH:MM:SS format
}

/**
 * Check if logging is enabled for the given level
 */
export function isLoggingEnabled(currentLevel: LogLevel, targetLevel: LogLevel): boolean {
  return targetLevel <= currentLevel;
}

/**
 * Create a namespace string from components
 */
export function createNamespace(...components: string[]): string {
  return components.filter(Boolean).join(':');
}

/**
 * Safe JSON stringify with circular reference handling
 */
export function safeStringify(obj: any, space?: number): string {
  const seen = new WeakSet();
  return JSON.stringify(obj, (_key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular Reference]';
      }
      seen.add(value);
    }
    return value;
  }, space);
}

/**
 * Check if a value is an Error instance
 */
export function isError(value: any): value is Error {
  return value instanceof Error;
}

/**
 * Extract error information from an Error object
 */
export function extractErrorInfo(error: Error): LogContext {
  return {
    message: error.message,
    name: error.name,
    stack: error.stack,
    ...(error.cause && { cause: error.cause })
  };
}

/**
 * Process log arguments to detect and handle Errors automatically
 * Returns processed context and data arrays
 */
export function processLogArgs(
  context?: LogContext, 
  ...data: any[]
): { processedContext: LogContext; processedData: any[] } {
  const processedContext: LogContext = { ...context };
  const processedData: any[] = [];
  
  // Process data array to detect errors
  for (const item of data) {
    if (isError(item)) {
      // Merge error info into context
      Object.assign(processedContext, extractErrorInfo(item));
      // Still include the error object in data for console output
      processedData.push(item);
    } else {
      processedData.push(item);
    }
  }
  
  // Also check context for errors
  if (context) {
    for (const [key, value] of Object.entries(context)) {
      if (isError(value)) {
        // Replace error in context with extracted info
        Object.assign(processedContext, extractErrorInfo(value));
        delete processedContext[key];
        processedContext[`${key}Error`] = extractErrorInfo(value);
      }
    }
  }
  
  return { processedContext, processedData };
}
