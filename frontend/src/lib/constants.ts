export const BRAND = {
  name: 'ServDeal',
  tagline: 'Fixing Problems, Delivering Trust',
  colors: {
    orange: '#ff7a00',
    navy: '#0b1f4d',
    white: '#ffffff',
  },
  phone: '+91 98765 43210',
  email: 'support@servdeal.com',
  whatsapp: '919876543210',
  defaultCity: 'Patna, Bihar',
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
