import type { CaseStudy } from "@/features/portfolio/data/case-studies"

function pickMetricValue(study: CaseStudy, labelMatch: RegExp) {
  return study.metrics.find((metric) => labelMatch.test(metric.label))?.value
}

export function getCaseStudyOgImagePath(
  study: CaseStudy,
  options?: { label?: string }
) {
  const performance = pickMetricValue(study, /performance/i)
  const lcp = pickMetricValue(study, /^lcp$/i)

  const params = new URLSearchParams({
    title: study.title,
    tagline: study.tagline,
  })

  if (options?.label) {
    params.set("label", options.label)
  }

  if (performance) {
    params.set("performance", performance)
  }

  if (lcp) {
    params.set("lcp", lcp)
  }

  return `/og/case-study?${params.toString()}`
}
