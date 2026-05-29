'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand-orange text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25',
        secondary: 'border-2 border-brand-orange text-brand-orange hover:bg-orange-50',
        navy: 'bg-brand-navy text-white hover:bg-blue-900',
        ghost: 'text-brand-navy hover:bg-slate-100',
        outline: 'border border-slate-200 bg-white text-brand-navy hover:border-brand-orange',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-13 px-8 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = 'Button';
