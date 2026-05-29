'use client';

import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Card } from '@/components/ui/Card';

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="gradient-hero flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-brand-navy">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 border-t border-slate-100 pt-6 text-center text-sm">{footer}</div>}
        </Card>
      </div>
    </div>
  );
}
