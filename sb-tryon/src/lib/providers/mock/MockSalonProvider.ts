import { ProviderError } from "@/lib/providers/errors";
import type {
  Certification,
  Salon,
  SalonProvider,
  SalonSearchFilters,
  Stylist,
} from "@/lib/providers/contracts/salon-provider";

// STUB — placeholder so factory.ts compiles.
// Real implementation: Story 4.1 (10 curated DFW salon fixtures + search index).
export class MockSalonProvider implements SalonProvider {
  async search(_filters: SalonSearchFilters): Promise<Salon[]> {
    return await this.notImplemented("search");
  }
  async getSalonBySlug(_salonSlug: string): Promise<Salon> {
    return await this.notImplemented("getSalonBySlug");
  }
  async getStylists(_salonSlug: string): Promise<Stylist[]> {
    return await this.notImplemented("getStylists");
  }
  async getCertifications(_salonSlug: string): Promise<Certification[]> {
    return await this.notImplemented("getCertifications");
  }
  private async notImplemented(method: string): Promise<never> {
    await sleep();
    throw new ProviderError(
      "NOT_IMPLEMENTED",
      `MockSalonProvider.${method} is not yet implemented. See Story 4.1.`,
    );
  }
}

function sleep(): Promise<void> {
  /* c8 ignore next 2 */
  if (process.env.NODE_ENV === "test") return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 150));
}
