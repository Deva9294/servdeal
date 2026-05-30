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
        }}
      >
        <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
          {/* Navy top S with wrench */}
          <path
            d="M15 55C15 35 30 20 55 20C65 20 72 14 78 8C82 4 90 8 88 15C86 22 78 25 78 25C78 25 85 28 88 35C90 42 82 46 78 42C72 36 65 30 55 30C42 30 35 42 35 55"
            fill="#0b1f4d"
          />
          {/* Orange bottom S with hex nut */}
          <path
            d="M85 45C85 65 70 80 45 80C38 80 32 84 28 88C24 92 18 90 20 84C22 78 28 75 28 75C28 75 22 72 20 65C18 58 24 54 28 58C32 62 38 68 45 68C58 68 65 58 65 45"
            fill="#ff7a00"
          />
          {/* Hexagon detail */}
          <polygon points="22,82 26,79 26,85" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
