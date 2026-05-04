import { ProviderError } from "@/lib/providers/errors";
import type {
  AuthProvider,
  AuthUser,
  UserRole,
} from "@/lib/providers/contracts/auth-provider";

// STUB — placeholder so factory.ts compiles.
// Real implementation: Story 8.1 (guest mode + scripted "Maya" identity for the demo walkthrough).
export class MockAuthProvider implements AuthProvider {
  async getCurrentUser(): Promise<AuthUser> {
    return await this.notImplemented("getCurrentUser");
  }
  async login(): Promise<void> {
    await this.notImplemented("login");
  }
  async logout(): Promise<void> {
    await this.notImplemented("logout");
  }
  async requireRole(_role: Exclude<UserRole, "Guest">): Promise<void> {
    await this.notImplemented("requireRole");
  }
  private async notImplemented(method: string): Promise<never> {
    await sleep();
    throw new ProviderError(
      "NOT_IMPLEMENTED",
      `MockAuthProvider.${method} is not yet implemented. See Story 8.1.`,
    );
  }
}

function sleep(): Promise<void> {
  /* c8 ignore next 2 */
  if (process.env.NODE_ENV === "test") return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 150));
}
