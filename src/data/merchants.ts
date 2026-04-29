/**
 * Mock merchant directory used by the Scan & Pay tab.
 *
 * Each merchant comes with an extensive set of fields so the merchant
 * detail screen can render rich content without needing additional
 * lookups: ratings, hours, top items, deals, recent reviews and a small
 * gallery of photo URLs.
 */

import { colorFor } from '@utils/random';
import { initials } from '@utils/format';

export type MerchantCategory =
  | 'restaurant'
  | 'grocery'
  | 'pharmacy'
  | 'fashion'
  | 'electronics'
  | 'travel'
  | 'fuel'
  | 'utilities'
  | 'entertainment'
  | 'beauty'
  | 'fitness'
  | 'education';

export interface Merchant {
  id: string;
  name: string;
  upi: string;
  category: MerchantCategory;
  city: string;
  area: string;
  rating: number;
  ratingCount: number;
  hours: string;
  isOpen: boolean;
  description: string;
  topItems: { name: string; price: number; popular: boolean }[];
  reviews: { id: string; author: string; stars: number; text: string; createdAt: number }[];
  deals: { id: string; title: string; subtitle: string; expiresInDays: number }[];
  cashbackPercent: number;
  isVerified: boolean;
  isPremium: boolean;
  color: string;
  initials: string;
  gstin: string;
  policyHighlights: string[];
}

const sampleMerchantNames = [
  'Sunrise Tiffin Co.',
  'Tandoori Tales',
  'Cafe Mocha',
  'Frosted Bites',
  'Curry Capital',
  'The Bagel Bar',
  'Sipline',
  'Crust & Co.',
  'Dosa Dynasty',
  'Spice Route',
  'Fresh Fields',
  'Kirana Konnect',
  'Daily Mart',
  'Apothecary First',
  'Wellness Mart',
  'Pure Pharmacy',
  'Threads & Co.',
  'Vogue Vault',
  'Denim District',
  'BoldFit Apparel',
  'Pixel Plaza',
  'Volt Hub',
  'Smart Stop',
  'Gadget Galaxy',
  'TripBuddy Travels',
  'GoExplore',
  'JetSet Holidays',
  'Highway Halt Petrol',
  'Indian Oil Express',
  'Powergrid Service',
  'Aqua Connect Water',
  'BlueGas Cylinder',
  'CineMax',
  'Filmcity Plex',
  'PartyHub',
  'Glow & Glam Salon',
  'Strands Studio',
  'BodyForge Gym',
  'Iron Athletics',
  'BrainBuilders Tutoring',
  'Code Camp Academy',
  'Maths Wizards',
  'Naturals Florist',
  'Petals & Stems',
  'Pawsome Pet Store',
  'Buddy Vet Clinic',
  'Heritage Sweets',
  'Mithai Mahal',
  'Aroma Bakery',
  'Crispy Corner',
  'The Big Boil',
  'Steamy Buns',
  'Wok & Roll',
  'Pizza Perfect',
  'Burger Bonanza',
  'Tea Tales',
  'Brew Brigade',
  'Smoothie Squad',
  'Fitness Fuel Bar',
  'Salad Stop',
];

const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'];
const areas = [
  'Bandra West',
  'Andheri East',
  'Powai',
  'Connaught Place',
  'Saket',
  'Indiranagar',
  'Koramangala',
  'HSR Layout',
  'Kothrud',
  'Baner',
  'Adyar',
  'T. Nagar',
  'Hitech City',
  'Banjara Hills',
  'Salt Lake',
  'Park Street',
  'Navrangpura',
  'Vastrapur',
];

const categoryByIndex: MerchantCategory[] = [
  'restaurant',
  'grocery',
  'pharmacy',
  'fashion',
  'electronics',
  'travel',
  'fuel',
  'utilities',
  'entertainment',
  'beauty',
  'fitness',
  'education',
];

