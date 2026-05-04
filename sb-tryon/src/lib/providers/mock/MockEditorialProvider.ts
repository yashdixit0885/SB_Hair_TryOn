import { ProviderError } from "@/lib/providers/errors";
import type {
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
} from "@/lib/providers/contracts/editorial-provider";

// STUB — placeholder so factory.ts compiles.
// Real implementation: Story 2.1 (read methods, taxonomy + brand-mapping fixtures); Story 7.1 (write side).
export class MockEditorialProvider implements EditorialProvider {
  // Read
  async getColorTaxonomy(): Promise<ColorTaxonomy[]> {
    return await this.notImplemented("getColorTaxonomy");
  }
  async getColorBySlug(_slug: string): Promise<ColorTaxonomy> {
    return await this.notImplemented("getColorBySlug");
  }
  async getBrands(): Promise<Brand[]> {
    return await this.notImplemented("getBrands");
  }
  async getBrandColorMappings(): Promise<BrandColorMapping[]> {
    return await this.notImplemented("getBrandColorMappings");
  }
  async getSpecialtyTierFlag(_colorSlug: string): Promise<boolean> {
    return await this.notImplemented("getSpecialtyTierFlag");
  }
  async getAuditLog(_entityType: string, _entityId: string): Promise<AuditLogEntry[]> {
    return await this.notImplemented("getAuditLog");
  }
  async getClassificationQueue(_filters: ClassificationFilters): Promise<ClassificationItem[]> {
    return await this.notImplemented("getClassificationQueue");
  }
  async getClassificationQuality(): Promise<ClassificationQuality> {
    return await this.notImplemented("getClassificationQuality");
  }
  // Write
  async createColor(_payload: CreateColorPayload): Promise<ColorTaxonomy> {
    return await this.notImplemented("createColor");
  }
  async updateColor(_slug: string, _patch: Partial<ColorTaxonomy>): Promise<ColorTaxonomy> {
    return await this.notImplemented("updateColor");
  }
  async deactivateColor(_slug: string, _reason: string): Promise<void> {
    await this.notImplemented("deactivateColor");
  }
  async setSpecialtyTier(_slug: string, _isSpecialty: boolean): Promise<void> {
    await this.notImplemented("setSpecialtyTier");
  }
  async createBrandColorMapping(
    _payload: CreateBrandColorMappingPayload,
  ): Promise<BrandColorMapping> {
    return await this.notImplemented("createBrandColorMapping");
  }
  async updateBrandColorMapping(
    _id: string,
    _patch: Partial<BrandColorMapping>,
  ): Promise<BrandColorMapping> {
    return await this.notImplemented("updateBrandColorMapping");
  }
  async classifyReview(_reviewId: string, _decision: "accept" | "reject"): Promise<void> {
    await this.notImplemented("classifyReview");
  }
  private async notImplemented(method: string): Promise<never> {
    await sleep();
    throw new ProviderError(
      "NOT_IMPLEMENTED",
      `MockEditorialProvider.${method} is not yet implemented. See Story 2.1 (read) / 7.1 (write).`,
    );
  }
}

function sleep(): Promise<void> {
  /* c8 ignore next 2 */
  if (process.env.NODE_ENV === "test") return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 150));
}
