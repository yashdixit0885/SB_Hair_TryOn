// NotificationProvider — post-booking trigger sequence.
// Mock implementation: src/lib/providers/mock/MockNotificationProvider.ts (Story 8.5 — console + in-app banner).
// Production implementation: Twilio SMS + SendGrid email + native in-app banner.

export type NotificationChannel = "sms-24h" | "email-7d" | "in-app-banner";

export interface ScheduleNotificationPayload {
  type: "post-booking";
  bookingId: string;
  channels: NotificationChannel[];
}

export interface NotificationPayload {
  recipientId: string;
  templateId: string;
  data: Record<string, string>; // template variables
}

export interface NotificationProvider {
  schedule(payload: ScheduleNotificationPayload): Promise<void>;
  send(channel: NotificationChannel, payload: NotificationPayload): Promise<void>;
}