const itemPool: Record<MerchantCategory, { name: string; price: number; popular?: boolean }[]> = {
  restaurant: [
    { name: 'Paneer Butter Masala', price: 280, popular: true },
    { name: 'Hyderabadi Biryani', price: 320, popular: true },
    { name: 'Garlic Naan', price: 60 },
    { name: 'Masala Dosa', price: 140, popular: true },
    { name: 'Chocolate Brownie', price: 180 },
  ],
  grocery: [
    { name: 'Aashirvaad Atta 5kg', price: 270, popular: true },
    { name: 'Amul Cow Milk', price: 64 },
    { name: 'Tata Salt 1kg', price: 28 },
    { name: 'Maggi 70g x 4', price: 56 },
    { name: 'Britannia Bread', price: 38 },
  ],
  pharmacy: [
    { name: 'Crocin 500mg Strip', price: 35 },
    { name: 'Volini Spray 100g', price: 220 },
    { name: 'Vitamin C Tablets', price: 480, popular: true },
    { name: 'N95 Mask', price: 60 },
  ],
  fashion: [
    { name: 'Blue Slim Jeans', price: 1499 },
    { name: 'White Polo Tee', price: 799 },
    { name: 'Leather Belt', price: 999 },
    { name: 'Casual Sneakers', price: 2499, popular: true },
  ],
  electronics: [
    { name: 'Bluetooth Earbuds', price: 1899, popular: true },
    { name: '20000mAh Power Bank', price: 1399 },
    { name: 'USB-C Cable', price: 299 },
    { name: 'Laptop Stand', price: 999 },
  ],
  travel: [
    { name: 'Mumbai → Goa Flight', price: 4299 },
    { name: 'Delhi → Manali Bus', price: 1399 },
    { name: 'Hotel Stay (1N)', price: 2899 },
    { name: 'Sightseeing Pass', price: 999 },
  ],
  fuel: [
    { name: 'Petrol per litre', price: 105 },
    { name: 'Diesel per litre', price: 92 },
    { name: 'Air Check', price: 30 },
  ],
  utilities: [
    { name: 'Electricity Bill', price: 1320 },
    { name: 'Water Bill', price: 380 },
    { name: 'Internet Recharge', price: 799 },
  ],
  entertainment: [
    { name: 'Movie Ticket', price: 280, popular: true },
    { name: 'Combo Popcorn', price: 350 },
    { name: 'Game Zone Pass', price: 599 },
  ],
  beauty: [
    { name: 'Haircut & Style', price: 499 },
    { name: 'Hair Spa', price: 999 },
    { name: 'Manicure', price: 399 },
  ],
  fitness: [
    { name: 'Personal Training Hour', price: 800 },
    { name: 'Monthly Membership', price: 1899 },
    { name: 'Yoga Class', price: 350 },
  ],
  education: [
    { name: 'Maths Tuition / month', price: 2200 },
    { name: 'Coding Bootcamp', price: 9999 },
    { name: 'Language Class', price: 1500 },
  ],
};

const reviewLines = [
  'Loved the experience — quick checkout!',
  'Great value for money, will visit again.',
  'Service was a bit slow but quality is consistent.',
  'Highly recommended, my new favourite spot.',
  'Cashback applied seamlessly with PayX.',
  'Hygiene was top notch, staff was polite.',
  'Decent place, parking is a struggle.',
  'Loved the ambience and the menu options.',
  'Good for quick weekday lunches.',
  'A small token of appreciation — keep it up!',
];

const policyHighlights = [
  '7-day no-questions return policy',
  'Free delivery on orders above ₹499',
  'GST invoice provided automatically',
  'Cashback credited within 24 hours',
  'Verified merchant — KYC completed',
  '24x7 customer support over chat',
];

