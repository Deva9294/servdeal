import { Play, Apple, QrCode, Star, MapPin, Wrench, Phone } from 'lucide-react';

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[220px]">
      {/* Phone frame */}
      <div className="rounded-[2.5rem] border-8 border-slate-800 bg-slate-800 shadow-2xl">
        {/* Notch */}
        <div className="mx-auto h-6 w-24 rounded-b-2xl bg-slate-800" />
        {/* Screen */}
        <div className="relative mx-1 mb-1 overflow-hidden rounded-[2rem] bg-white">
          {/* App Header */}
          <div className="bg-brand-navy px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange">
                <Wrench className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">ServDeal</span>
            </div>
            <div className="mt-3 flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/80">
              <MapPin className="h-3 w-3" />
              <span>Patna, Bihar</span>
            </div>
          </div>
          {/* App Content */}
          <div className="space-y-3 p-3">
            {/* Service Card 1 */}
            <div className="flex items-center gap-3 rounded-xl bg-orange-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <Wrench className="h-5 w-5 text-brand-orange" />
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-navy">AC Repair</p>
                <p className="text-[10px] text-slate-500">Starting ₹299</p>
              </div>
            </div>
            {/* Service Card 2 */}
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-navy">Electrician</p>
                <p className="text-[10px] text-slate-500">Starting ₹199</p>
              </div>
            </div>
            {/* Service Card 3 */}
            <div className="flex items-center gap-3 rounded-xl bg-green-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-navy">Home Cleaning</p>
                <p className="text-[10px] text-slate-500">Starting ₹499</p>
              </div>
            </div>
          </div>
          {/* Bottom Nav */}
          <div className="flex items-center justify-around border-t border-slate-100 px-2 py-2">
            <div className="flex flex-col items-center gap-0.5">
              <div className="h-5 w-5 rounded-full bg-brand-orange" />
              <span className="text-[8px] text-brand-orange">Home</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="h-5 w-5 rounded-full bg-slate-200" />
              <span className="text-[8px] text-slate-400">Bookings</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="h-5 w-5 rounded-full bg-slate-200" />
              <span className="text-[8px] text-slate-400">Profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreButton({ type }: { type: 'google' | 'apple' }) {
  const isGoogle = type === 'google';
  return (
    <button className="flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800">
      {isGoogle ? <Play className="h-7 w-7 fill-white" /> : <Apple className="h-7 w-7" />}
      <div className="text-left">
        <p className="text-[10px] leading-none opacity-70">{isGoogle ? 'GET IT ON' : 'Download on the'}</p>
        <p className="text-sm font-semibold leading-tight">{isGoogle ? 'Google Play' : 'App Store'}</p>
      </div>
    </button>
  );
}

function QRPlaceholder() {
  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 shadow-sm">
      <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-white">
        <QrCode className="h-28 w-28 text-slate-800" strokeWidth={0.8} />
      </div>
      <p className="mt-3 text-sm font-semibold text-brand-navy">Scan to Download</p>
      <p className="text-xs text-slate-500">Point your camera at the QR code</p>
    </div>
  );
}

export function AppDownload() {
  return (
    <section className="bg-slate-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-3">
          {/* Left: Text & Buttons */}
          <div className="space-y-6">
            <div>
              <span className="inline-block rounded-full bg-brand-orange/10 px-4 py-1 text-xs font-semibold text-brand-orange">
                Mobile App
              </span>
              <h2 className="mt-4 text-3xl font-bold text-brand-navy">Download the ServDeal App</h2>
              <p className="mt-3 text-slate-600">
                Book trusted home services on the go. Get exclusive app-only offers, track your provider in real-time, and manage bookings anywhere.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <StoreButton type="google" />
              <StoreButton type="apple" />
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
                4.8 Rating
              </span>
              <span>50K+ Downloads</span>
              <span>Free to Use</span>
            </div>
          </div>

          {/* Center: Phone Mockup */}
          <div className="flex justify-center">
            <PhoneMockup />
          </div>

          {/* Right: QR Code */}
          <div className="flex justify-center lg:justify-end">
            <QRPlaceholder />
          </div>
        </div>
      </div>
    </section>
  );
}
