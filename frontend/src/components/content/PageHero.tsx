export function PageHero({
  title,
  highlight,
  description,
  children,
}: {
  title: string;
  highlight?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="gradient-hero border-b border-slate-100 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-6">
        <h1 className="text-3xl font-bold text-brand-navy md:text-4xl lg:text-5xl">
          {title}
          {highlight && (
            <>
              {' '}
              <span className="text-brand-orange">{highlight}</span>
            </>
          )}
        </h1>
        {description && <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">{description}</p>}
        {children}
      </div>
    </section>
  );
}
