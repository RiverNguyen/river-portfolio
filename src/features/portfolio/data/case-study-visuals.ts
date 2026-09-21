export type CaseStudyVisualVariant =
  | "tour-filters"
  | "corporate-sections"
  | "auth-shell"
  | "agency-showcase"
  | "catalog-grid"
  | "salon-steps"
  | "locale-toggle"
  | "combo-map"
  | "luxury-scroll"
  | "ai-cinematic"

const VISUAL_BY_PROJECT: Record<string, CaseStudyVisualVariant> = {
  "tour-booking-platform": "tour-filters",
  "corporate-landing-page": "corporate-sections",
  "corporate-website-auth": "auth-shell",
  "agency-website": "agency-showcase",
  "industrial-corporate-site": "catalog-grid",
  "salon-booking-platform": "salon-steps",
  "multilingual-tour-platform": "locale-toggle",
  "travel-combo-platform": "combo-map",
  "luxury-travel-brand": "luxury-scroll",
  "ai-product-brand": "ai-cinematic",
}

export function getCaseStudyVisualVariant(
  projectId: string
): CaseStudyVisualVariant {
  return VISUAL_BY_PROJECT[projectId] ?? "tour-filters"
}
