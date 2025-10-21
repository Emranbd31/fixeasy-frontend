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
    'bg-[linear-gradient(135deg,#4f8cff,#3ddcff)] text-white shadow-[0_18px_30px_rgba(5,17,47,0.38)]',
    'hover:shadow-[0_24px_40px_rgba(5,17,47,0.45)]',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-[color:rgba(5,17,47,0.6)]'
  ),
  secondary: cn(
    'bg-white/12 text-white shadow-[0_16px_26px_rgba(5,17,47,0.32)]',
    'hover:bg-white/18 hover:shadow-[0_22px_32px_rgba(5,17,47,0.38)]',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70 focus-visible:ring-offset-[color:rgba(5,17,47,0.6)]'
  ),
  ghost: cn(
    'bg-transparent text-white/80',
    'hover:bg-white/10 hover:text-white',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70 focus-visible:ring-offset-[color:rgba(5,17,47,0.6)]'
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
