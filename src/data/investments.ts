/**
 * Investments mock data — gold, mutual funds, insurance, goals, watchlist.
 *
 * Data is structured so the Investments tab can render rich detail
 * screens, charts, and order flows without any backend.
 */

export interface GoldRate {
  pricePerGram24k: number;
  pricePerGram22k: number;
  pricePerGram18k: number;
  silverPerGram: number;
  changePercent: number;
  changeAmount: number;
  updatedAt: number;
}

export interface GoldHistoryPoint {
  t: number;
  price: number;
}

export interface GoldHolding {
  id: string;
  grams: number;
  averagePrice: number;
  purchaseAt: number;
  vault: 'PayX Secure Vault' | 'Augmont Insured';
  certificateNo: string;
}

export interface MutualFund {
  id: string;
  name: string;
  category: 'Equity' | 'Debt' | 'Hybrid' | 'Index' | 'ELSS' | 'International';
  subCategory: string;
  fundHouse: string;
  nav: number;
  navUpdatedAt: number;
  oneDayChangePct: number;
  oneMonthChangePct: number;
  threeMonthChangePct: number;
  oneYearChangePct: number;
  threeYearCagr: number;
  fiveYearCagr: number;
  expenseRatio: number;
  rating: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  fundManager: string;
  aum: number;
  minSip: number;
  minLumpsum: number;
  exitLoad: string;
  benchmark: string;
  description: string;
  topHoldings: { name: string; weight: number }[];
}

export interface InsurancePolicy {
  id: string;
  type: 'Term' | 'Health' | 'Vehicle' | 'Travel' | 'Home';
  name: string;
  provider: string;
  coverAmount: number;
  premium: number;
  premiumFrequency: 'Yearly' | 'Half-yearly' | 'Quarterly' | 'Monthly';
  benefits: string[];
  exclusions: string[];
  rating: number;
  popular: boolean;
  recommended: boolean;
  gradient: [string, string];
}

export interface InvestmentGoal {
  id: string;
  title: string;
  emoji: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: number;
  monthlyContribution: number;
  riskProfile: 'Conservative' | 'Balanced' | 'Aggressive';
  category: 'Travel' | 'Education' | 'Wedding' | 'Home' | 'Retirement' | 'Emergency' | 'Vehicle';
}

export const goldRate: GoldRate = {
  pricePerGram24k: 7234.5,
  pricePerGram22k: 6629.7,
  pricePerGram18k: 5425.6,
  silverPerGram: 92.4,
  changePercent: 0.42,
  changeAmount: 30.2,
  updatedAt: Date.now(),
};

export function generateGoldHistory(days: number): GoldHistoryPoint[] {
  const out: GoldHistoryPoint[] = [];
  let price = 6800 + Math.random() * 200;
  const now = Date.now();
  for (let i = days; i >= 0; i -= 1) {
    price += (Math.random() - 0.48) * 35;
    out.push({ t: now - i * 24 * 60 * 60 * 1000, price: Math.round(price) });
  }
  return out;
}

export const goldHistory: Record<'1d' | '1w' | '1m' | '6m' | '1y' | '5y', GoldHistoryPoint[]> = {
  '1d': generateGoldHistory(1),
  '1w': generateGoldHistory(7),
  '1m': generateGoldHistory(30),
  '6m': generateGoldHistory(180),
  '1y': generateGoldHistory(365),
  '5y': generateGoldHistory(365 * 5),
};

export const initialGoldHoldings: GoldHolding[] = [
  {
    id: 'g_1',
    grams: 0.45,
    averagePrice: 6520,
    purchaseAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    vault: 'PayX Secure Vault',
    certificateNo: 'PXG-2024-0001',
  },
  {
    id: 'g_2',
    grams: 1.1,
    averagePrice: 6840,
    purchaseAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    vault: 'Augmont Insured',
    certificateNo: 'PXG-2024-0148',
  },
];

const fundHouses = [
  'Axis Mutual Fund',
  'HDFC AMC',
  'ICICI Prudential',
  'Mirae Asset',
  'Nippon India',
  'Parag Parikh',
  'Quant',
  'SBI Mutual Fund',
  'UTI',
  'Kotak',
];

const fundManagers = [
  'Shreyash Devalkar',
  'Roshi Jain',
  'Sankaran Naren',
  'Neelesh Surana',
  'Manish Gunwani',
  'Rajeev Thakkar',
  'Ankit Pande',
  'R. Srinivasan',
  'Vetri Subramaniam',
  'Harsha Upadhyaya',
];

