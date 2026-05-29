import { Smartphone } from 'lucide-react';

export function AppDownload() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-3 lg:px-6">
        <div>
          <h2 className="text-3xl font-bold text-brand-navy">Download the ServDeal App</h2>
          <p className="mt-2 text-slate-600">Book services on the go with exclusive app offers</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white">Get it on Google Play</button>
            <button className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white">Download on App Store</button>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex h-64 w-36 items-center justify-center rounded-3xl bg-brand-navy/10">
            <Smartphone className="h-16 w-16 text-brand-navy" />
          </div>
        </div>
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 p-8">
          <div className="h-32 w-32 rounded-lg bg-slate-100" />
          <p className="mt-4 text-sm font-medium text-brand-navy">Scan to Download the App</p>
        </div>
      </div>
    </section>
  );
}
