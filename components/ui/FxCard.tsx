import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface FxCardProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'section' | 'article' | 'div';
}

export function FxCard({ as: Component = 'div', className, ...props }: FxCardProps) {
  return (
    <Component
      className={cn(
        'glass-surface relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-3d transition-transform duration-[550ms] ease-smooth',
        'hover:-translate-y-1 hover:scale-[1.02] focus-within:-translate-y-1 focus-within:scale-[1.02]',
        className
      )}
      {...props}
    />
  );
}
