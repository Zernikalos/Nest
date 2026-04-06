/// <reference types="vite/client" />

declare module 'splitpanes' {
  import type { DefineComponent } from 'vue';
  export const Splitpanes: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export const Pane: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
}

// declare module '@zernikalos/zernikalos' {
//   const zernikalos: unknown;
//   export { zernikalos };
// }

declare module '*.json' {
  const value: any;
  export default value;
}
