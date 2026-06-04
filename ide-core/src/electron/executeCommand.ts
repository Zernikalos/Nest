/** Payload sent from main to renderer when a menu command should run in the IDE runtime. */
export interface ExecuteCommandMessage {
    commandId: string;
    payload?: unknown;
}
