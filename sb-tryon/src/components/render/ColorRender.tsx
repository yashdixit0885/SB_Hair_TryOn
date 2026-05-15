"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import { type ColorVector, RENDER_CONFIDENCE_THRESHOLD } from "@/lib/ar/color-shift";
import { COLOR_SHIFT_FRAGMENT_SHADER, COLOR_SHIFT_VERTEX_SHADER } from "@/lib/ar/color-shift.glsl";
import { blendAtWeek } from "@/lib/ar/fade-blend";
import { applyLightingPreset, type LightingPreset } from "@/lib/ar/lighting-postprocess";
import { resolveColor } from "@/lib/ar/color-catalog";
import { compositeHslOnly } from "@/lib/ar/canvas-2d-fallback";
import { hasWebGL2Support, getWebGL2Context } from "@/lib/ar/webgl-context";
import { track } from "@/lib/observability/track";
import { useProvider, type SegmentationResult } from "@/lib/providers";
import { useTryOnStore } from "@/lib/stores/try-on";
import { useTryOnParams } from "@/lib/url-state/try-on-params";
import { RenderConfidenceBanner } from "./RenderConfidenceBanner";

type RenderState =
  | "no-color"
  | "segmenting"
  | "rendered"
  | "low-confidence"
  | "error";

export interface ColorRenderProps {
  photo: Blob;
  className?: string;
}

function buildAriaLabel(
  state: RenderState,
  colorId: string | null,
  lightingPreset: LightingPreset,
  fadeWeek: number,
): string {
  const colorName = colorId ?? "color";
  switch (state) {
    case "no-color":
      return "Select a color to preview it on your hair";
    case "segmenting":
      return `Rendering ${colorName} on your hair…`;
    case "rendered":
      return `Render of ${colorName} on your hair, ${lightingPreset} lighting, week ${fadeWeek}`;
    case "low-confidence":
      return "Color render unavailable — showing Type-4 reference photo";
    case "error":
      return "Render failed — tap to retry";
  }
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("[ColorRender] shader compile failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

interface ShaderResources {
  program: WebGLProgram;
  vao: WebGLVertexArrayObject;
}

function buildShaderProgram(gl: WebGL2RenderingContext): ShaderResources | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, COLOR_SHIFT_VERTEX_SHADER);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, COLOR_SHIFT_FRAGMENT_SHADER);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("[ColorRender] shader link failed:", gl.getProgramInfoLog(program));
    return null;
  }

  // Full-screen quad — two triangles covering clip space [-1,1]
  const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
  const vao = gl.createVertexArray();
  if (!vao) return null;
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  if (!buf) return null;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  const aPosition = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  return { program, vao };
}

function renderWithWebGL2(
  gl: WebGL2RenderingContext,
  resources: ShaderResources,
  sourceTexRef: React.MutableRefObject<WebGLTexture | null>,
  maskTexRef: React.MutableRefObject<WebGLTexture | null>,
  imageBitmap: ImageBitmap,
  segResult: SegmentationResult,
  targetColor: ColorVector,
): void {
  const { program, vao } = resources;

  // Source texture — reuse or create
  let srcTex = sourceTexRef.current;
  if (!srcTex) {
    const t = gl.createTexture();
    if (!t) return;
    srcTex = t;
    sourceTexRef.current = srcTex;
  }
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, srcTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageBitmap);

  // Mask texture — single-channel R8
  let maskTex = maskTexRef.current;
  if (!maskTex) {
    const t = gl.createTexture();
    if (!t) return;
    maskTex = t;
    maskTexRef.current = maskTex;
  }
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, maskTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.R8,
    segResult.width, segResult.height, 0,
    gl.RED, gl.UNSIGNED_BYTE, segResult.alphaMask,
  );

  gl.useProgram(program);
  gl.uniform1i(gl.getUniformLocation(program, "uSource"), 0);
  gl.uniform1i(gl.getUniformLocation(program, "uMask"), 1);
  gl.uniform3f(
    gl.getUniformLocation(program, "uTargetLab"),
    targetColor.l,
    targetColor.a,
    targetColor.b,
  );
  gl.uniform1f(gl.getUniformLocation(program, "uPorosity"), 0.0);

  gl.viewport(0, 0, segResult.width, segResult.height);
  gl.bindVertexArray(vao);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.bindVertexArray(null);
}

