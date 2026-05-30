export const BRAND = {
  name: 'ServDeal',
  tagline: 'Fixing Problems, Delivering Trust',
  colors: {
    orange: '#ff7a00',
    navy: '#0b1f4d',
    white: '#ffffff',
  },
  phone: '+91 92948 99787',
  email: 'support@servdeal.in',
  emailAlt: 'info@servdeal.in',
  whatsapp: '919294899787',
  defaultCity: 'Rehti, Sehore, M.P.',
};

const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  // Auto-detect Render backend from frontend URL
  if (typeof window !== 'undefined') {
    const host = window.location.host;
    if (host.endsWith('.onrender.com')) {
      const name = host.replace('.onrender.com', '');
      return `https://${name}-backend.onrender.com/api/v1`;
    }
  }
  return 'http://localhost:5000/api/v1';
};

export const API_URL = getApiUrl();
