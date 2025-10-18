const ICON_SIZE = 48
const STROKE = 1.6
const PRIMARY = '#0f3f84'
const ACCENT = '#1fbf8f'

const iconPaths = {
  plumber: (
    <>
      <path d="M12 30h24v6a6 6 0 0 1-6 6h-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 18h6a4 4 0 0 1 4 4v4h-6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 24v-6a6 6 0 0 1 6-6h8v6h-8v26" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="38" r="3" fill={ACCENT} stroke="none" />
    </>
  ),
  electrician: (
    <>
      <path d="M26 6 14 28h12l-4 18 16-24H30l6-16z" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  handyman: (
    <>
      <path d="M16 10a6 6 0 0 1 6-6h4l4 8-4 4 6 6 4-4 8 8-8 8-18-18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 32 6 38l8 8 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  roofer: (
    <>
      <path d="M8 26 24 10l16 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 26v18h20V26" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 44v-8h12v8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  carpenter: (
    <>
      <rect x="10" y="12" width="12" height="24" rx="4" />
      <path d="m22 24 18 18-4 4-18-18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m30 16 6-6 6 6-6 6z" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  cleaner: (
    <>
      <path d="M18 10h12l2 8H16z" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="18" width="20" height="22" rx="6" />
      <path d="M24 18v-8" strokeLinecap="round" />
      <path d="M12 42h24" strokeLinecap="round" />
    </>
  ),
  window: (
    <>
      <rect x="12" y="8" width="24" height="32" rx="3" />
      <path d="M24 8v32M12 24h24" strokeLinecap="round" />
      <path d="m16 12 4 4m8-4-4 4" strokeLinecap="round" />
    </>
  ),
  gutter: (
    <>
      <path d="M10 14h28v6a10 10 0 0 1-10 10H22a6 6 0 0 0-6 6v6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 42h16" strokeLinecap="round" />
      <path d="M28 30v8" strokeLinecap="round" />
    </>
  ),
  appliance: (
    <>
      <rect x="12" y="10" width="24" height="30" rx="6" />
      <circle cx="24" cy="26" r="8" />
      <circle cx="24" cy="26" r="3" fill={ACCENT} stroke="none" />
      <path d="M20 14h8" strokeLinecap="round" />
    </>
  ),
  gardener: (
    <>
      <path d="M18 38c0-8 4-18 12-22" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 16c-6 0-10-4-10-10 6 0 10 4 10 10Z" />
      <path d="M18 38c-4 0-8-4-8-8 4 0 8 4 8 8Z" />
      <path d="M24 34v10" strokeLinecap="round" />
    </>
  ),
  painter: (
    <>
      <path d="M30 8h6v12h-6z" />
      <path d="M12 22h24v8a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 22V10h8v12" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  security: (
    <>
      <path d="M24 6 10 12v12c0 10 6.5 18 14 20 7.5-2 14-10 14-20V12z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 20a4 4 0 0 1 4 4c0 2.5-4 6-4 6s-4-3.5-4-6a4 4 0 0 1 4-4z" />
    </>
  ),
  'smart-home': (
    <>
      <path d="M10 22 24 10l14 12v18H10z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 38h8v-8h-8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 18c3 0 6 3 6 6" strokeLinecap="round" />
      <path d="M18 18c-3 0-6 3-6 6" strokeLinecap="round" />
    </>
  ),
  flooring: (
    <>
      <rect x="12" y="12" width="12" height="12" rx="2" />
      <rect x="24" y="24" width="12" height="12" rx="2" />
      <path d="M24 12h12v12H24zM12 24h12v12H12z" />
    </>
  ),
  default: (
    <>
      <circle cx="24" cy="24" r="16" />
      <path d="M24 12v12l8 8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
}

export function ServiceIcon({ type, className }) {
  const content = iconPaths[type] ?? iconPaths.default
  return (
    <svg
      className={className}
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 48 48"
      fill="none"
      stroke={PRIMARY}
      strokeWidth={STROKE}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="serviceIconAccent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={PRIMARY} />
          <stop offset="100%" stopColor={ACCENT} />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#serviceIconAccent)">
        {content}
      </g>
    </svg>
  )
}

export default ServiceIcon
