'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Logo({ className, showTagline = false, monochrome = false }: { className?: string; showTagline?: boolean; monochrome?: boolean }) {
  const [imgError, setImgError] = useState(false);
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      {imgError ? (
        <span className={cn(
          'flex items-center gap-1 text-lg font-bold',
          monochrome ? 'text-white' : 'text-brand-navy'
        )}>
          <span className="text-brand-orange">S</span>ervDeal
        </span>
      ) : (
        <Image
          src={monochrome ? '/images/logo-mono.png' : '/images/logo.png'}
          alt={BRAND.name}
          width={120}
          height={40}
          className={cn('h-9 w-auto object-contain', monochrome && 'brightness-0 invert')}
          onError={() => setImgError(true)}
          priority
        />
      )}
      {showTagline && (
        <span className="hidden text-[10px] font-medium uppercase tracking-wider text-brand-navy/70 lg:block">
          {BRAND.tagline}
        </span>
      )}
    </Link>
  );
}
