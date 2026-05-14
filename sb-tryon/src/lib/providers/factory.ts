// Provider factory — env-var-driven selection between mock and production
// implementations. Server-safe (no React hooks; no "use client").
//
// Demo V1 ships with `NEXT_PUBLIC_PROVIDER_MODE=mock` and uses the stub mocks
// in ./mock/. Production V1 swap is one env var + procurement of the real
// vendor implementations (post-funding). Architecture §4 — Provider DI.

import type { ARProvider } from "@/lib/providers/contracts/ar-provider";
import type { AttributionProvider } from "@/lib/providers/contracts/attribution-provider";
import type { AuthProvider } from "@/lib/providers/contracts/auth-provider";
import type { BookingHandoffProvider } from "@/lib/providers/contracts/booking-handoff-provider";
import type { BSGProvider } from "@/lib/providers/contracts/bsg-provider";
import type { CalendarProvider } from "@/lib/providers/contracts/calendar-provider";
import type { EditorialProvider } from "@/lib/providers/contracts/editorial-provider";
import type { NotificationProvider } from "@/lib/providers/contracts/notification-provider";
import type { ReviewProvider } from "@/lib/providers/contracts/review-provider";
import type { SalonProvider } from "@/lib/providers/contracts/salon-provider";

import { MockARProvider } from "@/lib/providers/mock/MockARProvider";
import { MockAttributionProvider } from "@/lib/providers/mock/MockAttributionProvider";
import { MockAuthProvider } from "@/lib/providers/mock/MockAuthProvider";
import { MockBookingHandoffProvider } from "@/lib/providers/mock/MockBookingHandoffProvider";
import { MockBSGProvider } from "@/lib/providers/mock/MockBSGProvider";
import { MockCalendarProvider } from "@/lib/providers/mock/MockCalendarProvider";
import { MockEditorialProvider } from "@/lib/providers/mock/MockEditorialProvider";
import { MockNotificationProvider } from "@/lib/providers/mock/MockNotificationProvider";
import { MockReviewProvider } from "@/lib/providers/mock/MockReviewProvider";
import { MockSalonProvider } from "@/lib/providers/mock/MockSalonProvider";

export interface Providers {
  ar: ARProvider;
  reviews: ReviewProvider;
  auth: AuthProvider;
  attribution: AttributionProvider;
  notification: NotificationProvider;
  bookingHandoff: BookingHandoffProvider;
  salon: SalonProvider;
  bsg: BSGProvider;
  calendar: CalendarProvider;
  editorial: EditorialProvider;
}

type ProviderMode = "mock" | "production";

// Per-provider env override map. The key is the slot in `Providers`; the value
// is the env-var name a developer can set to flip a single provider's mode
// without touching the global one (architecture §4 — surgical mixing).
const OVERRIDE_ENV_VARS: Record<keyof Providers, string> = {
  ar: "NEXT_PUBLIC_AR_PROVIDER",
  reviews: "NEXT_PUBLIC_REVIEW_PROVIDER",
  auth: "NEXT_PUBLIC_AUTH_PROVIDER",
  attribution: "NEXT_PUBLIC_ATTRIBUTION_PROVIDER",
  notification: "NEXT_PUBLIC_NOTIFICATION_PROVIDER",
  bookingHandoff: "NEXT_PUBLIC_BOOKING_HANDOFF_PROVIDER",
  salon: "NEXT_PUBLIC_SALON_PROVIDER",
  bsg: "NEXT_PUBLIC_BSG_PROVIDER",
  calendar: "NEXT_PUBLIC_CALENDAR_PROVIDER",
  editorial: "NEXT_PUBLIC_EDITORIAL_PROVIDER",
};

function resolveGlobalMode(): ProviderMode {
  const raw = process.env.NEXT_PUBLIC_PROVIDER_MODE;
  if (raw === "production") return "production";
  if (raw === "mock" || raw === undefined || raw === "") return "mock";
  console.warn(
    `[providers] Unrecognized NEXT_PUBLIC_PROVIDER_MODE="${raw}". Falling back to "mock".`,
  );
  return "mock";
}

