import { cn } from '@/lib/utils';

const variants: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  pending: 'bg-orange-100 text-orange-700',
  ongoing: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-slate-100 text-slate-600',
  active: 'bg-green-100 text-green-700',
};

export function Badge({
  children,
  status = 'pending',
  className,
}: {
  children: React.ReactNode;
  status?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize',
        variants[status] || variants.pending,
        className
      )}
    >
      {children}
    </span>
  );
}
