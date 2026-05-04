import { ProviderError } from "@/lib/providers/errors";
import type {
  Review,
  ReviewFilters,
  ReviewProvider,
  ReviewRanking,
  ReviewSubmitPayload,
} from "@/lib/providers/contracts/review-provider";

// STUB — placeholder so factory.ts compiles.
// Real implementation: Story 3.1 (MockReviewProvider with curated JSON fixtures across 4 source classes).
export class MockReviewProvider implements ReviewProvider {
  async list(_filters: ReviewFilters): Promise<Review[]> {
    return await this.notImplemented("list");
  }
  async get(_reviewId: string): Promise<Review> {
    return await this.notImplemented("get");
  }
  async submit(_payload: ReviewSubmitPayload): Promise<Review> {
    return await this.notImplemented("submit");
  }
  async reply(_reviewId: string, _body: string): Promise<void> {
    await this.notImplemented("reply");
  }
  async getRanking(_colorSlug: string): Promise<ReviewRanking> {
    return await this.notImplemented("getRanking");
  }
  private async notImplemented(method: string): Promise<never> {
    await sleep();
    throw new ProviderError(
      "NOT_IMPLEMENTED",
      `MockReviewProvider.${method} is not yet implemented. See Story 3.1.`,
    );
  }
}

function sleep(): Promise<void> {
  /* c8 ignore next 2 */
  if (process.env.NODE_ENV === "test") return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 150));
}
