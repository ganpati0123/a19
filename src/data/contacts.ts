/**
 * Mock contact directory used across the Home, Scan, Bills and
 * Transactions tabs.
 *
 * Contacts are intentionally rich — each entry includes UPI handle,
 * phone number, last interaction details and tags so individual cards
 * can render with realistic data without any backend.
 */

import { initials } from '@utils/format';
import { colorFor } from '@utils/random';

export interface Contact {
  id: string;
  name: string;
  upi: string;
  phone: string;
  email?: string;
  bank: string;
  tag: 'family' | 'friend' | 'work' | 'merchant' | 'roommate' | 'service';
  lastTransactionAmount: number;
  lastTransactionAt: number;
  totalSent: number;
  totalReceived: number;
  city: string;
  notes?: string;
  trustScore: number;
  isVerified: boolean;
  initials: string;
  color: string;
  avatarSeed: string;
  pinnedToHome: boolean;
  splitGroupIds: string[];
  defaultBankAccountId?: string;
  occupation?: string;
}

const banks = [
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'SBI',
  'Yes Bank',
  'IndusInd Bank',
  'Federal Bank',
  'IDFC FIRST Bank',
  'Bank of Baroda',
  'PNB',
  'Canara Bank',
  'BoI',
  'Standard Chartered',
  'HSBC',
  'DBS Bank',
  'Citi',
  'AU Small Finance',
  'RBL Bank',
  'Bandhan Bank',
];

const cities = [
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Indore',
  'Bhopal',
  'Nagpur',
  'Surat',
  'Gurugram',
  'Noida',
  'Coimbatore',
  'Vizag',
  'Kochi',
  'Goa',
];

const occupations = [
  'Software Engineer',
  'Product Designer',
  'Doctor',
  'Architect',
  'Teacher',
  'Banker',
  'Founder',
  'Photographer',
  'Chef',
  'Lawyer',
  'Marketing Lead',
  'Data Scientist',
  'Accountant',
  'Yoga Trainer',
  'Cricket Coach',
  'Driver',
  'Plumber',
  'Tailor',
  'Florist',
  'Auto Driver',
];

interface NameSeed {
  first: string[];
  last: string[];
}

const namePool: NameSeed = {
  first: [
    'Aarav',
    'Aditya',
    'Akshay',
    'Aman',
    'Ananya',
    'Anika',
    'Aryan',
    'Asha',
    'Ayesha',
    'Bhavya',
    'Chetan',
    'Diya',
    'Dhruv',
    'Esha',
    'Farhan',
    'Gaurav',
    'Harsh',
    'Ira',
    'Ishaan',
    'Jaya',
    'Karan',
    'Kavya',
    'Kunal',
    'Lakshmi',
    'Manav',
    'Meera',
    'Mihir',
    'Naina',
    'Neel',
    'Nidhi',
    'Om',
    'Parul',
    'Priya',
    'Rahul',
    'Rajat',
    'Rashi',
    'Reyansh',
    'Riya',
    'Rohit',
    'Saanvi',
    'Sahil',
    'Saira',
    'Samar',
    'Shaurya',
    'Shreya',
    'Siddharth',
    'Sneha',
    'Tanvi',
    'Tara',
    'Uday',
    'Urvi',
    'Varun',
    'Vidya',
    'Vihaan',
    'Yash',
    'Zara',
    'Aisha',
    'Arjun',
    'Bhavin',
    'Chitra',
    'Devansh',
    'Eshani',
    'Falak',
    'Girish',
    'Heena',
    'Imran',
    'Jasmine',
    'Krishna',
    'Lavanya',
    'Mohit',
    'Nikhil',
    'Ojas',
    'Pranav',
    'Qadir',
    'Rakesh',
    'Sushmita',
    'Tarun',
    'Uma',
    'Vivek',
    'Wahid',
    'Xenia',
    'Yamini',
    'Zaid',
  ],
  last: [
    'Sharma',
    'Verma',
    'Iyer',
    'Patel',
    'Reddy',
    'Naidu',
    'Rao',
    'Mehta',
    'Shah',
    'Kapoor',
    'Khanna',
    'Aggarwal',
    'Singh',
    'Yadav',
    'Joshi',
    'Pandey',
    'Mishra',
    'Choudhary',
    'Bhatt',
    'Bose',
    'Roy',
    'Sen',
    'Banerjee',
    'Mukherjee',
    'Chatterjee',
    'Gupta',
    'Saxena',
    'Tripathi',
    'Trivedi',
    'Goyal',
    'Bhatia',
    'Goel',
    'Malhotra',
    'Khurana',
    'Sethi',
    'Chopra',
    'Kohli',
    'Dixit',
    'Tiwari',
    'Agarwal',
  ],
};

