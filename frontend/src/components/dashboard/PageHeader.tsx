export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-brand-navy">{title}</h1>
      {description && <p className="mt-1 text-slate-500">{description}</p>}
    </div>
  );
}
