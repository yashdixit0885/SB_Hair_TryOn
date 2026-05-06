import { PageShell } from "@/components/layout/PageShell";

export default function Home() {
  return (
    <PageShell variant="consumer">
      <div className="max-w-3xl mx-auto py-16">
        <h1 className="text-display font-semibold text-(--color-text-primary) tracking-tight">
          Try color before you commit.
        </h1>
        <p className="mt-6 text-lg text-(--color-text-secondary) leading-relaxed">
          Brand-neutral hair color try-on — see yourself in any color, with
          realistic fade, calibrated lighting, and outcome-anchored reviews
          from real customers.
        </p>
      </div>
    </PageShell>
  );
}
