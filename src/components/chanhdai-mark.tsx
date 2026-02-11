import { useId } from "react"

export function ChanhDaiMark(props: React.ComponentProps<"svg">) {
  const gradientId = useId().replace(/:/g, "")
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 52"
      fill="none"
      aria-hidden
      {...props}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity={1} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0.75} />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="36"
        fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontSize="32"
        fontWeight="700"
        letterSpacing="0.12em"
        fill={`url(#${gradientId})`}
      >
        RIVER
      </text>
      <rect
        x="0"
        y="42"
        width="72"
        height="2.5"
        rx="1.25"
        fill="currentColor"
        opacity={0.6}
      />
    </svg>
  );
}

export function getMarkSVG(color: string) {
  const escaped = color.replace(/"/g, "'");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 52" fill="none" aria-hidden="true"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${escaped}" stop-opacity="1"/><stop offset="100%" stop-color="${escaped}" stop-opacity="0.75"/></linearGradient></defs><text x="0" y="36" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="32" font-weight="700" letter-spacing="0.12em" fill="url(#g)">RIVER</text><rect x="0" y="42" width="72" height="2.5" rx="1.25" fill="${escaped}" opacity="0.6"/></svg>`;
}
