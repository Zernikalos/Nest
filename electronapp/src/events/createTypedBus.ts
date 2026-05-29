import EventEmitter from 'eventemitter3';

type EventMapBase = Record<string, unknown[]>;

export interface TypedBus<EventMap extends EventMapBase> {
  on<K extends keyof EventMap & string>(
    event: K,
    listener: (...args: EventMap[K]) => void,
  ): () => void;
  emit<K extends keyof EventMap & string>(event: K, ...args: EventMap[K]): void;
}

export function createTypedBus<EventMap extends EventMapBase>(): TypedBus<EventMap> {
  const emitter = new EventEmitter<EventMap>();

  return {
    on(event, listener) {
      emitter.on(event, listener as (...args: unknown[]) => void);
      return () => emitter.off(event, listener as (...args: unknown[]) => void);
    },
    emit(event, ...args) {
      emitter.emit(event, ...args);
    },
  };
}
