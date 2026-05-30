'use client';

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white card-shadow border border-slate-100 p-6 animate-pulse ${className}`}>
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonPulse() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-10 w-10 rounded-full border-4 border-brand-orange border-t-transparent animate-spin" />
    </div>
  );
}
