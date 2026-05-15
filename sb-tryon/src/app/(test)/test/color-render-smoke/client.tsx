"use client";

import { useMemo } from "react";
import { Suspense } from "react";

import { ProvidersContext, createMockProviders } from "@/lib/providers";
import { noopArProvider } from "@/test-utils/noop-ar-provider";
import { ColorRender } from "@/components/render/ColorRender";

// Synthetic 1×1 JPEG fixture — smallest valid Blob that createImageBitmap
// can decode in real browsers. The smoke harness does not need a real photo;
// it only needs the canvas to mount with tabIndex={0} for the keyboard spec.
const TINY_JPEG_B64 =
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJwAB/9k=";

function base64ToBlob(b64: string, mime: string): Blob {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

export function ColorRenderSmokeClient() {
  const providers = useMemo(
    () => createMockProviders({ overrides: { ar: noopArProvider() } }),
    [],
  );

  const photo = useMemo(() => base64ToBlob(TINY_JPEG_B64, "image/jpeg"), []);

  return (
    <ProvidersContext.Provider value={providers}>
      <main
        data-color-render-ready="true"
        style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 640 }}
      >
        <h1>Color Render Smoke Harness</h1>
        <p>Color: auburn (from ?color=auburn URL param)</p>
        <Suspense fallback={<div>Loading…</div>}>
          <ColorRender photo={photo} />
        </Suspense>
      </main>
    </ProvidersContext.Provider>
  );
}