const benchmarks = [
  'NIFTY 50 TRI',
  'NIFTY 500 TRI',
  'NIFTY Midcap 150 TRI',
  'NIFTY Smallcap 250 TRI',
  'CRISIL Bond Fund Index',
  'S&P 500 TRI',
];

const fundTemplates: Omit<MutualFund, 'id' | 'fundHouse' | 'fundManager' | 'benchmark'>[] = [
  {
    name: 'Bluechip Equity Fund — Direct Growth',
    category: 'Equity',
    subCategory: 'Large Cap',
    nav: 78.42,
    navUpdatedAt: Date.now(),
    oneDayChangePct: 0.42,
    oneMonthChangePct: 1.84,
    threeMonthChangePct: 5.62,
    oneYearChangePct: 24.18,
    threeYearCagr: 18.45,
    fiveYearCagr: 14.6,
    expenseRatio: 0.62,
    rating: 5,
    riskLevel: 'High',
    aum: 45200,
    minSip: 100,
    minLumpsum: 5000,
    exitLoad: '1% if redeemed within 1 year',
    description:
      'A diversified portfolio of India\'s top 100 listed companies, designed for long term wealth creation with relatively lower volatility.',
    topHoldings: [
      { name: 'Reliance Industries', weight: 9.4 },
      { name: 'HDFC Bank', weight: 8.1 },
      { name: 'Infosys', weight: 6.5 },
      { name: 'TCS', weight: 5.8 },
      { name: 'ICICI Bank', weight: 4.9 },
    ],
  },
  {
    name: 'Flexicap Growth — Direct',
    category: 'Equity',
    subCategory: 'Flexi Cap',
    nav: 56.21,
    navUpdatedAt: Date.now(),
    oneDayChangePct: 0.21,
    oneMonthChangePct: 2.41,
    threeMonthChangePct: 7.42,
    oneYearChangePct: 31.4,
    threeYearCagr: 22.6,
    fiveYearCagr: 18.4,
    expenseRatio: 0.58,
    rating: 5,
    riskLevel: 'Very High',
    aum: 38400,
    minSip: 500,
    minLumpsum: 5000,
    exitLoad: '1% if redeemed within 1 year',
    description:
      'Invests across market caps to capture the best opportunities at any time. A core holding for most aggressive investors.',
    topHoldings: [
      { name: 'Bajaj Finance', weight: 5.4 },
      { name: 'L&T', weight: 4.1 },
      { name: 'Sun Pharma', weight: 3.8 },
      { name: 'HUL', weight: 3.2 },
      { name: 'Maruti Suzuki', weight: 2.9 },
    ],
  },
  {
    name: 'Midcap Opportunities Fund',
    category: 'Equity',
    subCategory: 'Mid Cap',
    nav: 124.6,
    navUpdatedAt: Date.now(),
    oneDayChangePct: -0.36,
    oneMonthChangePct: 3.42,
    threeMonthChangePct: 11.21,
    oneYearChangePct: 38.6,
    threeYearCagr: 27.4,
    fiveYearCagr: 22.1,
    expenseRatio: 0.7,
    rating: 4,
    riskLevel: 'Very High',
    aum: 19200,
    minSip: 500,
    minLumpsum: 5000,
    exitLoad: '1% if redeemed within 1 year',
    description:
      'Focuses on companies ranked 101-250 by market capitalization. Higher growth potential with corresponding volatility.',
    topHoldings: [
      { name: 'Tube Investments', weight: 4.9 },
      { name: 'Persistent Systems', weight: 4.5 },
      { name: 'Indian Hotels', weight: 4.1 },
      { name: 'Cummins India', weight: 3.6 },
      { name: 'Trent', weight: 3.4 },
    ],
  },
  {
    name: 'Smallcap Discovery Fund',
    category: 'Equity',
    subCategory: 'Small Cap',
    nav: 96.12,
    navUpdatedAt: Date.now(),
    oneDayChangePct: 0.84,
    oneMonthChangePct: 4.92,
    threeMonthChangePct: 14.8,
    oneYearChangePct: 42.1,
    threeYearCagr: 31.8,
    fiveYearCagr: 25.7,
    expenseRatio: 0.78,
    rating: 4,
    riskLevel: 'Very High',
    aum: 11400,
    minSip: 500,
    minLumpsum: 5000,
    exitLoad: '1% if redeemed within 1 year',
    description:
      'Aggressive long term plays on emerging Indian businesses with significant growth runway.',
    topHoldings: [
      { name: 'Schaeffler India', weight: 3.4 },
      { name: 'Vaibhav Global', weight: 3.0 },
      { name: 'Praj Industries', weight: 2.8 },
      { name: 'Astec Lifesciences', weight: 2.7 },
      { name: 'Karur Vysya Bank', weight: 2.4 },
    ],
  },
  {
    name: 'Liquid Saver Fund — Direct',
    category: 'Debt',
    subCategory: 'Liquid',
    nav: 1240.21,
    navUpdatedAt: Date.now(),
    oneDayChangePct: 0.02,
    oneMonthChangePct: 0.55,
    threeMonthChangePct: 1.7,
    oneYearChangePct: 6.84,
    threeYearCagr: 5.42,
    fiveYearCagr: 5.12,
    expenseRatio: 0.18,
    rating: 5,
    riskLevel: 'Low',
    aum: 78400,
    minSip: 100,
    minLumpsum: 1000,
    exitLoad: 'Nil',
    description:
      'Park surplus funds for short durations with high liquidity and low risk. Better than savings interest with minimal volatility.',
    topHoldings: [
      { name: 'GoI T-Bill 91D', weight: 18.4 },
      { name: 'Reliance CP', weight: 7.6 },
      { name: 'HDFC NCD', weight: 6.4 },
      { name: 'TREPS', weight: 5.4 },
    ],
  },
  {
    name: 'Hybrid Aggressive Fund',
    category: 'Hybrid',
    subCategory: 'Aggressive Hybrid',
    nav: 38.45,
    navUpdatedAt: Date.now(),
    oneDayChangePct: 0.18,
    oneMonthChangePct: 1.5,
    threeMonthChangePct: 5.4,
    oneYearChangePct: 19.2,
    threeYearCagr: 15.1,
    fiveYearCagr: 12.8,
    expenseRatio: 0.62,
    rating: 4,
    riskLevel: 'Moderate',
    aum: 12200,
    minSip: 500,
    minLumpsum: 5000,
    exitLoad: '1% if redeemed within 1 year',
    description:
      'Balances equity for growth and debt for stability. Suitable for moderately aggressive investors.',
    topHoldings: [
      { name: 'HDFC Bank', weight: 6.5 },
      { name: 'Reliance', weight: 5.5 },
      { name: 'GoI 7.26 2032', weight: 8.2 },
      { name: 'SBI', weight: 3.4 },
    ],
  },
  {
    name: 'Nifty 50 Index — Direct',
    category: 'Index',
    subCategory: 'Index Fund',
    nav: 162.4,
    navUpdatedAt: Date.now(),
    oneDayChangePct: 0.5,
    oneMonthChangePct: 2.1,
    threeMonthChangePct: 6.4,
    oneYearChangePct: 23.5,
    threeYearCagr: 17.8,
    fiveYearCagr: 14.3,
    expenseRatio: 0.18,
    rating: 5,
    riskLevel: 'High',
    aum: 12300,
    minSip: 100,
    minLumpsum: 1000,
    exitLoad: 'Nil',
    description:
      'Replicates the Nifty 50 index. Lowest cost option to capture broad Indian market growth.',
    topHoldings: [
      { name: 'Reliance', weight: 9.7 },
      { name: 'HDFC Bank', weight: 8.4 },
      { name: 'Infosys', weight: 6.2 },
      { name: 'ICICI Bank', weight: 5.8 },
      { name: 'TCS', weight: 5.1 },
    ],
  },
  {
    name: 'ELSS Tax Saver',
    category: 'ELSS',
    subCategory: 'Tax Saver',
    nav: 84.4,
    navUpdatedAt: Date.now(),
    oneDayChangePct: 0.34,
    oneMonthChangePct: 1.9,
    threeMonthChangePct: 6.0,
    oneYearChangePct: 26.4,
    threeYearCagr: 19.2,
    fiveYearCagr: 15.6,
    expenseRatio: 0.84,
    rating: 4,
    riskLevel: 'High',
    aum: 14400,
    minSip: 500,
    minLumpsum: 500,
    exitLoad: 'Nil after 3 yr lock-in',
    description:
      'Equity Linked Savings Scheme with a 3-year lock-in. Save up to ₹46,800 in taxes annually under 80C.',
    topHoldings: [
      { name: 'HDFC Bank', weight: 6.4 },
      { name: 'Reliance', weight: 5.1 },
      { name: 'ICICI Bank', weight: 4.7 },
      { name: 'L&T', weight: 4.2 },
    ],
  },
  {
    name: 'US S&P 500 — International',
    category: 'International',
    subCategory: 'US Equity',
    nav: 28.42,
    navUpdatedAt: Date.now(),
    oneDayChangePct: -0.3,
    oneMonthChangePct: 1.2,
    threeMonthChangePct: 4.4,
    oneYearChangePct: 19.8,
    threeYearCagr: 14.5,
    fiveYearCagr: 12.4,
    expenseRatio: 0.5,
    rating: 4,
    riskLevel: 'High',
    aum: 9200,
    minSip: 500,
    minLumpsum: 1000,
    exitLoad: '1% if redeemed within 1 year',
    description:
      'Diversifies into top US listed companies. Adds geographic diversification to your portfolio.',
    topHoldings: [
      { name: 'Apple', weight: 7.2 },
      { name: 'Microsoft', weight: 6.8 },
      { name: 'NVIDIA', weight: 5.4 },
      { name: 'Amazon', weight: 3.6 },
      { name: 'Alphabet', weight: 3.4 },
    ],
  },
];

