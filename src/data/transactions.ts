/**
 * Mock transactions store. Transactions are deterministically generated
 * so the list is stable across reloads. Each entry contains every field
 * the Transactions tab depth needs (UTR, status, dispute eligibility,
 * receipt URL, etc.).
 */

import { contacts, Contact } from './contacts';
import { generateUtr, shortId } from '@utils/format';

export type TransactionStatus =
  | 'success'
  | 'pending'
  | 'failed'
  | 'refunded'
  | 'disputed'
  | 'reversed';

export type TransactionDirection = 'sent' | 'received' | 'self';

export type TransactionCategory =
  | 'food'
  | 'travel'
  | 'shopping'
  | 'utilities'
  | 'entertainment'
  | 'rent'
  | 'salary'
  | 'investment'
  | 'health'
  | 'transfer'
  | 'recharge'
  | 'fuel'
  | 'subscription'
  | 'gift'
  | 'cashback';

export interface Transaction {
  id: string;
  utr: string;
  amount: number;
  direction: TransactionDirection;
  status: TransactionStatus;
  category: TransactionCategory;
  description: string;
  note?: string;
  contactId?: string;
  merchantName?: string;
  bankName: string;
  bankAccountTail: string;
  upiHandle: string;
  paymentMethod: 'upi' | 'card' | 'wallet' | 'netbanking';
  cardTail?: string;
  fee: number;
  cashback: number;
  isDisputable: boolean;
  isRefundable: boolean;
  isReceiptAvailable: boolean;
  createdAt: number;
  settledAt?: number;
  city: string;
  deviceUsed: 'iPhone 15 Pro' | 'Pixel 8' | 'OnePlus 12' | 'iPad Air';
  geoTag?: string;
  receiptUrl?: string;
  tags: string[];
  reference?: string;
}

const categoryDescriptions: Record<TransactionCategory, string[]> = {
  food: ['Zomato Order', 'Swiggy Lunch', 'Domino\'s Pizza', 'Local Restaurant', 'Tea & Snacks', 'Cafe Coffee Day', 'Starbucks'],
  travel: ['Uber Ride', 'Ola Cab', 'IRCTC Booking', 'Indigo Flight', 'Bus Ticket', 'Metro Recharge', 'Petrol Pump'],
  shopping: ['Amazon', 'Flipkart', 'Myntra Order', 'Local Kirana', 'Blinkit Groceries', 'Zepto', 'BigBasket'],
  utilities: ['Electricity Bill', 'Water Bill', 'Gas Cylinder', 'Internet Bill', 'Postpaid Mobile'],
  entertainment: ['Netflix', 'PVR Cinemas', 'Spotify Premium', 'Hotstar', 'BookMyShow Tickets'],
  rent: ['Rent — May', 'Rent — June', 'Maintenance Charges'],
  salary: ['Monthly Salary', 'Bonus', 'Freelance Project'],
  investment: ['Gold Buy', 'SIP — Equity', 'Stock Purchase', 'Insurance Premium'],
  health: ['Pharmacy', 'Lab Test', 'Hospital', 'Health Checkup'],
  transfer: ['Transfer to Mom', 'Sent to Friend', 'Self Transfer'],
  recharge: ['Mobile Recharge', 'DTH Recharge', 'FASTag Topup'],
  fuel: ['HP Petrol Pump', 'Indian Oil', 'BPCL'],
  subscription: ['Netflix', 'Apple Music', 'YouTube Premium', 'iCloud Storage'],
  gift: ['Birthday Gift', 'Wedding Gift', 'Diwali Gift'],
  cashback: ['Cashback Reward', 'Festival Bonus'],
};

const cityList = [
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Ahmedabad',
];

const devices: Transaction['deviceUsed'][] = ['iPhone 15 Pro', 'Pixel 8', 'OnePlus 12', 'iPad Air'];

const banks = ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'SBI'];
const upiHandles = ['@oksbi', '@okhdfc', '@okaxis', '@okicici', '@ybl'];

function pickFromArray<T>(seed: number, arr: T[]): T {
  return arr[seed % arr.length];
}

function makeStatus(seed: number): TransactionStatus {
  const r = seed % 100;
  if (r < 80) return 'success';
  if (r < 88) return 'pending';
  if (r < 92) return 'failed';
  if (r < 95) return 'refunded';
  if (r < 98) return 'disputed';
  return 'reversed';
}

function makeCategory(seed: number): TransactionCategory {
  const cats: TransactionCategory[] = [
    'food',
    'travel',
    'shopping',
    'utilities',
    'entertainment',
    'rent',
    'salary',
    'investment',
    'health',
    'transfer',
    'recharge',
    'fuel',
    'subscription',
    'gift',
    'cashback',
  ];
  return cats[seed % cats.length];
}

