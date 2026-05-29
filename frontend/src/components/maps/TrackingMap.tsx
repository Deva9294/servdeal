'use client';

type Props = {
  center?: [number, number];
  providerPosition?: [number, number];
  height?: string;
};

export function TrackingMap({
  center = [25.5941, 85.1376],
  providerPosition,
  height = '400px',
}: Props) {
  const [lat, lng] = center;
  const bbox = `${lng - 0.05},${lat - 0.05},${lng + 0.05},${lat + 0.05}`;
  const marker = providerPosition
    ? `&marker=${providerPosition[0]},${providerPosition[1]}`
    : `&marker=${lat},${lng}`;

  return (
    <div style={{ height }} className="overflow-hidden rounded-xl border border-slate-200">
      <iframe
        title="Live tracking map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${marker}`}
      />
      <p className="bg-slate-50 px-3 py-2 text-center text-xs text-slate-500">
        Live map · Provider {providerPosition ? 'en route' : 'assigned'}
      </p>
    </div>
  );
}
