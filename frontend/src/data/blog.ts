export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'monsoon-home-maintenance-checklist',
    title: 'Monsoon Home Maintenance Checklist for Indian Homes',
    excerpt:
      'Prepare your home before the rains — from waterproofing terraces to checking electrical points safely.',
    category: 'Home Care',
    author: 'Priya Sharma',
    date: '2026-05-10',
    readTime: '6 min',
    image: '🌧️',
    content: [
      'Monsoon in cities like Patna, Mumbai, and Bengaluru brings relief from heat but also leaks, damp walls, and pest issues. A quick pre-season check saves costly repairs later.',
      'Start with your terrace and balcony drains. Clear leaves and debris so water flows freely. Inspect window seals and apply silicone caulk where you notice gaps.',
      'Book a licensed electrician to check outdoor sockets and DB boards — moisture and exposed wiring are a serious hazard. ServDeal partners carry proper insulation tools and follow IS standards.',
      'Schedule pest control before standing water attracts mosquitoes. For AC units, ensure drain pipes are unclogged so indoor units do not drip during humid weeks.',
      'Finally, keep ServDeal saved for emergency plumbing — burst pipes and clogged drains spike 3× during heavy rain weeks across Bihar and UP.',
    ],
  },
  {
    slug: 'how-to-choose-verified-electrician',
    title: 'How to Choose a Verified Electrician Near You',
    excerpt:
      'Red flags to avoid, documents to ask for, and why background-verified pros matter for your family.',
    category: 'Safety',
    author: 'Rahul Verma',
    date: '2026-04-22',
    readTime: '5 min',
    image: '⚡',
    content: [
      'Electrical work is not a DIY gamble. In India, unlicensed fixes cause thousands of household fires each year. Always book through a platform that verifies ID, skills, and customer ratings.',
      'Ask whether the professional carries insulated tools and uses ISI-marked MCBs when upgrading panels. For inverter or generator wiring, ensure load calculation is documented.',
      'On ServDeal, every electrician passes police verification and skill assessment. You see transparent pricing before booking — no surprise “material charges” after the visit.',
      'For new installations, request a brief written summary of work done and warranty on parts. Keep invoices for insurance claims if needed.',
      'If you smell burning plastic or see sparks, switch off the main MCB and book emergency service immediately — do not wait for a “convenient” slot.',
    ],
  },
  {
    slug: 'deep-cleaning-vs-regular-cleaning',
    title: 'Deep Cleaning vs Regular Cleaning: What You Actually Need',
    excerpt:
      'Festive season, moving in, or post-renovation? Match the right cleaning package to your home size.',
    category: 'Cleaning',
    author: 'Anita Kumari',
    date: '2026-03-15',
    readTime: '4 min',
    image: '✨',
    content: [
      'Regular cleaning keeps daily dust and kitchen grease under control — ideal weekly or bi-weekly for working families in 2–3 BHK flats.',
      'Deep cleaning targets grout, ceiling fans, inside cabinets, and bathroom scale. Book it before Diwali, after construction, or when shifting into a rented flat.',
      'Pricing on ServDeal depends on BHK size and add-ons (sofa shampoo, mattress vacuum). Compare packages instead of hourly “maid” rates that lack accountability.',
      'Eco-friendly products are available on request — mention allergies or pets in booking notes.',
      'Combine deep cleaning with pest control for a fresh start — many customers in Patna book both in one weekend.',
    ],
  },
  {
    slug: 'ac-servicing-before-summer',
    title: 'AC Servicing Before Summer: Split vs Window Units',
    excerpt:
      'Gas top-up myths, filter cleaning, and when to replace instead of repair in North India heat.',
    category: 'AC & Cooling',
    author: 'Vikram Singh',
    date: '2026-02-28',
    readTime: '7 min',
    image: '❄️',
    content: [
      'March–April is peak AC service season. Waiting until May means longer wait times and higher emergency fees in tier-2 cities.',
      'A standard service includes filter wash, coil cleaning, drain check, and coolant pressure test. Gas refill is only needed if there is a genuine leak — not every year.',
      'Split AC outdoor units need clearance for airflow; window units need secure brackets on older buildings.',
      'If your unit is over 8 years old and repair quotes exceed ₹4,000, compare energy savings of a BEE 5-star inverter model.',
      'Book early on ServDeal for bundled AC + electrician checks if you are running multiple units on one meter.',
    ],
  },
  {
    slug: 'earning-as-servdeal-provider',
    title: 'Earning ₹40,000+ Monthly as a ServDeal Service Partner',
    excerpt:
      'Real tips from plumbers and technicians in Bihar who grew repeat customers through ratings.',
    category: 'For Providers',
    author: 'ServDeal Team',
    date: '2026-01-12',
    readTime: '8 min',
    image: '💼',
    content: [
      'Home service marketplaces work when professionals treat every job like a reputation deposit. Your ServDeal rating directly affects how often you appear in search.',
      'Top earners respond within 15 minutes, arrive in uniform or ID badge, and send before/after photos when the job allows.',
      'Use peak seasons strategically — AC in summer, painting before festivals, RO service after Holi water quality dips.',
      'ServDeal pays weekly to UPI with low platform commission for verified partners. Keep KYC updated to avoid payout delays.',
      'Ready to join? Complete registration on Become a Provider — onboarding takes 2–3 business days in Patna and nearby districts.',
    ],
  },
  {
    slug: 'safe-pest-control-with-kids-pets',
    title: 'Safe Pest Control When You Have Kids and Pets at Home',
    excerpt:
      'Odour-free treatments, re-entry times, and cockroach vs termite approaches explained simply.',
    category: 'Pest Control',
    author: 'Dr. Meera Joshi',
    date: '2025-12-05',
    readTime: '5 min',
    image: '🛡️',
    content: [
      'Not all pest chemicals are equal. WHO-approved gel baits for cockroaches target colonies with minimal spray exposure.',
      'Termite treatment may need drilling and longer curing — plan a day when children can stay at grandparents.',
      'Inform your ServDeal technician about aquariums, birds, and pregnant family members. Partners can schedule morning slots for faster ventilation.',
      'Annual AMC contracts save 20% versus one-off visits and include free re-treatment if pests return within the warranty window.',
      'Store food in sealed containers after treatment and mop floors with plain water before cooking — not bleach mixed with unknown residues.',
    ],
  },
];

export const getBlogBySlug = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug);
