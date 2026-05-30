import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          borderRadius: '40px',
          border: '4px solid #e2e8f0',
        }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path
            d="M30 20C30 20 20 30 20 50C20 70 35 80 50 80"
            stroke="#1e3a5f"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M50 80C65 80 80 70 80 50"
            stroke="#ff7a00"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="80" cy="50" r="10" fill="#1e3a5f" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
