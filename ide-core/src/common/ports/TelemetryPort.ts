/** Telemetry or analytics. Optional. */
export interface TelemetryPort {
    track(event: string, properties?: Record<string, unknown>): void;
}