function buildMerchant(seed: number): Merchant {
  const name = sampleMerchantNames[seed % sampleMerchantNames.length];
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const handle = ['@oksbi', '@okhdfc', '@okaxis', '@okicici', '@upi'][seed % 5];
  const category = categoryByIndex[seed % categoryByIndex.length];
  const items = itemPool[category].map((it) => ({
    ...it,
    popular: it.popular === true,
  }));
  const ratingBase = 3.6 + ((seed * 0.13) % 1.4);
  const rating = Math.round(ratingBase * 10) / 10;
  const ratingCount = 50 + (seed * 31) % 4500;
  const reviews = Array.from({ length: 6 }).map((_, idx) => ({
    id: `rv_${seed}_${idx}`,
    author: ['Riya', 'Karan', 'Aisha', 'Mohit', 'Tanvi', 'Aryan'][idx % 6],
    stars: 3 + ((seed + idx) % 3),
    text: reviewLines[(seed + idx) % reviewLines.length],
    createdAt: Date.now() - (idx + 1) * 86400_000,
  }));
  const deals = Array.from({ length: 3 }).map((_, idx) => ({
    id: `dl_${seed}_${idx}`,
    title: ['Flat 10% Cashback', 'Buy 1 Get 1', 'Festive Bonus 5%'][idx],
    subtitle: 'On payments via PayX UPI before midnight',
    expiresInDays: 1 + ((seed + idx) % 6),
  }));
  return {
    id: `m_${seed.toString(36)}`,
    name,
    upi: `${slug}${handle}`,
    category,
    city: cities[seed % cities.length],
    area: areas[seed % areas.length],
    rating,
    ratingCount,
    hours: seed % 3 === 0 ? '8:00 AM — 11:00 PM' : '10:00 AM — 10:00 PM',
    isOpen: seed % 8 !== 0,
    description:
      'A trusted neighbourhood favourite that pairs great quality with delightful service. PayX users earn extra cashback every Tuesday.',
    topItems: items,
    reviews,
    deals,
    cashbackPercent: 1 + (seed % 4),
    isVerified: seed % 5 !== 0,
    isPremium: seed % 7 === 0,
    color: colorFor(name),
    initials: initials(name),
    gstin: `27AABC${(1000 + seed).toString().padStart(4, '0')}A1Z5`,
    policyHighlights: [policyHighlights[seed % policyHighlights.length], policyHighlights[(seed + 2) % policyHighlights.length]],
  };
}

export const merchants: Merchant[] = Array.from({ length: 48 }, (_, i) => buildMerchant(i + 1));

export function findMerchant(id: string): Merchant | undefined {
  return merchants.find((m) => m.id === id);
}

export const featuredMerchants: Merchant[] = merchants.filter((m) => m.isPremium).slice(0, 8);

export const merchantCategoryLabels: Record<MerchantCategory, string> = {
  restaurant: 'Restaurants',
  grocery: 'Grocery',
  pharmacy: 'Pharmacy',
  fashion: 'Fashion',
  electronics: 'Electronics',
  travel: 'Travel',
  fuel: 'Fuel',
  utilities: 'Utilities',
  entertainment: 'Entertainment',
  beauty: 'Beauty',
  fitness: 'Fitness',
  education: 'Education',
};

export const merchantCategoryIcons: Record<MerchantCategory, string> = {
  restaurant: '🍽️',
  grocery: '🛒',
  pharmacy: '💊',
  fashion: '👗',
  electronics: '📱',
  travel: '✈️',
  fuel: '⛽',
  utilities: '💡',
  entertainment: '🎬',
  beauty: '💅',
  fitness: '🏋️',
  education: '🎓',
};

export const merchantCategoryGradients: Record<MerchantCategory, [string, string]> = {
  restaurant: ['#FF6F61', '#FFB347'],
  grocery: ['#3CDB95', '#1FB6FF'],
  pharmacy: ['#5A4BFF', '#FF66C4'],
  fashion: ['#FF66C4', '#7A4BFF'],
  electronics: ['#1FB6FF', '#5A4BFF'],
  travel: ['#0EA5E9', '#3CDB95'],
  fuel: ['#F4A622', '#E5484D'],
  utilities: ['#7A4BFF', '#1FB6FF'],
  entertainment: ['#FF66C4', '#1FB6FF'],
  beauty: ['#FF66C4', '#FFB347'],
  fitness: ['#1BB76E', '#3CDB95'],
  education: ['#3D8BFF', '#7A4BFF'],
};
