import { cn } from '@/lib/utils';

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-2xl bg-white card-shadow border border-slate-100', className)}>
      {children}
    </div>
  );
}
