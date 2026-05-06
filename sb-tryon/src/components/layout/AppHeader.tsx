"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface ConsumerHeaderProps {
  variant: "consumer";
  className?: string;
}

interface OperatorSection {
  label: string;
  href: string;
  /** Explicit override; otherwise the link's `href` is matched against `usePathname()`. */
  current?: boolean;
}

interface OperatorHeaderProps {
  variant: "operator";
  sections: OperatorSection[];
  className?: string;
}

interface StylistHeaderProps {
  variant: "stylist";
  className?: string;
}

export type AppHeaderProps =
  | ConsumerHeaderProps
  | OperatorHeaderProps
  | StylistHeaderProps;

const navLinkBase =
  "text-base text-(--color-text-primary) underline-offset-4 transition-colors duration-(--motion-duration-fast) ease-(--motion-ease) hover:text-(--color-accent-primary) hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-primary) rounded-sm";

function ConsumerHeader({ className }: { className?: string }) {
  return (
    <header
      role="banner"
      className={cn(
        "border-b border-(--color-border-subtle) bg-(--color-bg-base) px-6 py-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-6 max-w-(--breakpoint-xl) mx-auto">
        <Link
          href="/"
          className={cn(navLinkBase, "text-lg font-semibold")}
        >
          Sally Beauty Try-On
        </Link>
        <nav aria-label="Primary" className="hidden sm:flex gap-6">
          <Link href="/colors" className={navLinkBase}>
            Browse colors
          </Link>
          <Link href="/salons" className={navLinkBase}>
            Find a salon
          </Link>
        </nav>
        <div className="flex gap-4 items-center">
          <Link href="/saved" className={cn(navLinkBase, "hidden sm:inline")}>
            Saved looks
          </Link>
          <Link href="/account" className={navLinkBase}>
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}

function OperatorHeader({
  sections,
  className,
}: {
  sections: OperatorSection[];
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <aside
      aria-label="Operator navigation"
      className={cn(
        "fixed left-0 top-0 h-screen w-64 border-r border-(--color-border-subtle) bg-(--color-bg-elevated) p-4 flex flex-col",
        className,
      )}
    >
      <Link
        href="/"
        className={cn(
          navLinkBase,
          "block mb-8 text-base font-semibold",
        )}
      >
        Sally Beauty Try-On
      </Link>
      <nav
        aria-label="Operator sections"
        className="flex flex-col gap-1"
      >
        {sections.map((s) => {
          const isCurrent = s.current ?? pathname === s.href;
          return (
            <Link
              key={s.href}
              href={s.href}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "rounded-sm px-3 py-2 text-base text-(--color-text-primary) transition-colors duration-(--motion-duration-fast) ease-(--motion-ease) hover:bg-(--color-bg-sunken) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-primary)",
                "aria-[current=page]:border-l-2 aria-[current=page]:border-(--color-accent-primary) aria-[current=page]:bg-(--color-bg-sunken) aria-[current=page]:font-medium",
              )}
            >
              {s.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function StylistHeader({ className }: { className?: string }) {
  return (
    <header
      role="banner"
      className={cn(
        "border-b border-(--color-border-subtle) bg-(--color-bg-base) px-8 py-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-6">
        <Link
          href="/"
          className={cn(navLinkBase, "text-lg font-semibold")}
        >
          Sally Beauty Try-On
        </Link>
      </div>
    </header>
  );
}

/**
 * Top-level chrome. Three variants matching the three route groups
 * (`(consumer)`, `(operator)`, `(stylist)`). The discriminated union forces
 * `sections` only on the operator variant — TS will error if you supply it
 * elsewhere or omit it for operator. UX-DR3 + UX spec §"App Header & Navigation".
 *
 * `data-density` on the outer wrapper inherits via the CSS-variable cascade
 * into descendant primitives. The operator sidebar is `compact`; consumer +
 * stylist are `comfortable`.
 */
export function AppHeader(props: AppHeaderProps) {
  if (props.variant === "consumer")
    return <ConsumerHeader className={props.className} />;
  if (props.variant === "operator")
    return (
      <OperatorHeader sections={props.sections} className={props.className} />
    );
  return <StylistHeader className={props.className} />;
}
