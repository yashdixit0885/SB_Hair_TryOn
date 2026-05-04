// AttributionProvider — booking attribution chain.
// Mock implementation: src/lib/providers/mock/MockAttributionProvider.ts (Story 4.6).
// Production implementation: HMAC-SHA256 signed deep-link tokens + webhook receiver + BSG product-pull join.

export interface DateRange {
  from: string; // ISO-8601 date
  to: string;
}

export interface AttributionTokenPayload {
  lookId: string;
  colorSlug: string;
  lighting: string;
  brandId: string;
  salonId: string;
  attributionNonce: string; // UUID; unique per issuance for idempotency (NFR33)
  issuedAt: number; // Unix ms
}

export type TokenVerifyResult =
  | { valid: true; payload: AttributionTokenPayload }
  | { valid: false; reason: "tampered" | "expired" | "malformed" };

export interface PartnerAttribution {
  totalAttributedBookings: number;
  target: number;
  byColor: Array<{ colorSlug: string; count: number }>;
  byStylist: Array<{ stylistId: string; count: number }>;
  byWeek: Array<{ week: string; count: number }>;
  conversionRate: number;
  attributedRevenue: number;
}

export interface StylistAttribution {
  stylistId: string;
  textureType: string;
  colorOutcomeAvg: number;
  attributedBookingCount: number;
  fadeWeeksAvg: number;
}

export interface ColorChoiceAnalytics {
  byColor: Array<{ colorSlug: string; brandId: string; count: number; timeRange: DateRange }>;
}

export interface AttributionProvider {
  // Returns signed token string; nonce + issuedAt are added by the implementation.
  issueToken(payload: Omit<AttributionTokenPayload, "attributionNonce" | "issuedAt">): Promise<string>;
  verifyToken(token: string): Promise<TokenVerifyResult>;
  getAttributionForPartner(partnerId: string, range: DateRange): Promise<PartnerAttribution>;
  getAttributedBookingsForStylist(stylistId: string, range: DateRange): Promise<StylistAttribution[]>;
  getColorChoiceAnalytics(partnerId: string, range: DateRange): Promise<ColorChoiceAnalytics>;
}
