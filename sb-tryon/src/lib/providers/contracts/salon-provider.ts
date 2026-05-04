// SalonProvider — partner salon catalog + stylist roster.
// Mock implementation: src/lib/providers/mock/MockSalonProvider.ts (Story 4.1 — 10 curated DFW salons).
// Production implementation: signed-partner catalog from Postgres via Drizzle.

export interface SalonSearchFilters {
  zip?: string;
  radius?: number; // miles
  colorSlug?: string;
  textureSpecialty?: string;
}

export interface Certification {
  type: string;
  issuedBy: string;
  earnedAt: string; // ISO-8601
}

export interface Stylist {
  stylistId: string;
  displayName: string;
  certifications: Certification[];
  textureSpecialties: string[];
}

export interface Salon {
  salonId: string;
  salonSlug: string;
  displayName: string;
  city: string;
  state: string;
  zip: string;
  certifications: Certification[];
  colorAccuracyRating: number; // 0-5
  textureSpecialties: string[];
}

export interface SalonProvider {
  search(filters: SalonSearchFilters): Promise<Salon[]>;
  getSalonBySlug(salonSlug: string): Promise<Salon>;
  getStylists(salonSlug: string): Promise<Stylist[]>;
  getCertifications(salonSlug: string): Promise<Certification[]>;
}
