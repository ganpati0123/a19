/**
 * Mobile recharge plans for the Bills tab.
 *
 * Each plan describes the validity, data, voice, OTT bundles and
 * additional perks. Generated procedurally from a small base table so we
 * have ~80 plans across operators.
 */

import { Operator, operators } from './operators';

export type PlanCategory =
  | 'unlimited'
  | 'data'
  | 'topup'
  | 'truly-unlimited'
  | 'cricket'
  | 'family'
  | 'short-validity'
  | 'long-validity';

export interface RechargePlan {
  id: string;
  operatorId: string;
  amount: number;
  validityDays: number;
  totalDataGb: number;
  perDayDataGb?: number;
  voice: 'unlimited' | string;
  smsPerDay: number;
  ottBundle?: ('Disney+ Hotstar' | 'Netflix' | 'JioCinema' | 'Amazon Prime' | 'SonyLIV' | 'ZEE5')[];
  extras: string[];
  popular: boolean;
  category: PlanCategory;
  bestFor: string;
  cashbackPercent: number;
}

interface PlanTemplate {
  amount: number;
  validityDays: number;
  totalDataGb: number;
  perDayDataGb?: number;
  voice: 'unlimited' | string;
  smsPerDay: number;
  ottBundle?: RechargePlan['ottBundle'];
  extras: string[];
  popular: boolean;
  category: PlanCategory;
  bestFor: string;
}

const baseTemplates: PlanTemplate[] = [
  {
    amount: 199,
    validityDays: 28,
    totalDataGb: 42,
    perDayDataGb: 1.5,
    voice: 'unlimited',
    smsPerDay: 100,
    extras: ['Free hello tunes', 'Cashback on bills'],
    popular: true,
    category: 'unlimited',
    bestFor: 'Daily WhatsApp + casual streaming',
  },
  {
    amount: 249,
    validityDays: 28,
    totalDataGb: 56,
    perDayDataGb: 2,
    voice: 'unlimited',
    smsPerDay: 100,
    ottBundle: ['JioCinema'],
    extras: ['Free hello tunes', '5G ready'],
    popular: true,
    category: 'unlimited',
    bestFor: 'Most popular work-from-home plan',
  },
  {
    amount: 299,
    validityDays: 28,
    totalDataGb: 70,
    perDayDataGb: 2.5,
    voice: 'unlimited',
    smsPerDay: 100,
    ottBundle: ['JioCinema'],
    extras: ['Unlimited 5G data', 'Free hello tunes'],
    popular: false,
    category: 'unlimited',
    bestFor: 'Heavy 5G data users',
  },
  {
    amount: 359,
    validityDays: 28,
    totalDataGb: 70,
    perDayDataGb: 2.5,
    voice: 'unlimited',
    smsPerDay: 100,
    ottBundle: ['Netflix', 'Disney+ Hotstar'],
    extras: ['Premium streaming bundle'],
    popular: false,
    category: 'unlimited',
    bestFor: 'Streamers who skip subscriptions elsewhere',
  },
  {
    amount: 479,
    validityDays: 56,
    totalDataGb: 84,
    perDayDataGb: 1.5,
    voice: 'unlimited',
    smsPerDay: 100,
    extras: ['Cashback on next 3 bills'],
    popular: false,
    category: 'long-validity',
    bestFor: 'Two months of comfort',
  },
  {
    amount: 666,
    validityDays: 84,
    totalDataGb: 126,
    perDayDataGb: 1.5,
    voice: 'unlimited',
    smsPerDay: 100,
    ottBundle: ['JioCinema'],
    extras: ['Free 100GB cloud backup'],
    popular: true,
    category: 'long-validity',
    bestFor: 'Quarterly recharge for long term users',
  },
  {
    amount: 779,
    validityDays: 84,
    totalDataGb: 168,
    perDayDataGb: 2,
    voice: 'unlimited',
    smsPerDay: 100,
    ottBundle: ['Disney+ Hotstar', 'JioCinema'],
    extras: ['IPL Live, Bollywood movies'],
    popular: false,
    category: 'cricket',
    bestFor: 'Cricket season pack',
  },
  {
    amount: 999,
    validityDays: 84,
    totalDataGb: 252,
    perDayDataGb: 3,
    voice: 'unlimited',
    smsPerDay: 100,
    ottBundle: ['Netflix', 'Amazon Prime'],
    extras: ['Premium OTT bundle', 'Family share-able data'],
    popular: false,
    category: 'family',
    bestFor: 'Family of 4',
  },
  {
    amount: 2999,
    validityDays: 365,
    totalDataGb: 912,
    perDayDataGb: 2.5,
    voice: 'unlimited',
    smsPerDay: 100,
    ottBundle: ['Disney+ Hotstar', 'JioCinema'],
    extras: ['Annual recharge perks', 'No-renewal worries'],
    popular: true,
    category: 'long-validity',
    bestFor: 'Yearly subscribers, biggest savings',
  },
  {
    amount: 19,
    validityDays: 1,
    totalDataGb: 0.15,
    voice: 'unlimited',
    smsPerDay: 0,
    extras: ['Quick top-up'],
    popular: false,
    category: 'topup',
    bestFor: 'Instant emergency top-up',
  },
  {
    amount: 49,
    validityDays: 7,
    totalDataGb: 1,
    voice: 'unlimited',
    smsPerDay: 100,
    extras: ['Lite data top-up'],
    popular: false,
    category: 'short-validity',
    bestFor: 'Weekly travel',
  },
  {
    amount: 79,
    validityDays: 14,
    totalDataGb: 8,
    voice: 'unlimited',
    smsPerDay: 100,
    extras: ['Two week unlimited'],
    popular: false,
    category: 'short-validity',
    bestFor: 'Two-week buffer',
  },
  {
    amount: 109,
    validityDays: 14,
    totalDataGb: 14,
    perDayDataGb: 1,
    voice: 'unlimited',
    smsPerDay: 100,
    extras: ['Daily 1GB'],
    popular: false,
    category: 'short-validity',
    bestFor: 'Festival travel pack',
  },
  {
    amount: 159,
    validityDays: 28,
    totalDataGb: 28,
    perDayDataGb: 1,
    voice: 'unlimited',
    smsPerDay: 100,
    extras: ['Daily 1GB'],
    popular: false,
    category: 'unlimited',
    bestFor: 'Light data users',
  },
  {
    amount: 1199,
    validityDays: 84,
    totalDataGb: 252,
    perDayDataGb: 3,
    voice: 'unlimited',
    smsPerDay: 100,
    ottBundle: ['Netflix', 'Disney+ Hotstar', 'JioCinema'],
    extras: ['Triple OTT', '5G ready'],
    popular: true,
    category: 'family',
    bestFor: 'Heavy streaming family',
  },
];

