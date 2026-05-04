// BSGProvider — Beauty Systems Group product-pull + reorder.
// Mock implementation: src/lib/providers/mock/MockBSGProvider.ts (Story 6.7 — one-tap reorder confirmation).
// Production implementation: real BSG product-pull API + reorder endpoints.

export interface BSGProduct {
  productId: string;
  name: string;
  sku: string;
  brandId: string;
}

export interface BSGReorderSuggestion {
  product: BSGProduct;
  suggestedQuantity: number;
  reason: string;
}

export interface BSGProvider {
  suggestReorder(salonId: string): Promise<BSGReorderSuggestion[]>;
  getProductInfo(productId: string): Promise<BSGProduct>;
}
