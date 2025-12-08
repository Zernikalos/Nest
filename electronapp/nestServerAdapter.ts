/**
 * Adapter que centraliza todas las referencias a @server
 * Este archivo actúa como punto único de entrada para interactuar con el servidor Nest
 */
export type { ZNestServer, ServerOptions } from "@zernikalos/server";
export { SettingsService, serverBootstrap as nestServerBootstrap } from "@zernikalos/server";
