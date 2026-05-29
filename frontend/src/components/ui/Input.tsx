import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-100',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
