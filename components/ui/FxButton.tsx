'use client';

import Link from 'next/link';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';

interface FxButtonBaseProps {
  variant?: Variant;
  icon?: ReactNode;
  loading?: boolean;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & FxButtonBaseProps;
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  FxButtonBaseProps & { href: string };

type FxButtonProps = ButtonProps | AnchorProps;

const variantStyles: Record<Variant, string> = {
  primary: cn(
    'bg-fx-primary text-white shadow-3d',
    'hover:bg-[#3e78ff] active:bg-[#285cff]',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-fx-primary'
  ),
  secondary: cn(
    'bg-white/10 text-white shadow-3d',
    'hover:bg-white/20',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70'
  ),
  ghost: cn(
    'bg-transparent text-white',
    'hover:bg-white/10',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70'
  ),
};

export const FxButton = forwardRef<HTMLButtonElement, FxButtonProps>(
  (
    { className, children, variant = 'primary', icon, loading, ...props },
    ref
  ) => {
    const sharedClasses = cn(
      'inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium',
      'transition-transform duration-[550ms] ease-smooth focus:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-60',
      'hover:-translate-y-1 hover:scale-[1.02]',
      variantStyles[variant],
      className
    );

    if ('href' in props && props.href) {
      const { href, ...rest } = props as AnchorProps;
      return (
        <Link href={href} className={sharedClasses} {...rest}>
          {icon ? <span className="text-lg">{icon}</span> : null}
          <span>{children}</span>
        </Link>
      );
    }

    const buttonProps = props as ButtonProps;

    return (
      <button ref={ref} className={sharedClasses} {...buttonProps}>
        {icon ? <span className="text-lg">{icon}</span> : null}
        <span>{loading ? 'Working…' : children}</span>
      </button>
    );
  }
);

FxButton.displayName = 'FxButton';
