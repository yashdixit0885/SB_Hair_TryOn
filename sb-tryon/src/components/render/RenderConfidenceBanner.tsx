import { renderCopy } from "@/lib/copy/render";

export function RenderConfidenceBanner() {
  const { headline, body } = renderCopy.confidenceBanner;
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col gap-2 rounded-md border border-(--color-border-default) bg-(--color-bg-elevated) p-4"
    >
      <p className="text-base font-medium text-(--color-text-primary)">{headline}</p>
      <p className="text-sm text-(--color-text-secondary)">{body}</p>
    </div>
  );
}
