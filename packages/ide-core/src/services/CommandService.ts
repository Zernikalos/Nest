import type { RuntimeEffect } from '../contracts/index.js';

export type CommandHandler = (payload?: unknown) => RuntimeEffect[] | void;

export class CommandService {
    private commands = new Map<string, CommandHandler>();

    register(id: string, handler: CommandHandler): void {
        this.commands.set(id, handler);
    }

    unregister(id: string): void {
        this.commands.delete(id);
    }

    execute(id: string, payload?: unknown): RuntimeEffect[] {
        const handler = this.commands.get(id);
        if (!handler) {
            return [];
        }
        const result = handler(payload);
        return Array.isArray(result) ? result : [];
    }

    has(id: string): boolean {
        return this.commands.has(id);
    }
}
