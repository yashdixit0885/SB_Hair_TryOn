import { ProviderError } from "@/lib/providers/errors";
import type {
  CalendarInvite,
  CalendarInvitePayload,
  CalendarProvider,
} from "@/lib/providers/contracts/calendar-provider";

// STUB — placeholder so factory.ts compiles.
// Real implementation: Story 5.1 (mock invite-link flow; Production V1 swaps to iCalendar/Google/Outlook).
export class MockCalendarProvider implements CalendarProvider {
  async createInvite(_payload: CalendarInvitePayload): Promise<CalendarInvite> {
    return await this.notImplemented("createInvite");
  }
  private async notImplemented(method: string): Promise<never> {
    await sleep();
    throw new ProviderError(
      "NOT_IMPLEMENTED",
      `MockCalendarProvider.${method} is not yet implemented. See Story 5.1.`,
    );
  }
}

function sleep(): Promise<void> {
  /* c8 ignore next 2 */
  if (process.env.NODE_ENV === "test") return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 150));
}
