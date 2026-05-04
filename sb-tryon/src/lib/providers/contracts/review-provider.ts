// ReviewProvider — outcome-anchored reviews across 4 source classes.
// Mock implementation: src/lib/providers/mock/MockReviewProvider.ts (Story 3.1).
// Production implementation: composite — Google Places ingestion + brand feeds + native review store.

export type SourceClass = "native" | "aggregated" | "editorial" | "salon-attested";
export type ReviewVisibility = "public" | "operator"; // operator unlocks private outcome dimensions (FR16, Story 3.6)

export interface ReviewFilters {
  colorSlug?: string;
  brandId?: string;
  salonId?: string;
  stylistId?: string;
  sourceClass?: SourceClass;
  textureType?: string;
  visibility?: ReviewVisibility;
  dimension?: "color-outcome"; // FR16: public ranking shows color-outcome only
}

export interface OutcomeDimensions {
  fadeWeeks?: number;
  colorAccuracy?: number; // 1-5
  damage?: number; // 1-5
  recommend?: boolean;
}

export interface Review {
  id: string;
  colorSlug: string;
  brandId: string;
  sourceClass: SourceClass;
  authorName?: string;
  body: string;
  outcomeDimensions: OutcomeDimensions;
  createdAt: string; // ISO-8601
  hasReply?: boolean;
}

export interface ReviewSubmitPayload {
  colorSlug: string;
  brandId: string;
  body: string;
  outcomeDimensions: OutcomeDimensions;
  onBehalfOfUserId?: string; // stylist-assisted submission (Story 5.4)
}

export interface ReviewRanking {
  colorSlug: string;
  brands: Array<{ brandId: string; score: number }>;
}

export interface ReviewProvider {
  list(filters: ReviewFilters): Promise<Review[]>;
  get(reviewId: string): Promise<Review>;
  submit(payload: ReviewSubmitPayload): Promise<Review>;
  reply(reviewId: string, body: string): Promise<void>;
  getRanking(colorSlug: string): Promise<ReviewRanking>;
}
