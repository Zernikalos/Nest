/**
 * Adapter que centraliza todas las referencias a @server
 * Este archivo actúa como punto único de entrada para interactuar con el servidor Nest
 */
export type { ZNestServer, ServerOptions, AppSettings } from "@zstudio-server";
export { SettingsService, nestServerBootstrap, NEST_PORT_FILE } from "@zstudio-server";
