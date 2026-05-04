import { ProviderError } from "@/lib/providers/errors";
import type {
  NotificationChannel,
  NotificationPayload,
  NotificationProvider,
  ScheduleNotificationPayload,
} from "@/lib/providers/contracts/notification-provider";

// STUB — placeholder so factory.ts compiles.
// Real implementation: Story 8.5 (console + in-app banner mock; SMS/email channels logged only).
export class MockNotificationProvider implements NotificationProvider {
  async schedule(_payload: ScheduleNotificationPayload): Promise<void> {
    await this.notImplemented("schedule");
  }
  async send(_channel: NotificationChannel, _payload: NotificationPayload): Promise<void> {
    await this.notImplemented("send");
  }
  private async notImplemented(method: string): Promise<never> {
    await sleep();
    throw new ProviderError(
      "NOT_IMPLEMENTED",
      `MockNotificationProvider.${method} is not yet implemented. See Story 8.5.`,
    );
  }
}

function sleep(): Promise<void> {
  /* c8 ignore next 2 */
  if (process.env.NODE_ENV === "test") return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 150));
}