function makeDirection(category: TransactionCategory, seed: number): TransactionDirection {
  if (category === 'salary') return 'received';
  if (category === 'cashback') return 'received';
  if (category === 'transfer') return seed % 3 === 0 ? 'received' : seed % 3 === 1 ? 'sent' : 'self';
  return 'sent';
}

function makeAmount(category: TransactionCategory, seed: number): number {
  switch (category) {
    case 'rent':
      return 12000 + (seed * 11) % 14000;
    case 'salary':
      return 50000 + (seed * 17) % 45000;
    case 'investment':
      return 500 + (seed * 31) % 9500;
    case 'shopping':
      return 199 + (seed * 23) % 4500;
    case 'food':
      return 99 + (seed * 13) % 800;
    case 'travel':
      return 49 + (seed * 19) % 2200;
    case 'utilities':
      return 200 + (seed * 7) % 3600;
    case 'entertainment':
      return 99 + (seed * 11) % 1500;
    case 'recharge':
      return 99 + (seed * 5) % 800;
    case 'fuel':
      return 200 + (seed * 9) % 1800;
    case 'subscription':
      return 99 + (seed * 5) % 700;
    case 'health':
      return 199 + (seed * 13) % 5500;
    case 'gift':
      return 500 + (seed * 41) % 6500;
    case 'cashback':
      return 5 + (seed * 7) % 250;
    case 'transfer':
      return 100 + (seed * 17) % 9900;
    default:
      return 100 + (seed * 13) % 1500;
  }
}

function pseudoCreatedAt(index: number): number {
  const now = Date.now();
  const offset = index * (60 * 60 * 1000) * (1 + (index % 6));
  return now - offset;
}

function buildTransaction(seed: number, contactsList: Contact[]): Transaction {
  const category = makeCategory(seed);
  const status = makeStatus(seed);
  const direction = makeDirection(category, seed);
  const amount = makeAmount(category, seed);
  const description = pickFromArray(seed, categoryDescriptions[category]);
  const useContact = direction !== 'self' && seed % 3 !== 0 && category !== 'salary' && category !== 'cashback';
  const contact = useContact ? contactsList[seed % contactsList.length] : undefined;
  const bank = pickFromArray(seed, banks);
  const upi = `you${pickFromArray(seed, upiHandles)}`;
  const cardTail = ['1234', '4521', '8890', '7765', '0021'][seed % 5];
  const method: Transaction['paymentMethod'] = seed % 7 === 0
    ? 'card'
    : seed % 11 === 0
      ? 'wallet'
      : seed % 13 === 0
        ? 'netbanking'
        : 'upi';
  const isPending = status === 'pending';
  return {
    id: `tx_${seed.toString(36)}`,
    utr: generateUtr(),
    amount,
    direction,
    status,
    category,
    description,
    note: seed % 4 === 0 ? 'Auto generated note for this transaction.' : undefined,
    contactId: contact?.id,
    merchantName: contact ? undefined : description,
    bankName: bank,
    bankAccountTail: ['4321', '7821', '9921', '0034', '1108'][seed % 5],
    upiHandle: upi,
    paymentMethod: method,
    cardTail: method === 'card' ? cardTail : undefined,
    fee: method === 'card' ? Math.max(1, Math.round(amount * 0.005)) : 0,
    cashback: status === 'success' && seed % 6 === 0 ? Math.round(amount * 0.012) : 0,
    isDisputable: status === 'success',
    isRefundable: status === 'success',
    isReceiptAvailable: status !== 'failed',
    createdAt: pseudoCreatedAt(seed),
    settledAt: isPending ? undefined : pseudoCreatedAt(seed) + 60_000,
    city: pickFromArray(seed, cityList),
    deviceUsed: pickFromArray(seed, devices),
    geoTag: seed % 5 === 0 ? `${17 + (seed % 12)}.${(123 + seed) % 1000}, ${72 + (seed % 9)}.${(456 + seed) % 1000}` : undefined,
    receiptUrl: status === 'failed' ? undefined : `payx://receipts/${shortId('R', 10)}`,
    tags: [category, method, status === 'success' ? 'paid' : status],
    reference: contact ? `Paid to ${contact.name}` : description,
  };
}

export const transactions: Transaction[] = Array.from({ length: 220 }, (_, i) =>
  buildTransaction(i + 1, contacts),
).sort((a, b) => b.createdAt - a.createdAt);

