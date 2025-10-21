import type { ReactNode, SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {}

const baseProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function SvgIcon({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" role="img" {...baseProps} {...props}>
      {children}
    </svg>
  );
}

export function WrenchIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M14.6 3.4a5 5 0 0 0-6.6 5.4l-4 4A2.7 2.7 0 0 0 8.9 18l4-4a5 5 0 0 0 5.4-6.6l-2.8 2.8-2.9-2.8 2.9-2.9Z" />
      <circle cx="8.2" cy="17.8" r="1.4" />
    </SvgIcon>
  );
}

export function PlugZapIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M9 2v4M15 2v4" />
      <rect x="5.5" y="6" width="13" height="9" rx="2" />
      <path d="m11 18 2.5-4H11l2.5-4" />
    </SvgIcon>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m12 3 1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3Z" />
      <path d="m6.5 14 1 2.2L10 17l-2.5 1.1L6.5 20 5.4 18.1 3 17l2.4-0.9L6.5 14Z" />
      <path d="m17.5 14.5 .8 1.7L20 17l-1.7.8-.8 1.7-.8-1.7L15 17l1.7-.8.8-1.7Z" />
    </SvgIcon>
  );
}

export function PaintbrushIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M19 3 10 12" />
      <path d="M15.5 2.5c1.6 1.6 1.6 4.2 0 5.8L10 14" />
      <path d="M9 15c-1.8-1-4.3.2-4.3 2.4 0 1.5 1.2 2.6 2.6 2.6 2.2 0 3.4-2.5 2.4-4.3Z" />
    </SvgIcon>
  );
}

export function SproutIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 22v-7" />
      <path d="M16.5 4a4.5 4.5 0 0 1-4.5 4.5V4Z" />
      <path d="M7.5 9a4.5 4.5 0 0 1 4.5-4.5v4.5Z" />
      <path d="M12 15c-2.5-2.3-5.6-2-7.5-1.2 1 2.6 3.3 3.5 5.3 3.6" />
    </SvgIcon>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="4" y="7" width="16" height="12" rx="2" />
      <path d="M9 7 10.5 4h3L15 7" />
      <circle cx="12" cy="13" r="3.5" />
    </SvgIcon>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M3 6h10v9H3z" />
      <path d="M13 10h4l2 3v2h-6" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="16" cy="18" r="1.6" />
    </SvgIcon>
  );
}

export function DrillIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4 10h9l3-3v10l-3-3H4z" />
      <path d="M13 7V5h3" />
      <path d="M4 14h5" />
    </SvgIcon>
  );
}

export function HammerIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M5 9h7.5l2.5-2.5L13 3.5 10 6H5z" />
      <path d="m12.5 10.5 6 6" />
      <path d="M14 12 9 17" />
    </SvgIcon>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 3 5 6v5c0 4.7 3.4 8 7 10 3.6-2 7-5.3 7-10V6l-7-3Z" />
      <path d="m9.5 12.5 2 2 3.5-3.5" />
    </SvgIcon>
  );
}

export function BadgeCheckIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="7" />
      <path d="m9.2 12.4 1.8 1.8 3.8-3.8" />
    </SvgIcon>
  );
}

export function BaggageClaimIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="5" y="8" width="14" height="10" rx="2" />
      <path d="M9 8V6.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6.5V8" />
      <path d="M9 13h6" />
    </SvgIcon>
  );
}

export function ConciergeIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4.5 17c1.4-2.4 4.3-4 7.5-4s6.1 1.6 7.5 4" />
      <circle cx="12" cy="9" r="3.5" />
      <path d="M6 17h12" />
    </SvgIcon>
  );
}

export function PremiumIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m12 4 2.3 3.7 4.2.6-3 3.2.7 4.4L12 14.9l-4.2 2.4.7-4.4-3-3.2 4.2-.6Z" />
    </SvgIcon>
  );
}

export function GithubIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 2.5c-5.2 0-9.5 4.2-9.5 9.5 0 4.2 2.7 7.7 6.4 9-.1-.7-.1-1.6 0-2.3.1-.7.5-1.4 1.1-1.8-2.2-.3-3.6-1.5-3.6-3.4 0-.9.4-1.7 1-2.3-.4-1 .1-2 .1-2s.8-.1 1.6.7c.7-.2 1.4-.3 2.1-.3s1.4.1 2.1.3c.8-.8 1.6-.7 1.6-.7s.5 1 .1 2c.7.6 1 1.4 1 2.3 0 1.9-1.4 3.1-3.6 3.4.8.6 1.2 1.6 1.2 2.6v2.4c3.7-1.3 6.4-4.8 6.4-9 0-5.3-4.3-9.5-9.5-9.5Z" />
    </SvgIcon>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="3.5" y="8.5" width="4" height="11" rx="1" />
      <rect x="9.5" y="8.5" width="4" height="11" rx="1" />
      <path d="M10 12.3c0-1.8 1.2-3.3 3-3.3s3 1.3 3 3.3v7.2" />
      <circle cx="5.5" cy="5.5" r="1.8" />
    </SvgIcon>
  );
}

export function TwitterIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M21 5.9a6.5 6.5 0 0 1-2.1.7 3.6 3.6 0 0 0 1.6-2 7 7 0 0 1-2.3.9A3.5 3.5 0 0 0 11 8.2a10 10 0 0 1-7-3.6 3.5 3.5 0 0 0 1.1 4.7 3.4 3.4 0 0 1-1.6-.5c0 1.7 1.2 3.3 3 3.6a3.4 3.4 0 0 1-1.6.1 3.5 3.5 0 0 0 3.3 2.5A7 7 0 0 1 3 17.7 9.9 9.9 0 0 0 8.4 19c6.7 0 10.3-5.7 10.3-10.7v-.5A7.5 7.5 0 0 0 21 5.9Z" />
    </SvgIcon>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m4 11 8-6 8 6v9a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1v-9Z" />
    </SvgIcon>
  );
}

export function PhoneCallIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M5.5 4.5c-.8.8-.9 2.5.2 4.6 1 2 2.9 4.3 5.3 5.9 2.3 1.5 4.1 1.6 4.9.8l2-2a1.2 1.2 0 0 0 .1-1.7l-2.4-2.4a1.1 1.1 0 0 0-1.6 0l-1 1c-.6.6-1.6.6-2.6 0-1.3-.9-2.5-2.3-3.2-3.5-.5-.9-.5-1.9 0-2.4l1-1a1.1 1.1 0 0 0 0-1.6L7.3 2.4a1.2 1.2 0 0 0-1.8.1Z" />
    </SvgIcon>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M3.2 11.3 20 4l-7.3 16.8-1.7-6.5-6.5-1Z" />
      <path d="m12.7 12.7 3.5-3.5" />
    </SvgIcon>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.2 7.8 7.5 9.5 4.3-1.7 7.5-4.9 7.5-9.5V6L12 3Z" />
    </SvgIcon>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </SvgIcon>
  );
}

export function HomeSparkIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m4 11 8-6 8 6" />
      <path d="M6 11v7h4v-4h4v4h4v-7" />
      <path d="m8 3 1 .5L8 4l-.5 1L7 4l-1-.5L7 3l.5-1Z" />
    </SvgIcon>
  );
}

