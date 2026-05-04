"use client";

import { createContext, useContext } from "react";

import type { ARProvider } from "@/lib/providers/contracts/ar-provider";
import type { AttributionProvider } from "@/lib/providers/contracts/attribution-provider";
import type { AuthProvider } from "@/lib/providers/contracts/auth-provider";
import type { BookingHandoffProvider } from "@/lib/providers/contracts/booking-handoff-provider";
import type { BSGProvider } from "@/lib/providers/contracts/bsg-provider";
import type { CalendarProvider } from "@/lib/providers/contracts/calendar-provider";
import type { EditorialProvider } from "@/lib/providers/contracts/editorial-provider";
import type { NotificationProvider } from "@/lib/providers/contracts/notification-provider";
import type { ReviewProvider } from "@/lib/providers/contracts/review-provider";
import type { SalonProvider } from "@/lib/providers/contracts/salon-provider";
import type { Providers } from "@/lib/providers/factory";

// `null` default forces the root layout to wrap the tree in
// <ProvidersContext.Provider value={createProviders()}> — never silently
// undefined, never an "I forgot to wire it" empty stub.
export const ProvidersContext = createContext<Providers | null>(null);

// Strictly-typed overloads — `useProvider("ar")` returns ARProvider,
// `useProvider("reviews")` returns ReviewProvider, etc. Zero `any` casts.
export function useProvider(name: "ar"): ARProvider;
export function useProvider(name: "reviews"): ReviewProvider;
export function useProvider(name: "auth"): AuthProvider;
export function useProvider(name: "attribution"): AttributionProvider;
export function useProvider(name: "notification"): NotificationProvider;
export function useProvider(name: "bookingHandoff"): BookingHandoffProvider;
export function useProvider(name: "salon"): SalonProvider;
export function useProvider(name: "bsg"): BSGProvider;
export function useProvider(name: "calendar"): CalendarProvider;
export function useProvider(name: "editorial"): EditorialProvider;
export function useProvider<K extends keyof Providers>(name: K): Providers[K] {
  const ctx = useContext(ProvidersContext);
  if (ctx === null) {
    throw new Error(
      "useProvider must be used within <ProvidersContext.Provider>. " +
        "Ensure the root layout wraps children in <RootProviders>.",
    );
  }
  return ctx[name];
}