export const mutualFunds: MutualFund[] = fundTemplates.flatMap((tpl, idx) =>
  fundHouses.slice(0, 3).map((house, hidx) => ({
    ...tpl,
    id: `mf_${idx}_${hidx}`,
    fundHouse: house,
    fundManager: fundManagers[(idx + hidx) % fundManagers.length],
    benchmark: benchmarks[(idx + hidx) % benchmarks.length],
    name: `${house.split(' ')[0]} ${tpl.name}`,
    nav: Math.round((tpl.nav + (hidx * 1.2)) * 100) / 100,
  })),
);

export function findMutualFund(id: string): MutualFund | undefined {
  return mutualFunds.find((f) => f.id === id);
}

export const insurancePolicies: InsurancePolicy[] = [
  {
    id: 'ins_term_1',
    type: 'Term',
    name: 'PayX Smart Term — 1 Cr Cover',
    provider: 'HDFC Life',
    coverAmount: 10000000,
    premium: 9650,
    premiumFrequency: 'Yearly',
    benefits: [
      'Tax saving under 80C',
      'Critical illness rider available',
      'Accidental death benefit',
      'Terminal illness benefit',
    ],
    exclusions: ['Suicide within 1 year', 'War / civil unrest', 'Nuclear contamination'],
    rating: 4.6,
    popular: true,
    recommended: true,
    gradient: ['#0F3CC9', '#5A4BFF'],
  },
  {
    id: 'ins_term_2',
    type: 'Term',
    name: 'PayX Premium Term — 2 Cr Cover',
    provider: 'ICICI Prudential',
    coverAmount: 20000000,
    premium: 16800,
    premiumFrequency: 'Yearly',
    benefits: ['Cover till 75 years', 'Disability cover', 'Loan secure benefit'],
    exclusions: ['Pre-existing diseases', 'Substance abuse'],
    rating: 4.5,
    popular: false,
    recommended: false,
    gradient: ['#7A4BFF', '#FF66C4'],
  },
  {
    id: 'ins_health_1',
    type: 'Health',
    name: 'Family Health Floater 5L',
    provider: 'Star Health',
    coverAmount: 500000,
    premium: 14400,
    premiumFrequency: 'Yearly',
    benefits: ['Cashless 13,000+ hospitals', 'No claim bonus', 'Day-care procedures'],
    exclusions: ['Cosmetic surgery', 'Self-inflicted injuries'],
    rating: 4.4,
    popular: true,
    recommended: true,
    gradient: ['#1FB6FF', '#3CDB95'],
  },
  {
    id: 'ins_health_2',
    type: 'Health',
    name: 'Senior Citizen Health 10L',
    provider: 'Niva Bupa',
    coverAmount: 1000000,
    premium: 28200,
    premiumFrequency: 'Yearly',
    benefits: ['Pre/post hospitalisation', 'Annual health check-up', 'Restoration benefit'],
    exclusions: ['Specified diseases waiting period'],
    rating: 4.3,
    popular: false,
    recommended: true,
    gradient: ['#F4A622', '#E5484D'],
  },
  {
    id: 'ins_vehicle_1',
    type: 'Vehicle',
    name: 'Comprehensive Car Insurance',
    provider: 'Bajaj Allianz',
    coverAmount: 600000,
    premium: 6800,
    premiumFrequency: 'Yearly',
    benefits: ['Zero depreciation add-on', 'Roadside assistance', 'Engine protection'],
    exclusions: ['Wear and tear', 'Driving without licence'],
    rating: 4.4,
    popular: true,
    recommended: false,
    gradient: ['#3D8BFF', '#1FB6FF'],
  },
  {
    id: 'ins_travel_1',
    type: 'Travel',
    name: 'International Travel — 7 Days',
    provider: 'Tata AIG',
    coverAmount: 1000000,
    premium: 1440,
    premiumFrequency: 'Yearly',
    benefits: ['Trip cancellation', 'Lost baggage', 'Medical evacuation'],
    exclusions: ['Pre-existing diseases unless declared'],
    rating: 4.5,
    popular: false,
    recommended: false,
    gradient: ['#0EA5E9', '#3CDB95'],
  },
  {
    id: 'ins_home_1',
    type: 'Home',
    name: 'Home Shield Cover',
    provider: 'HDFC Ergo',
    coverAmount: 2000000,
    premium: 4280,
    premiumFrequency: 'Yearly',
    benefits: ['Fire & natural calamity', 'Burglary', 'Personal accident cover'],
    exclusions: ['Wear and tear', 'War'],
    rating: 4.2,
    popular: false,
    recommended: false,
    gradient: ['#7A4BFF', '#3D8BFF'],
  },
];

