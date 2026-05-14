import "@testing-library/jest-dom/vitest";
// Register fake IndexedDB so model-cache tests (and future saved-look code in
// Story 1.12) can exercise the persistence layer under jsdom, which doesn't
// ship a real IndexedDB implementation.
import "fake-indexeddb/auto";
import { expect } from "vitest";
import axe from "axe-core";

// Serialize axe.run calls — axe-core is a singleton that throws "Axe is
// already running" if two runs overlap (e.g. concurrent Vitest workers or
// Promise.all within one test file). The queue keeps runs sequential without
// blocking the rest of the test suite.
let axeQueue = Promise.resolve<void>(undefined);
function queueAxeRun(el: Element): Promise<axe.AxeResults> {
  const run = axeQueue.then(() => axe.run(el));
  axeQueue = run.then(
    () => {},
    () => {}, // keep queue alive even if this run throws
  );
  return run;
}

// In-house toHaveNoViolations matcher built on axe-core (already in
// devDependencies). Avoids adding `@axe-core/react` (dev-time console
// reporter, not an assertion library) or `vitest-axe` (stale fork of the
// abandoned `jest-axe`). No new dep, covered by NFR23.
expect.extend({
  async toHaveNoViolations(received: unknown) {
    if (!(received instanceof Element)) {
      return {
        pass: false,
        message: () =>
          `toHaveNoViolations: expected an Element but received ${Object.prototype.toString.call(received)}`,
      };
    }
    const result = await queueAxeRun(received);
    if (result.violations.length === 0) {
      return { pass: true, message: () => "expected axe violations but found none" };
    }
    const summary = result.violations
      .map(
        (v) =>
          `  • [${v.impact ?? "unknown"}] ${v.id}: ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? "" : "s"})`,
      )
      .join("\n");
    return {
      pass: false,
      message: () =>
        `expected no axe violations but found ${result.violations.length}:\n${summary}\n\nSee https://dequeuniversity.com/rules for fix guidance.`,
    };
  },
});

// JSDOM doesn't implement matchMedia; both axe and Radix probe it. Provide a
// neutral no-match polyfill so component tests don't blow up on first probe.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  });
}

// JSDOM also lacks ResizeObserver; Radix Slider et al. probe it on mount.
if (typeof globalThis.ResizeObserver === "undefined") {
  class NoopResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).ResizeObserver = NoopResizeObserver;
}
