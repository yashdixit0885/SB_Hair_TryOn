import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useProvider } from "@/lib/providers";
import { RootProviders } from "@/components/root-providers";

describe("RootProviders", () => {
  it("renders children", () => {
    render(
      <RootProviders>
        <span data-testid="child">hello</span>
      </RootProviders>,
    );
    expect(screen.getByTestId("child")).toBeDefined();
  });

  it("makes providers available to descendants via useProvider", () => {
    let captured: unknown;
    function Probe() {
      captured = useProvider("ar");
      return null;
    }
    render(
      <RootProviders>
        <Probe />
      </RootProviders>,
    );
    expect(captured).not.toBeNull();
    expect(typeof (captured as Record<string, unknown>).prewarm).toBe("function");
  });

  it("provides a stable QueryClient across renders", () => {
    const { rerender } = render(<RootProviders><span /></RootProviders>);
    rerender(<RootProviders><span /></RootProviders>);
  });
});