export const investmentGoals: InvestmentGoal[] = [
  {
    id: 'goal_emergency',
    title: 'Emergency Fund',
    emoji: '🛡️',
    targetAmount: 300000,
    savedAmount: 92000,
    targetDate: Date.now() + 365 * 24 * 60 * 60 * 1000,
    monthlyContribution: 18000,
    riskProfile: 'Conservative',
    category: 'Emergency',
  },
  {
    id: 'goal_japan',
    title: 'Japan Holiday',
    emoji: '🗾',
    targetAmount: 250000,
    savedAmount: 64000,
    targetDate: Date.now() + 540 * 24 * 60 * 60 * 1000,
    monthlyContribution: 11000,
    riskProfile: 'Balanced',
    category: 'Travel',
  },
  {
    id: 'goal_wedding',
    title: 'Sister\'s Wedding',
    emoji: '💍',
    targetAmount: 700000,
    savedAmount: 120000,
    targetDate: Date.now() + 720 * 24 * 60 * 60 * 1000,
    monthlyContribution: 22000,
    riskProfile: 'Balanced',
    category: 'Wedding',
  },
  {
    id: 'goal_home_dp',
    title: 'Home Down Payment',
    emoji: '🏡',
    targetAmount: 2500000,
    savedAmount: 380000,
    targetDate: Date.now() + 1825 * 24 * 60 * 60 * 1000,
    monthlyContribution: 26000,
    riskProfile: 'Balanced',
    category: 'Home',
  },
  {
    id: 'goal_retirement',
    title: 'Retirement at 50',
    emoji: '🏝️',
    targetAmount: 50000000,
    savedAmount: 1840000,
    targetDate: Date.now() + 365 * 22 * 24 * 60 * 60 * 1000,
    monthlyContribution: 38000,
    riskProfile: 'Aggressive',
    category: 'Retirement',
  },
];

export const watchlist = [
  { symbol: 'NIFTY 50', value: 22480.45, change: 0.42 },
  { symbol: 'BANK NIFTY', value: 47820.4, change: 0.21 },
  { symbol: 'NASDAQ', value: 16245.8, change: -0.18 },
  { symbol: 'GOLD MCX', value: 71200, change: 0.32 },
  { symbol: 'CRUDE OIL', value: 6520, change: -0.91 },
  { symbol: 'BSE SENSEX', value: 73900.5, change: 0.39 },
];

export const portfolioSnapshot = {
  totalInvested: 540000,
  currentValue: 712840,
  totalReturn: 172840,
  todayReturn: 1840,
  todayReturnPct: 0.26,
  xirr: 19.4,
};
