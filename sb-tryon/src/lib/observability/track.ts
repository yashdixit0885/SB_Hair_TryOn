// Telemetry seam (AR11). Demo V1 logs locally only per NFR43; Production V1
// will swap the impl for an OTel exporter via `./exporters.ts` (created in a
// later story — do not block Story 1.5 on it). Event payloads contain
// duration, device class, color IDs — never biometric data, never raw PII.

export type DeviceClass = "laptop" | "mobile" | "unknown";

export type TrackedEvent =
  | {
      name: "tryon.segmentation_completed";
      durationMs: number;
      deviceClass: DeviceClass;
    }
  | { name: "tryon.render_completed"; durationMs: number }
  | { name: "tryon.color_selected"; colorId: string };

/**
 * Demo V1: writes structured event lines to `console.info`. Cheap; visible in
 * the browser devtools; sufficient for the demo dry-run percentile review.
 * Production V1 will replace this implementation with an OTel exporter.
 */
export function track(event: TrackedEvent): void {
  const { name, ...payload } = event;
  // Single-line JSON so the dry-run log scraper can grep easily.
  console.info(`[telemetry] ${name} ${JSON.stringify(payload)}`);
}
