import { PublicLayout } from '@/components/layout/PublicLayout';

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
        <h1 className="text-3xl font-bold text-brand-navy">{title}</h1>
        <div className="prose prose-slate mt-8 max-w-none text-slate-600">{children}</div>
      </div>
    </PublicLayout>
  );
}