function ColorRenderInner({ photo, className }: ColorRenderProps) {
  const ar = useProvider("ar");
  const { colorId, lightingPreset, fadeWeek } = useTryOnParams();
  const washesPerWeek = useTryOnStore((s) => s.washesPerWeek);

  const [renderState, setRenderState] = useState<RenderState>("no-color");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const shaderResourcesRef = useRef<ShaderResources | null>(null);
  const sourceTexRef = useRef<WebGLTexture | null>(null);
  const maskTexRef = useRef<WebGLTexture | null>(null);
  const imageBitmapRef = useRef<ImageBitmap | null>(null);
  const segResultRef = useRef<SegmentationResult | null>(null);
  const cancelRef = useRef(false);

  // Stable refs so async callbacks and event listeners always see the latest values.
  // Initialised with current values; synced below via useEffect (not during render).
  const colorIdRef = useRef(colorId);
  const lightingPresetRef = useRef(lightingPreset);
  const fadeWeekRef = useRef(fadeWeek);
  const washesPerWeekRef = useRef(washesPerWeek);

  // Sync refs after every render so async closures always read the latest props
  useEffect(() => {
    colorIdRef.current = colorId;
    lightingPresetRef.current = lightingPreset;
    fadeWeekRef.current = fadeWeek;
    washesPerWeekRef.current = washesPerWeek;
  });

  const ariaLabel = buildAriaLabel(renderState, colorId, lightingPreset, fadeWeek);

  // composite is stable (reads from refs); useCallback with empty deps
  const composite = useCallback(() => {
    const segResult = segResultRef.current;
    const currentColorId = colorIdRef.current;
    const entry = currentColorId ? resolveColor(currentColorId) : null;
    if (!segResult || !entry) return;

    const fadedColor = blendAtWeek({
      startColor: entry.startColor,
      endColor: entry.endColor,
      weekIndex: fadeWeekRef.current,
      washesPerWeek: washesPerWeekRef.current,
    });
    const litColor = applyLightingPreset(fadedColor, lightingPresetRef.current);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = glRef.current;
    const resources = shaderResourcesRef.current;
    const bitmap = imageBitmapRef.current;

    if (gl && resources && bitmap) {
      renderWithWebGL2(gl, resources, sourceTexRef, maskTexRef, bitmap, segResult, litColor);
    } else {
      if (!bitmap) return;
      const offscreen = compositeHslOnly({
        source: bitmap,
        alphaMask: segResult.alphaMask,
        width: segResult.width,
        height: segResult.height,
        targetColor: litColor,
        porosity: { type4Bias: 0 },
      });
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(offscreen, 0, 0);
      }
    }

    setRenderState("rendered");
  }, []); // reads from refs — no reactive deps needed

  // segmentAndRender: stable since it reads colorId from ref; ar is provider singleton
  const segmentAndRender = useCallback(
    async (photoBlob: Blob) => {
      const currentColorId = colorIdRef.current;
      if (!currentColorId) {
        setRenderState("no-color");
        return;
      }
      const t0 = performance.now();
      setRenderState("segmenting");

      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(photoBlob);
      } catch {
        setRenderState("error");
        return;
      }
      if (cancelRef.current) {
        bitmap.close();
        return;
      }
      imageBitmapRef.current?.close();
      imageBitmapRef.current = bitmap;

      let result: SegmentationResult;
      try {
        result = await ar.segment(bitmap);
      } catch {
        setRenderState("error");
        return;
      }
      if (cancelRef.current) return;

      if (result.confidence < RENDER_CONFIDENCE_THRESHOLD) {
        setRenderState("low-confidence");
        return;
      }
      segResultRef.current = result;
      if (cancelRef.current) return;
      composite();
      track({
        name: "tryon.render_completed",
        durationMs: performance.now() - t0,
        confidence: result.confidence,
      });
    },
    [ar, composite],
  );

  // Effect 1: re-segment when photo changes (D-1-5-A serialization)
  useEffect(() => {
    cancelRef.current = false;
    // segmentAndRender is an async function that updates state asynchronously;
    // the initial setState("segmenting") runs after ref-sync effects have fired.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void segmentAndRender(photo);
    return () => {
      cancelRef.current = true;
    };
  }, [photo, segmentAndRender]);

  // Effect 2: re-composite when render params change (no re-segment)
  useEffect(() => {
    if (!segResultRef.current) return;
    composite();
  }, [colorId, lightingPreset, fadeWeek, washesPerWeek, composite]);

  // Mount/cleanup: WebGL2 init + D-1-5-E context-lost listener + resource cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let contextLostTimer: ReturnType<typeof setTimeout> | null = null;
    let onContextLost: ((e: Event) => void) | null = null;
    let onContextRestored: (() => void) | null = null;

    if (hasWebGL2Support()) {
      const gl = getWebGL2Context(canvas);
      if (gl) {
        glRef.current = gl;
        const resources = buildShaderProgram(gl);
        if (resources) {
          shaderResourcesRef.current = resources;
        }

        // D-1-5-E: context lost/restored listeners — stored for cleanup
        onContextLost = (e: Event) => {
          e.preventDefault();
          setRenderState("error");
          console.error("[ColorRender] WebGL2 context lost");
          // Null out stale texture refs — objects from the lost context are invalid
          sourceTexRef.current = null;
          maskTexRef.current = null;
          contextLostTimer = setTimeout(() => {
            gl.getExtension("WEBGL_lose_context")?.restoreContext();
          }, 100);
        };

        onContextRestored = () => {
          const restored = getWebGL2Context(canvas);
          if (restored) {
            glRef.current = restored;
            const newResources = buildShaderProgram(restored);
            if (newResources) {
              shaderResourcesRef.current = newResources;
            }
            // Only re-composite if a valid bitmap is available
            if (imageBitmapRef.current) {
              composite();
            }
          }
        };

        canvas.addEventListener("webglcontextlost", onContextLost);
        canvas.addEventListener("webglcontextrestored", onContextRestored);
      } else {
        // One-time warning: WebGL2 context acquisition failed
        console.warn("[ColorRender] WebGL2 unavailable — using Canvas2D HSL fallback");
      }
    } else {
      // One-time warning: device doesn't support WebGL2
      console.warn("[ColorRender] WebGL2 unavailable — using Canvas2D HSL fallback");
    }

    // Capture GPU resource refs now so the cleanup function can release them.
    // These are NOT DOM node refs; they hold WebGL objects allocated by this
    // effect and never replaced by React re-renders, so capturing at effect-run
    // time is correct for GPU resource lifecycle.
    const capturedSourceTex = sourceTexRef;
    const capturedMaskTex = maskTexRef;

    return () => {
      cancelRef.current = true;
      if (contextLostTimer !== null) clearTimeout(contextLostTimer);
      if (onContextLost) canvas.removeEventListener("webglcontextlost", onContextLost);
      if (onContextRestored) canvas.removeEventListener("webglcontextrestored", onContextRestored);
      imageBitmapRef.current?.close();
      const gl = glRef.current;
      if (gl) {
        const srcTex = capturedSourceTex.current;
        const maskTex = capturedMaskTex.current;
        const resources = shaderResourcesRef.current;
        if (srcTex) gl.deleteTexture(srcTex);
        if (maskTex) gl.deleteTexture(maskTex);
        if (resources) gl.deleteProgram(resources.program);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
    };
  }, [composite]); // composite is stable (useCallback + empty deps)

  return (
    <section aria-label="Hair color try-on">
      {/* Visually hidden live region so screen readers announce state transitions */}
      <div aria-live="polite" className="sr-only">
        {ariaLabel}
      </div>
      {renderState === "low-confidence" ? (
        <RenderConfidenceBanner />
      ) : (
        <canvas
          ref={canvasRef}
          tabIndex={0}
          aria-label={ariaLabel}
          className={className}
          style={renderState === "no-color" ? { display: "none" } : undefined}
        />
      )}
    </section>
  );
}

// Suspense wrapper so callers don't need to manage the boundary themselves.
// ColorRenderInner calls useTryOnParams() → useSearchParams() which requires
// a Suspense ancestor in Next.js App Router.
export function ColorRender(props: ColorRenderProps) {
  return (
    <Suspense fallback={null}>
      <ColorRenderInner {...props} />
    </Suspense>
  );
}
