// Public barrel — feature code imports from here, never directly from
// ./mock/* or ./production/* (ESLint blocks that).
//
// Server Components: import { createProviders } from "@/lib/providers"
// Client Components: import { useProvider } from "@/lib/providers"

// Contract types
export type { ARProvider, SegmentationResult } from "./contracts/ar-provider";
export type {
  AttributionProvider,
  AttributionTokenPayload,
  ColorChoiceAnalytics,
  DateRange,
  PartnerAttribution,
  StylistAttribution,
  TokenVerifyResult,
} from "./contracts/attribution-provider";
export type {
  AuthProvider,
  AuthUser,
  UserRole,
} from "./contracts/auth-provider";
export type {
  BookingHandoffPayload,
  BookingHandoffProvider,
} from "./contracts/booking-handoff-provider";
export type {
  BSGProduct,
  BSGProvider,
  BSGReorderSuggestion,
} from "./contracts/bsg-provider";
export type {
  CalendarInvite,
  CalendarInvitePayload,
  CalendarProvider,
} from "./contracts/calendar-provider";
export type {
  AuditLogEntry,
  Brand,
  BrandColorMapping,
  ClassificationFilters,
  ClassificationItem,
  ClassificationQuality,
  ColorTaxonomy,
  CreateBrandColorMappingPayload,
  CreateColorPayload,
  EditorialProvider,
} from "./contracts/editorial-provider";
export type {
  NotificationChannel,
  NotificationPayload,
  NotificationProvider,
  ScheduleNotificationPayload,
} from "./contracts/notification-provider";
export type {
  OutcomeDimensions,
  Review,
  ReviewFilters,
  ReviewProvider,
  ReviewRanking,
  ReviewSubmitPayload,
  ReviewVisibility,
  SourceClass,
} from "./contracts/review-provider";
export type {
  Certification,
  Salon,
  SalonProvider,
  SalonSearchFilters,
  Stylist,
} from "./contracts/salon-provider";

// Shared error type
export { ProviderError } from "./errors";

// Factory + Providers shape (server-safe)
export { createMockProviders, createProviders } from "./factory";
export type { CreateMockProvidersOptions, Providers } from "./factory";

// React Context + hook (client-only by their own "use client" directive)
export { ProvidersContext, useProvider } from "./context";