function resolveSlotMode(slot: keyof Providers, globalMode: ProviderMode): ProviderMode {
  const override = process.env[OVERRIDE_ENV_VARS[slot]];
  if (override === "mock" || override === "production") return override;
  return globalMode;
}

// Production branch reserved for post-funding; falls through to mock for Demo V1
// so a misconfigured env doesn't crash app boot. The `mode` arg is kept on the
// call signature so future production wiring is a localized edit.
function makeAr(_mode: ProviderMode): ARProvider {
  return new MockARProvider();
}
function makeReviews(_mode: ProviderMode): ReviewProvider {
  return new MockReviewProvider();
}
function makeAuth(_mode: ProviderMode): AuthProvider {
  return new MockAuthProvider();
}
function makeAttribution(_mode: ProviderMode): AttributionProvider {
  return new MockAttributionProvider();
}
function makeNotification(_mode: ProviderMode): NotificationProvider {
  return new MockNotificationProvider();
}
function makeBookingHandoff(_mode: ProviderMode): BookingHandoffProvider {
  return new MockBookingHandoffProvider();
}
function makeSalon(_mode: ProviderMode): SalonProvider {
  return new MockSalonProvider();
}
function makeBsg(_mode: ProviderMode): BSGProvider {
  return new MockBSGProvider();
}
function makeCalendar(_mode: ProviderMode): CalendarProvider {
  return new MockCalendarProvider();
}
function makeEditorial(_mode: ProviderMode): EditorialProvider {
  return new MockEditorialProvider();
}

export function createProviders(): Providers {
  const globalMode = resolveGlobalMode();
  return {
    ar: makeAr(resolveSlotMode("ar", globalMode)),
    reviews: makeReviews(resolveSlotMode("reviews", globalMode)),
    auth: makeAuth(resolveSlotMode("auth", globalMode)),
    attribution: makeAttribution(resolveSlotMode("attribution", globalMode)),
    notification: makeNotification(resolveSlotMode("notification", globalMode)),
    bookingHandoff: makeBookingHandoff(resolveSlotMode("bookingHandoff", globalMode)),
    salon: makeSalon(resolveSlotMode("salon", globalMode)),
    bsg: makeBsg(resolveSlotMode("bsg", globalMode)),
    calendar: makeCalendar(resolveSlotMode("calendar", globalMode)),
    editorial: makeEditorial(resolveSlotMode("editorial", globalMode)),
  };
}

export interface CreateMockProvidersOptions {
  /** Per-slot replacements. Story 1.5 adds this so tests and Storybook can
   *  swap in `noopArProvider()` to keep MediaPipe out of the unit + browser
   *  test loop. */
  overrides?: Partial<Providers>;
}

// Always returns mock instances — env-var-independent. Used by tests and by
// Storybook's preview decorator (Story 1.3) so stories never depend on env.
export function createMockProviders(
  options: CreateMockProvidersOptions = {},
): Providers {
  const overrides = options.overrides ?? {};
  return {
    ar: overrides.ar ?? new MockARProvider(),
    reviews: overrides.reviews ?? new MockReviewProvider(),
    auth: overrides.auth ?? new MockAuthProvider(),
    attribution: overrides.attribution ?? new MockAttributionProvider(),
    notification: overrides.notification ?? new MockNotificationProvider(),
    bookingHandoff: overrides.bookingHandoff ?? new MockBookingHandoffProvider(),
    salon: overrides.salon ?? new MockSalonProvider(),
    bsg: overrides.bsg ?? new MockBSGProvider(),
    calendar: overrides.calendar ?? new MockCalendarProvider(),
    editorial: overrides.editorial ?? new MockEditorialProvider(),
  };
}
