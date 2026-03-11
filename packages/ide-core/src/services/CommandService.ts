import type { RuntimeEffect } from '../contracts/index.js';

/** Handler invoked when a command is executed. May return effects for the runtime to process. */
export type CommandHandler = (payload?: unknown) => RuntimeEffect[] | void;

/**
 * Registry and executor for commands by id.
 * Used by the runtime to wire menu/IPC actions; adapters register handlers.
 */
export class CommandService {
    private commands = new Map<string, CommandHandler>();

    /** Register a handler for a command id. Overwrites any existing handler. */
    register(id: string, handler: CommandHandler): void {
        this.commands.set(id, handler);
    }

    /** Remove the handler for a command id. */
    unregister(id: string): void {
        this.commands.delete(id);
    }

    /** Execute a command by id. Returns effects from the handler, or an empty array if not found. */
    execute(id: string, payload?: unknown): RuntimeEffect[] {
        const handler = this.commands.get(id);
        if (!handler) {
            return [];
        }
        const result = handler(payload);
        return Array.isArray(result) ? result : [];
    }

    /** Whether a command is registered. */
    has(id: string): boolean {
        return this.commands.has(id);
    }
}
