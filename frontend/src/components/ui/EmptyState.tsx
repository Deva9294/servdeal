'use client';

import { Card } from './Card';
import { Button } from './Button';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className="p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
        <Icon className="h-8 w-8 text-brand-orange" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-brand-navy">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-5" onClick={onAction}>{actionLabel}</Button>
      )}
    </Card>
  );
}
