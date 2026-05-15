import type { RuntimeEffect } from '../contracts/index.js';

export type EffectHandler = (effect: RuntimeEffect) => void | Promise<void>;

/**
 * Executes runtime effects by type. Reducers and coordinators emit effects;
 * handlers perform side effects (persistence, context sync, etc.).
 */
export class EffectCaller {
    private readonly handlers = new Map<string, EffectHandler>();

    register(type: string, handler: EffectHandler): void {
        this.handlers.set(type, handler);
    }

    unregister(type: string): void {
        this.handlers.delete(type);
    }

    async run(effects: RuntimeEffect[]): Promise<void> {
        for (const effect of effects) {
            const handler = this.handlers.get(effect.type);
            if (handler) {
                await handler(effect);
            }
        }
    }
}
