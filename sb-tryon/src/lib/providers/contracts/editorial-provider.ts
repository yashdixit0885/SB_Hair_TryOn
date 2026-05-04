// EditorialProvider — color taxonomy, brand-color mappings, audit-queue admin.
// Mock implementation: src/lib/providers/mock/MockEditorialProvider.ts (Story 2.1 read; Story 7.1 write).
// Production implementation: Postgres-backed editorial admin via Drizzle.

export interface ColorTaxonomy {
  slug: string;
  displayName: string;
  family: string;
  undertone: string;
  isSpecialtyTier: boolean;
  isActive: boolean;
}

export interface Brand {
  brandId: string;
  displayName: string;
  slug: string;
}

export interface BrandColorMapping {
  id: string;
  brandId: string;
  colorSlug: string;
  skuCode: string;
}

export interface AuditLogEntry {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  performedAt: string; // ISO-8601
  before?: unknown;
  after?: unknown;
}

export interface ClassificationFilters {
  status?: "pending" | "accepted" | "rejected";
  sourceClass?: string;
}

export interface ClassificationItem {
  reviewId: string;
  body: string;
  proposedClass: string;
  status: "pending" | "accepted" | "rejected";
}

export interface ClassificationQuality {
  falsePositiveRate: number;
  sampleSize: number;
  calculatedAt: string; // ISO-8601
}

export type CreateColorPayload = Omit<ColorTaxonomy, "isActive"> & { isActive?: boolean };
export type CreateBrandColorMappingPayload = Omit<BrandColorMapping, "id">;

export interface EditorialProvider {
  // Read
  getColorTaxonomy(): Promise<ColorTaxonomy[]>;
  getColorBySlug(slug: string): Promise<ColorTaxonomy>;
  getBrands(): Promise<Brand[]>;
  getBrandColorMappings(): Promise<BrandColorMapping[]>;
  getSpecialtyTierFlag(colorSlug: string): Promise<boolean>;
  getAuditLog(entityType: string, entityId: string): Promise<AuditLogEntry[]>;
  getClassificationQueue(filters: ClassificationFilters): Promise<ClassificationItem[]>;
  getClassificationQuality(): Promise<ClassificationQuality>;
  // Write
  createColor(payload: CreateColorPayload): Promise<ColorTaxonomy>;
  updateColor(slug: string, patch: Partial<ColorTaxonomy>): Promise<ColorTaxonomy>;
  deactivateColor(slug: string, reason: string): Promise<void>;
  setSpecialtyTier(slug: string, isSpecialty: boolean): Promise<void>;
  createBrandColorMapping(payload: CreateBrandColorMappingPayload): Promise<BrandColorMapping>;
  updateBrandColorMapping(id: string, patch: Partial<BrandColorMapping>): Promise<BrandColorMapping>;
  classifyReview(reviewId: string, decision: "accept" | "reject"): Promise<void>;
}