function pseudoTime(daysAgo: number, hours = 12, minutes = 30): number {
  const base = Date.now() - daysAgo * 24 * 60 * 60 * 1000;
  const d = new Date(base);
  d.setHours(hours, minutes, 0, 0);
  return d.getTime();
}

function makeName(seed: number): string {
  const f = namePool.first[seed % namePool.first.length];
  const l = namePool.last[(seed * 7 + 11) % namePool.last.length];
  return `${f} ${l}`;
}

function makeContact(seed: number): Contact {
  const name = makeName(seed);
  const slug = name.toLowerCase().replace(/\s+/g, '');
  const upiHandles = ['@oksbi', '@okhdfc', '@okaxis', '@okicici', '@yesbank', '@ybl', '@axl', '@hdfcbank', '@kotak', '@upi'];
  const upi = `${slug}${upiHandles[seed % upiHandles.length]}`;
  const phone = `+91 ${(70000 + (seed * 137) % 30000).toString().padStart(5, '0')} ${((seed * 919) % 100000).toString().padStart(5, '0')}`;
  const tagPool: Contact['tag'][] = ['family', 'friend', 'work', 'merchant', 'roommate', 'service'];
  const tag = tagPool[seed % tagPool.length];
  const totalSent = 500 + (seed * 137) % 75000;
  const totalReceived = 200 + (seed * 313) % 50000;
  return {
    id: `c_${seed.toString(36)}`,
    name,
    upi,
    phone,
    email: tag === 'work' ? `${slug}@payx.app` : undefined,
    bank: banks[seed % banks.length],
    tag,
    lastTransactionAmount: ((seed * 41) % 5000) + 50,
    lastTransactionAt: pseudoTime((seed * 3) % 60, 9 + (seed % 12), (seed * 13) % 60),
    totalSent,
    totalReceived,
    city: cities[seed % cities.length],
    notes: seed % 4 === 0 ? 'Reliable, splits dinner bills weekly.' : undefined,
    trustScore: 60 + (seed * 3) % 40,
    isVerified: seed % 5 !== 0,
    initials: initials(name),
    color: colorFor(name),
    avatarSeed: name,
    pinnedToHome: seed % 9 === 0,
    splitGroupIds: seed % 6 === 0 ? [`grp_${seed % 4}`] : [],
    occupation: occupations[seed % occupations.length],
  };
}

export const contacts: Contact[] = Array.from({ length: 60 }, (_, i) => makeContact(i + 1));

export const recentContacts: Contact[] = contacts.slice(0, 12);
export const pinnedContacts: Contact[] = contacts.filter((c) => c.pinnedToHome);

export function findContact(id: string): Contact | undefined {
  return contacts.find((c) => c.id === id);
}

export function searchContacts(q: string): Contact[] {
  const lower = q.trim().toLowerCase();
  if (!lower) return contacts;
  return contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(lower) ||
      c.upi.toLowerCase().includes(lower) ||
      c.phone.replace(/\s+/g, '').includes(lower) ||
      c.bank.toLowerCase().includes(lower) ||
      (c.occupation ? c.occupation.toLowerCase().includes(lower) : false),
  );
}

export interface SplitGroup {
  id: string;
  name: string;
  emoji: string;
  memberIds: string[];
  totalSpent: number;
  yourShare: number;
  outstanding: number;
}

export const splitGroups: SplitGroup[] = [
  {
    id: 'grp_0',
    name: 'Goa Trip 2025',
    emoji: '🏖️',
    memberIds: contacts.slice(0, 6).map((c) => c.id),
    totalSpent: 24800,
    yourShare: 4133,
    outstanding: -1240,
  },
  {
    id: 'grp_1',
    name: 'Roomies — Andheri Flat',
    emoji: '🏠',
    memberIds: contacts.slice(0, 4).map((c) => c.id),
    totalSpent: 36500,
    yourShare: 9125,
    outstanding: 1850,
  },
  {
    id: 'grp_2',
    name: 'Office Lunch Club',
    emoji: '🍱',
    memberIds: contacts.slice(2, 9).map((c) => c.id),
    totalSpent: 8200,
    yourShare: 1170,
    outstanding: 0,
  },
  {
    id: 'grp_3',
    name: 'Family Diwali Gifts',
    emoji: '🪔',
    memberIds: contacts.slice(0, 5).map((c) => c.id),
    totalSpent: 14400,
    yourShare: 2880,
    outstanding: -560,
  },
];

export const contactTagColors: Record<Contact['tag'], string> = {
  family: '#FF66C4',
  friend: '#5A4BFF',
  work: '#1FB6FF',
  merchant: '#F4A622',
  roommate: '#3CDB95',
  service: '#7A8299',
};

export const contactTagLabels: Record<Contact['tag'], string> = {
  family: 'Family',
  friend: 'Friend',
  work: 'Work',
  merchant: 'Merchant',
  roommate: 'Roommate',
  service: 'Service',
};
