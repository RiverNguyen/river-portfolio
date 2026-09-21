type PostHogClient = {
  __loaded: boolean
  init: (key: string, options: Record<string, unknown>) => void
  capture: (name: string, properties?: Record<string, unknown>) => void
  opt_in_capturing: () => void
  opt_out_capturing: () => void
  has_opted_out_capturing: () => boolean
}

let pendingConsent: boolean | null = null

function loadPostHog() {
  return import("posthog-js").then(
    (mod) => mod.default as unknown as PostHogClient
  )
}

export function applyPostHogConsent(measurement: boolean) {
  pendingConsent = measurement
  void loadPostHog().then((posthog) => {
    if (!posthog.__loaded) return
    if (measurement) posthog.opt_in_capturing()
    else posthog.opt_out_capturing()
  })
}

export function capturePostHog(
  name: string,
  properties?: Record<string, unknown>
) {
  void loadPostHog().then((posthog) => {
    if (!posthog.__loaded) return
    posthog.capture(name, properties)
  })
}

export function initPostHogWhenIdle() {
  if (process.env.NODE_ENV !== "production") return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

  const start = () => {
    void loadPostHog().then((posthog) => {
      if (posthog.__loaded) return

      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST,
        defaults: "2025-05-24",
        cookieless_mode: "on_reject",
        disable_surveys: true,
        disable_session_recording: true,
        disable_external_dependency_loading: true,
        capture_heatmaps: false,
      })

      if (pendingConsent === true) posthog.opt_in_capturing()
      else posthog.has_opted_out_capturing()
    })
  }

  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(start, { timeout: 4000 })
  } else {
    setTimeout(start, 1)
  }
}
