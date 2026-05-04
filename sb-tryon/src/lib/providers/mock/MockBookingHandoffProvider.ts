import { ProviderError } from "@/lib/providers/errors";
import type {
  BookingHandoffPayload,
  BookingHandoffProvider,
} from "@/lib/providers/contracts/booking-handoff-provider";

// STUB — placeholder so factory.ts compiles.
// Real implementation: Story 4.7 (placeholder confirmation page; Production V1 swaps to Booksy/Vagaro/Square deep links).
export class MockBookingHandoffProvider implements BookingHandoffProvider {
  async handoff(_payload: BookingHandoffPayload): Promise<{ deepLinkUrl: string }> {
    return await this.notImplemented("handoff");
  }
  private async notImplemented(method: string): Promise<never> {
    await sleep();
    throw new ProviderError(
      "NOT_IMPLEMENTED",
      `MockBookingHandoffProvider.${method} is not yet implemented. See Story 4.7.`,
    );
  }
}

function sleep(): Promise<void> {
  /* c8 ignore next 2 */
  if (process.env.NODE_ENV === "test") return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 150));
}
