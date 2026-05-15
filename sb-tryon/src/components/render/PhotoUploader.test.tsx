import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/render";
import { noopArProvider } from "@/test-utils/noop-ar-provider";
import { useConsentStore } from "@/lib/stores/consent";
import { PhotoUploader } from "./PhotoUploader";

// jsdom's `createImageBitmap` is missing — patch with a deterministic stub.
const originalCreateImageBitmap = globalThis.createImageBitmap;
beforeEach(() => {
  // Reset the consent store to its initial state for test isolation.
  useConsentStore.setState({
    consentStatus: "not-consented",
    lastPromptedAt: null,
    sessionId: "",
  });
  globalThis.createImageBitmap = vi.fn(
    async () => ({ width: 100, height: 100 }) as unknown as ImageBitmap,
  );
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(null, { status: 201 }),
  );
  globalThis.URL.createObjectURL = () => "blob:mock-preview";
  globalThis.URL.revokeObjectURL = () => {};
});
afterEach(() => {
  globalThis.createImageBitmap = originalCreateImageBitmap;
  vi.restoreAllMocks();
});

function pngFile(size: number, name = "selfie.png"): File {
  return new File([new Uint8Array(size)], name, { type: "image/png" });
}
function jpegFile(size: number): File {
  return new File([new Uint8Array(size)], "selfie.jpg", { type: "image/jpeg" });
}
function textFile(): File {
  return new File(["hello"], "notes.txt", { type: "text/plain" });
}

function findInput(): HTMLInputElement {
  return screen.getByLabelText(/Upload a clear front-facing photo/i, {
    selector: "input",
  }) as HTMLInputElement;
}

describe("<PhotoUploader />", () => {
  it("renders the empty state with the BIPA-approved heading and passes axe", async () => {
    const { container } = renderWithProviders(
      <PhotoUploader onPhotoConfirmed={vi.fn()} onDeclined={vi.fn()} />,
    );
    expect(
      screen.getByText(/Upload a clear front-facing photo/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Delete photo/i }),
    ).not.toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });

  it("error state: rejects an oversize file with the too-large copy", async () => {
    renderWithProviders(
      <PhotoUploader onPhotoConfirmed={vi.fn()} onDeclined={vi.fn()} />,
    );
    const input = findInput();
    fireEvent.change(input, { target: { files: [pngFile(11 * 1024 * 1024)] } });
    await waitFor(() => {
      expect(screen.getByText(/larger than 10 MB/i)).toBeInTheDocument();
    });
  });

  it("error state: rejects a non-image file with the bad-type copy", async () => {
    renderWithProviders(
      <PhotoUploader onPhotoConfirmed={vi.fn()} onDeclined={vi.fn()} />,
    );
    fireEvent.change(findInput(), { target: { files: [textFile()] } });
    await waitFor(() => {
      expect(screen.getByText(/isn't a photo we can use/i)).toBeInTheDocument();
    });
  });

  it("error state: shows the no-face copy when ar.detectFace returns faceDetected:false", async () => {
    renderWithProviders(
      <PhotoUploader onPhotoConfirmed={vi.fn()} onDeclined={vi.fn()} />,
      { providers: { ar: noopArProvider({ faceDetected: false }) } },
    );
    fireEvent.change(findInput(), { target: { files: [jpegFile(1024)] } });
    await waitFor(() => {
      expect(
        screen.getByText(/We couldn't find a face/i),
      ).toBeInTheDocument();
    });
  });

  it("happy path: opens the ConsentPrompt on a valid face-detected upload", async () => {
    renderWithProviders(
      <PhotoUploader onPhotoConfirmed={vi.fn()} onDeclined={vi.fn()} />,
    );
    fireEvent.change(findInput(), { target: { files: [jpegFile(1024)] } });
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(useConsentStore.getState().lastPromptedAt).not.toBeNull();
  });

  it("consent confirmed: calls onPhotoConfirmed(blob, 'local') after Continue", async () => {
    const onPhotoConfirmed = vi.fn();
    renderWithProviders(
      <PhotoUploader onPhotoConfirmed={onPhotoConfirmed} onDeclined={vi.fn()} />,
    );
    fireEvent.change(findInput(), { target: { files: [jpegFile(1024)] } });
    await waitFor(() => screen.getByRole("dialog"));
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));
    await waitFor(() => {
      expect(onPhotoConfirmed).toHaveBeenCalledTimes(1);
    });
    const [blob, scope] = onPhotoConfirmed.mock.calls[0];
    expect(blob).toBeInstanceOf(Blob);
    expect(scope).toBe("local");
  });

  it("consent declined: calls onDeclined after selecting Decline + Continue", async () => {
    const onDeclined = vi.fn();
    renderWithProviders(
      <PhotoUploader onPhotoConfirmed={vi.fn()} onDeclined={onDeclined} />,
    );
    fireEvent.change(findInput(), { target: { files: [jpegFile(1024)] } });
    await waitFor(() => screen.getByRole("dialog"));
    fireEvent.click(screen.getByLabelText(/Decline/i));
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));
    await waitFor(() => {
      expect(onDeclined).toHaveBeenCalledTimes(1);
    });
  });

  it("Delete photo: appears with an active photo and resets state on click", async () => {
    renderWithProviders(
      <PhotoUploader onPhotoConfirmed={vi.fn()} onDeclined={vi.fn()} />,
      { providers: { ar: noopArProvider({ faceDetected: false }) } },
    );
    fireEvent.change(findInput(), { target: { files: [jpegFile(1024)] } });
    await waitFor(() =>
      screen.getByText(/We couldn't find a face/i),
    );
    const del = screen.getByRole("button", { name: /Delete photo/i });
    fireEvent.click(del);
    await waitFor(() => {
      expect(
        screen.queryByText(/We couldn't find a face/i),
      ).not.toBeInTheDocument();
    });
    expect(useConsentStore.getState().consentStatus).toBe("not-consented");
  });

  it("FR46 invariant: second upload in the same session re-opens the ConsentPrompt", async () => {
    renderWithProviders(
      <PhotoUploader onPhotoConfirmed={vi.fn()} onDeclined={vi.fn()} />,
    );
    // First upload — confirms consent
    fireEvent.change(findInput(), { target: { files: [jpegFile(1024)] } });
    await waitFor(() => screen.getByRole("dialog"));
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    // Delete & re-upload — the prompt MUST re-appear
    fireEvent.click(screen.getByRole("button", { name: /Delete photo/i }));
    fireEvent.change(findInput(), { target: { files: [jpegFile(2048)] } });
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});