export const pendingTransactions = transactions.filter((t) => t.status === 'pending');
export const successfulTransactions = transactions.filter((t) => t.status === 'success');
export const sentTransactions = transactions.filter((t) => t.direction === 'sent');
export const receivedTransactions = transactions.filter((t) => t.direction === 'received');
export const disputedTransactions = transactions.filter((t) => t.status === 'disputed');

export function findTransaction(id: string): Transaction | undefined {
  return transactions.find((t) => t.id === id);
}

export function transactionsByContact(contactId: string): Transaction[] {
  return transactions.filter((t) => t.contactId === contactId);
}

export function totalsForToday(): { sent: number; received: number } {
  const since = Date.now() - 24 * 60 * 60 * 1000;
  let sent = 0;
  let received = 0;
  for (const t of transactions) {
    if (t.createdAt < since) continue;
    if (t.direction === 'sent') sent += t.amount;
    if (t.direction === 'received') received += t.amount;
  }
  return { sent, received };
}

export function totalsForCategory(): Record<TransactionCategory, number> {
  const map = {} as Record<TransactionCategory, number>;
  for (const t of transactions) {
    if (t.direction === 'sent' && t.status === 'success') {
      map[t.category] = (map[t.category] ?? 0) + t.amount;
    }
  }
  return map;
}

export const transactionStatusLabels: Record<TransactionStatus, string> = {
  success: 'Successful',
  pending: 'Pending',
  failed: 'Failed',
  refunded: 'Refunded',
  disputed: 'Under Review',
  reversed: 'Reversed',
};

export const transactionStatusColors: Record<TransactionStatus, string> = {
  success: '#1BB76E',
  pending: '#F4A622',
  failed: '#E5484D',
  refunded: '#3D8BFF',
  disputed: '#7A4BFF',
  reversed: '#7A8299',
};

export const transactionCategoryLabels: Record<TransactionCategory, string> = {
  food: 'Food & Dining',
  travel: 'Travel',
  shopping: 'Shopping',
  utilities: 'Utilities',
  entertainment: 'Entertainment',
  rent: 'Rent',
  salary: 'Salary',
  investment: 'Investments',
  health: 'Health',
  transfer: 'Transfer',
  recharge: 'Recharge',
  fuel: 'Fuel',
  subscription: 'Subscriptions',
  gift: 'Gift',
  cashback: 'Cashback',
};

export const transactionCategoryIcons: Record<TransactionCategory, string> = {
  food: '🍽️',
  travel: '✈️',
  shopping: '🛍️',
  utilities: '💡',
  entertainment: '🎬',
  rent: '🏠',
  salary: '💼',
  investment: '📈',
  health: '🩺',
  transfer: '🔁',
  recharge: '📱',
  fuel: '⛽',
  subscription: '📺',
  gift: '🎁',
  cashback: '💸',
};

export const transactionCategoryGradients: Record<TransactionCategory, [string, string]> = {
  food: ['#FF6F61', '#FFB347'],
  travel: ['#1FB6FF', '#3CDB95'],
  shopping: ['#FF66C4', '#7A4BFF'],
  utilities: ['#5A4BFF', '#1FB6FF'],
  entertainment: ['#7A4BFF', '#FF66C4'],
  rent: ['#3D8BFF', '#5A4BFF'],
  salary: ['#1BB76E', '#3CDB95'],
  investment: ['#F4A622', '#E5484D'],
  health: ['#3CDB95', '#1FB6FF'],
  transfer: ['#7A8299', '#3D8BFF'],
  recharge: ['#FF66C4', '#1FB6FF'],
  fuel: ['#FFB347', '#E5484D'],
  subscription: ['#0EA5E9', '#5A4BFF'],
  gift: ['#FF66C4', '#FFB347'],
  cashback: ['#3CDB95', '#1BB76E'],
};

export const disputeReasons = [
  { id: 'unauthorized', label: 'I did not authorize this transaction', icon: '🛡️' },
  { id: 'wrong_amount', label: 'Amount charged is incorrect', icon: '💰' },
  { id: 'duplicate', label: 'Duplicate / charged twice', icon: '🔁' },
  { id: 'service_not_received', label: 'Goods or service not received', icon: '📦' },
  { id: 'merchant_dispute', label: 'Merchant disagreement', icon: '🏪' },
  { id: 'fraud_suspect', label: 'Suspect fraudulent activity', icon: '🚨' },
  { id: 'wrong_recipient', label: 'Sent to the wrong person', icon: '↩️' },
  { id: 'auto_renewed', label: 'Auto renewed without consent', icon: '🔄' },
  { id: 'other', label: 'Other reason', icon: '📝' },
];
