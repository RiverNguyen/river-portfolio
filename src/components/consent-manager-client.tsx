"use client"

import { ClientSideOptionsProvider } from "@c15t/nextjs/client"

import { applyPostHogConsent } from "@/lib/posthog-client"

export function ConsentManagerClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientSideOptionsProvider
      callbacks={{
        onConsentSet({ preferences }) {
            applyPostHogConsent(Boolean(preferences.measurement))
        },
      }}
    >
      {children}
    </ClientSideOptionsProvider>
  )
}
