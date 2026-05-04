import { ProviderError } from "@/lib/providers/errors";
import type {
  BSGProduct,
  BSGProvider,
  BSGReorderSuggestion,
} from "@/lib/providers/contracts/bsg-provider";

// STUB — placeholder so factory.ts compiles.
// Real implementation: Story 6.7 (sample reorder suggestions; Production V1 swaps to BSG product-pull API).
export class MockBSGProvider implements BSGProvider {
  async suggestReorder(_salonId: string): Promise<BSGReorderSuggestion[]> {
    return await this.notImplemented("suggestReorder");
  }
  async getProductInfo(_productId: string): Promise<BSGProduct> {
    return await this.notImplemented("getProductInfo");
  }
  private async notImplemented(method: string): Promise<never> {
    await sleep();
    throw new ProviderError(
      "NOT_IMPLEMENTED",
      `MockBSGProvider.${method} is not yet implemented. See Story 6.7.`,
    );
  }
}

function sleep(): Promise<void> {
  /* c8 ignore next 2 */
  if (process.env.NODE_ENV === "test") return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 150));
}
