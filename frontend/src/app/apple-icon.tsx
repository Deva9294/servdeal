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
          background: '#1e3a5f',
          borderRadius: '40px',
        }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path
            d="M65 15C65 15 55 5 45 15C35 25 35 35 45 45C55 55 65 55 75 65C85 75 85 85 75 95"
            stroke="#ff7a00"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="75" cy="85" r="12" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
