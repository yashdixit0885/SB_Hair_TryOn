import { ProviderError } from "@/lib/providers/errors";
import type {
  AttributionProvider,
  AttributionTokenPayload,
  ColorChoiceAnalytics,
  DateRange,
  PartnerAttribution,
  StylistAttribution,
  TokenVerifyResult,
} from "@/lib/providers/contracts/attribution-provider";

// STUB — placeholder so factory.ts compiles.
// Real implementation: Story 4.6 (HMAC-SHA256-signed attribution tokens + sample partner dashboard data).
export class MockAttributionProvider implements AttributionProvider {
  async issueToken(
    _payload: Omit<AttributionTokenPayload, "attributionNonce" | "issuedAt">,
  ): Promise<string> {
    return await this.notImplemented("issueToken");
  }
  async verifyToken(_token: string): Promise<TokenVerifyResult> {
    return await this.notImplemented("verifyToken");
  }
  async getAttributionForPartner(
    _partnerId: string,
    _range: DateRange,
  ): Promise<PartnerAttribution> {
    return await this.notImplemented("getAttributionForPartner");
  }
  async getAttributedBookingsForStylist(
    _stylistId: string,
    _range: DateRange,
  ): Promise<StylistAttribution[]> {
    return await this.notImplemented("getAttributedBookingsForStylist");
  }
  async getColorChoiceAnalytics(
    _partnerId: string,
    _range: DateRange,
  ): Promise<ColorChoiceAnalytics> {
    return await this.notImplemented("getColorChoiceAnalytics");
  }
  private async notImplemented(method: string): Promise<never> {
    await sleep();
    throw new ProviderError(
      "NOT_IMPLEMENTED",
      `MockAttributionProvider.${method} is not yet implemented. See Story 4.6.`,
    );
  }
}

function sleep(): Promise<void> {
  /* c8 ignore next 2 */
  if (process.env.NODE_ENV === "test") return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 150));
}
