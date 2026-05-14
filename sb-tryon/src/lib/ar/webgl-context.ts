// AR pipeline — WebGL2 capability probe + context factory (AR5).
// Story 1.7 (`ColorRender`) uses `hasWebGL2Support` to branch between the
// WebGL2 path and `compositeHslOnly` from `./canvas-2d-fallback`.

/**
 * Returns a WebGL2 rendering context for the given canvas, or `null` if the
 * browser/device cannot provide one. Never throws.
 */
export function getWebGL2Context(
  canvas: HTMLCanvasElement,
): WebGL2RenderingContext | null {
  try {
    return canvas.getContext("webgl2");
  } catch {
    return null;
  }
}

// Cached result so repeated calls don't each allocate a real WebGL context
// (browsers cap simultaneous contexts ~8-16; repeatedly probing from React
// renders could trip context-lost). The cached value is computed once at
// first call.
let cachedWebGL2Support: boolean | null = null;

/**
 * Capability probe used at app boot. Safe under SSR (returns `false` when
 * `document` is undefined). Cheap; can be called repeatedly — the underlying
 * context probe runs at most once per page-load.
 */
export function hasWebGL2Support(): boolean {
  if (typeof document === "undefined") return false;
  if (cachedWebGL2Support !== null) return cachedWebGL2Support;
  try {
    const probe = document.createElement("canvas");
    const ctx = probe.getContext("webgl2");
    cachedWebGL2Support = ctx !== null;
    return cachedWebGL2Support;
  } catch {
    cachedWebGL2Support = false;
    return false;
  }
}

/** Test-only: reset the cached probe result. */
export function _resetWebGL2SupportCache(): void {
  cachedWebGL2Support = null;
}