function buildPlansForOperator(operator: Operator): RechargePlan[] {
  return baseTemplates.map((tpl, idx) => ({
    id: `${operator.id}_p_${idx}`,
    operatorId: operator.id,
    amount: tpl.amount,
    validityDays: tpl.validityDays,
    totalDataGb: tpl.totalDataGb,
    perDayDataGb: tpl.perDayDataGb,
    voice: tpl.voice,
    smsPerDay: tpl.smsPerDay,
    ottBundle: tpl.ottBundle,
    extras: tpl.extras,
    popular: tpl.popular,
    category: tpl.category,
    bestFor: tpl.bestFor,
    cashbackPercent: 1 + (idx % 3),
  }));
}

export const allPlans: RechargePlan[] = operators
  .filter((op) => op.category === 'mobile')
  .flatMap(buildPlansForOperator);

export function plansForOperator(operatorId: string): RechargePlan[] {
  return allPlans.filter((p) => p.operatorId === operatorId);
}

export function findPlan(id: string): RechargePlan | undefined {
  return allPlans.find((p) => p.id === id);
}

export const planCategoryLabels: Record<PlanCategory, string> = {
  unlimited: 'Unlimited',
  data: 'Data',
  topup: 'Top-up',
  'truly-unlimited': 'Truly Unlimited',
  cricket: 'Cricket Pack',
  family: 'Family',
  'short-validity': 'Short Validity',
  'long-validity': 'Long Validity',
};

export const planCategoryIcons: Record<PlanCategory, string> = {
  unlimited: '♾️',
  data: '📶',
  topup: '⚡',
  'truly-unlimited': '🚀',
  cricket: '🏏',
  family: '👨‍👩‍👧‍👦',
  'short-validity': '⏱️',
  'long-validity': '📅',
};
