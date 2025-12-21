import { createLogger } from '@/logger';

/**
 * Logger específico para el módulo del editor
 * Proporciona logging estructurado y formateado para todas las operaciones del editor
 */
export const editorLogger = createLogger('editor', {
    enableTimestamp: true,
    enableColors: true,
});

