const SERVICE_KEYWORDS = {
  ac: 'ac-repair',
  electrician: 'electrician',
  electric: 'electrician',
  plumber: 'plumbing',
  plumbing: 'plumbing',
  clean: 'cleaning',
  pest: 'pest-control',
  car: 'car-wash',
  bike: 'bike-repair',
  beauty: 'beauty-services',
  paint: 'painting',
  carpenter: 'carpenter',
  cctv: 'cctv-installation',
  ro: 'ro-service',
  shift: 'home-shifting',
  laptop: 'laptop-repair',
  mobile: 'mobile-repair',
};

export const smartSearch = (query, services = []) => {
  const q = query.toLowerCase();
  const matched = services.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.slug.includes(q) ||
      s.shortDescription?.toLowerCase().includes(q)
  );
  if (matched.length) return matched;
  const slug = Object.entries(SERVICE_KEYWORDS).find(([k]) => q.includes(k))?.[1];
  if (slug) return services.filter((s) => s.slug === slug);
  return services.slice(0, 6);
};

export const getRecommendations = (userBookings = [], allServices = []) => {
  if (!userBookings.length) return allServices.slice(0, 4);
  const categories = new Set(userBookings.map((b) => b.service?.category?.toString()));
  return allServices
    .filter((s) => !categories.has(s.category?.toString()))
    .slice(0, 4);
};

export const suggestPricing = (basePrice, demandFactor = 1) => ({
  suggested: Math.round(basePrice * demandFactor),
  min: Math.round(basePrice * 0.85),
  max: Math.round(basePrice * 1.25),
});

export const chatbotReply = (message) => {
  const m = message.toLowerCase();
  if (m.includes('book') || m.includes('service'))
    return 'Browse our services or use the search bar on the homepage to book a verified professional in minutes.';
  if (m.includes('cancel'))
    return 'You can cancel upcoming bookings from My Bookings. Refunds follow our Refund Policy.';
  if (m.includes('payment') || m.includes('pay'))
    return 'We accept Razorpay, Stripe, UPI, Wallet, and Cash on Delivery.';
  if (m.includes('provider'))
    return 'Visit Become a Provider to register. Upload Aadhaar/PAN and select your services.';
  return 'Hi! I am ServDeal Assistant. Ask about booking, payments, providers, or track your order.';
};
