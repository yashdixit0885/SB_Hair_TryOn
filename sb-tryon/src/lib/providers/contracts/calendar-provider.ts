// CalendarProvider — appointment invite generation.
// Mock implementation: src/lib/providers/mock/MockCalendarProvider.ts (Story 5.1 — mock invite link).
// Production implementation: real iCalendar / Google Calendar / Outlook integration.

export interface CalendarInvitePayload {
  title: string;
  startAt: string; // ISO-8601
  durationMinutes: number;
  location?: string;
  description?: string;
  attendeeEmail?: string;
}

export interface CalendarInvite {
  inviteUrl: string;
  calendarFormat: "ical" | "google" | "outlook";
}

export interface CalendarProvider {
  createInvite(payload: CalendarInvitePayload): Promise<CalendarInvite>;
}
