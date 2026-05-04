// AuthProvider — guest mode in Demo V1; Sally Rewards SSO (OAuth 2.0 PKCE) in Production V1.
// Mock implementation: src/lib/providers/mock/MockAuthProvider.ts (Story 8.1).
// Production implementation: Sally Rewards SSO with HMAC-SHA256-signed HTTP-only cookies.

export type UserRole = "Consumer" | "Stylist" | "SalonPartner" | "EditorialCurator" | "Guest";

export type AuthUser =
  | { role: "Guest" }
  | {
      userId: string;
      role: Exclude<UserRole, "Guest">;
      displayName: string;
      sallyRewardsId?: string;
      partnerId?: string; // set for SalonPartner role
    };

export interface AuthProvider {
  getCurrentUser(): Promise<AuthUser>;
  login(): Promise<void>;
  logout(): Promise<void>;
  // Throws ProviderError with code "UNAUTHORIZED" (no session) or "FORBIDDEN" (wrong role).
  requireRole(role: Exclude<UserRole, "Guest">): Promise<void>;
}
