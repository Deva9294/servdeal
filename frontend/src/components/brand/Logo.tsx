import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Logo({ className, showTagline = false }: { className?: string; showTagline?: boolean }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <Image src="/images/logo.png" alt={BRAND.name} width={140} height={48} className="h-10 w-auto object-contain" priority />
      {showTagline && (
        <span className="hidden text-[10px] font-medium uppercase tracking-wider text-brand-navy/70 lg:block">
          {BRAND.tagline}
        </span>
      )}
    </Link>
  );
}
