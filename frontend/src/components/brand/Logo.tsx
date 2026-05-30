import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Logo({ className, showTagline = false, monochrome = false }: { className?: string; showTagline?: boolean; monochrome?: boolean }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <Image
        src={monochrome ? '/images/logo-mono.png' : '/images/logo.png'}
        alt={BRAND.name}
        width={120}
        height={40}
        className={cn('h-9 w-auto object-contain', monochrome && 'brightness-0 invert')}
        priority
      />
      {showTagline && (
        <span className="hidden text-[10px] font-medium uppercase tracking-wider text-brand-navy/70 lg:block">
          {BRAND.tagline}
        </span>
      )}
    </Link>
  );
}
