import { createTypedBus } from './createTypedBus';

export interface NestMainEventMap {
  'menu:command': [{ commandId: string; payload?: unknown }];
}

export const mainBus = createTypedBus<NestMainEventMap>();

