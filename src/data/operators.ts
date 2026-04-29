/**
 * Mobile / DTH / Electricity / Water / Gas / Card / FASTag operators.
 *
 * Each entry feeds the Bills tab: the picker shows the operator card,
 * tapping reveals plans and finally the bill summary.
 */

export type BillCategory =
  | 'mobile'
  | 'dth'
  | 'electricity'
  | 'water'
  | 'gas'
  | 'broadband'
  | 'creditcard'
  | 'fastag'
  | 'insurance'
  | 'loan'
  | 'rent'
  | 'lpg';

export interface Operator {
  id: string;
  name: string;
  category: BillCategory;
  detectedFromPrefixes: string[];
  brandColor: string;
  bgGradient: [string, string];
  helpline: string;
  rating: number;
}

export const operators: Operator[] = [
  {
    id: 'op_jio',
    name: 'Reliance Jio',
    category: 'mobile',
    detectedFromPrefixes: ['89', '88', '70'],
    brandColor: '#0F3CC9',
    bgGradient: ['#0F3CC9', '#1FB6FF'],
    helpline: '1800-889-9999',
    rating: 4.5,
  },
  {
    id: 'op_airtel',
    name: 'Airtel',
    category: 'mobile',
    detectedFromPrefixes: ['98', '99', '83'],
    brandColor: '#E5484D',
    bgGradient: ['#E5484D', '#FF8A3D'],
    helpline: '121',
    rating: 4.4,
  },
  {
    id: 'op_vi',
    name: 'Vi (Vodafone Idea)',
    category: 'mobile',
    detectedFromPrefixes: ['97', '98', '95'],
    brandColor: '#7A4BFF',
    bgGradient: ['#7A4BFF', '#FF66C4'],
    helpline: '199',
    rating: 4.0,
  },
  {
    id: 'op_bsnl',
    name: 'BSNL',
    category: 'mobile',
    detectedFromPrefixes: ['94', '95'],
    brandColor: '#1BB76E',
    bgGradient: ['#1BB76E', '#3CDB95'],
    helpline: '1503',
    rating: 3.6,
  },
  {
    id: 'op_tata_play',
    name: 'Tata Play',
    category: 'dth',
    detectedFromPrefixes: [],
    brandColor: '#0F3CC9',
    bgGradient: ['#0F3CC9', '#5A4BFF'],
    helpline: '1860-208-6633',
    rating: 4.2,
  },
  {
    id: 'op_dish_tv',
    name: 'Dish TV',
    category: 'dth',
    detectedFromPrefixes: [],
    brandColor: '#E5484D',
    bgGradient: ['#E5484D', '#7A4BFF'],
    helpline: '1860-180-3474',
    rating: 4.0,
  },
  {
    id: 'op_d2h',
    name: 'd2h',
    category: 'dth',
    detectedFromPrefixes: [],
    brandColor: '#F4A622',
    bgGradient: ['#F4A622', '#FF66C4'],
    helpline: '1860-180-2929',
    rating: 4.1,
  },
  {
    id: 'op_sun_direct',
    name: 'Sun Direct',
    category: 'dth',
    detectedFromPrefixes: [],
    brandColor: '#FF8A3D',
    bgGradient: ['#FF8A3D', '#E5484D'],
    helpline: '7676-525-252',
    rating: 4.0,
  },
  {
    id: 'op_msedcl',
    name: 'MSEDCL — Maharashtra',
    category: 'electricity',
    detectedFromPrefixes: [],
    brandColor: '#1FB6FF',
    bgGradient: ['#1FB6FF', '#5A4BFF'],
    helpline: '18002339090',
    rating: 4.1,
  },
  {
    id: 'op_bescom',
    name: 'BESCOM — Bengaluru',
    category: 'electricity',
    detectedFromPrefixes: [],
    brandColor: '#3CDB95',
    bgGradient: ['#3CDB95', '#1FB6FF'],
    helpline: '1912',
    rating: 4.2,
  },
  {
    id: 'op_tneb',
    name: 'TNEB — Tamil Nadu',
    category: 'electricity',
    detectedFromPrefixes: [],
    brandColor: '#7A4BFF',
    bgGradient: ['#7A4BFF', '#FF66C4'],
    helpline: '94987-94987',
    rating: 4.0,
  },
  {
    id: 'op_torrent_power',
    name: 'Torrent Power',
    category: 'electricity',
    detectedFromPrefixes: [],
    brandColor: '#F4A622',
    bgGradient: ['#F4A622', '#FF8A3D'],
    helpline: '1800-209-3030',
    rating: 4.2,
  },
  {
    id: 'op_tata_power',
    name: 'Tata Power',
    category: 'electricity',
    detectedFromPrefixes: [],
    brandColor: '#0F3CC9',
    bgGradient: ['#0F3CC9', '#1FB6FF'],
    helpline: '1800-209-5161',
    rating: 4.3,
  },
  {
    id: 'op_mahanagar_gas',
    name: 'Mahanagar Gas',
    category: 'gas',
    detectedFromPrefixes: [],
    brandColor: '#1BB76E',
    bgGradient: ['#1BB76E', '#3CDB95'],
    helpline: '6867-2222',
    rating: 4.4,
  },
  {
    id: 'op_igl',
    name: 'Indraprastha Gas',
    category: 'gas',
    detectedFromPrefixes: [],
    brandColor: '#3D8BFF',
    bgGradient: ['#3D8BFF', '#5A4BFF'],
    helpline: '1800-102-5454',
    rating: 4.2,
  },
  {
    id: 'op_indane',
    name: 'Indane LPG',
    category: 'lpg',
    detectedFromPrefixes: [],
    brandColor: '#E5484D',
    bgGradient: ['#E5484D', '#FFB347'],
    helpline: '1906',
    rating: 4.5,
  },
  {
    id: 'op_hpgas',
    name: 'HP Gas',
    category: 'lpg',
    detectedFromPrefixes: [],
    brandColor: '#FF66C4',
    bgGradient: ['#FF66C4', '#FFB347'],
    helpline: '1906',
    rating: 4.4,
  },
  {
    id: 'op_bharat_gas',
    name: 'Bharat Gas',
    category: 'lpg',
    detectedFromPrefixes: [],
    brandColor: '#F4A622',
    bgGradient: ['#F4A622', '#E5484D'],
    helpline: '1906',
    rating: 4.4,
  },
  {
    id: 'op_water_blr',
    name: 'BWSSB Water',
    category: 'water',
    detectedFromPrefixes: [],
    brandColor: '#3CDB95',
    bgGradient: ['#3CDB95', '#1FB6FF'],
    helpline: '1916',
    rating: 4.0,
  },
  {
    id: 'op_water_blr2',
    name: 'BMC Water',
    category: 'water',
    detectedFromPrefixes: [],
    brandColor: '#1FB6FF',
    bgGradient: ['#1FB6FF', '#3CDB95'],
    helpline: '1800-2222-99',
    rating: 4.2,
  },
  {
    id: 'op_jio_fiber',
    name: 'JioFiber',
    category: 'broadband',
    detectedFromPrefixes: [],
    brandColor: '#0F3CC9',
    bgGradient: ['#0F3CC9', '#1FB6FF'],
    helpline: '1800-889-9999',
    rating: 4.5,
  },
  {
    id: 'op_act',
    name: 'ACT Fibernet',
    category: 'broadband',
    detectedFromPrefixes: [],
    brandColor: '#E5484D',
    bgGradient: ['#E5484D', '#7A4BFF'],
    helpline: '1800-103-6464',
    rating: 4.3,
  },
  {
    id: 'op_airtel_xstream',
    name: 'Airtel Xstream',
    category: 'broadband',
    detectedFromPrefixes: [],
    brandColor: '#E5484D',
    bgGradient: ['#E5484D', '#FF8A3D'],
    helpline: '198',
    rating: 4.4,
  },
  {
    id: 'op_hathway',
    name: 'Hathway',
    category: 'broadband',
    detectedFromPrefixes: [],
    brandColor: '#7A4BFF',
    bgGradient: ['#7A4BFF', '#FF66C4'],
    helpline: '1800-419-1234',
    rating: 4.0,
  },
  {
    id: 'op_hdfc_card',
    name: 'HDFC Credit Card',
    category: 'creditcard',
    detectedFromPrefixes: [],
    brandColor: '#0F3CC9',
    bgGradient: ['#0F3CC9', '#5A4BFF'],
    helpline: '1800-258-6161',
    rating: 4.5,
  },
  {
    id: 'op_icici_card',
    name: 'ICICI Credit Card',
    category: 'creditcard',
    detectedFromPrefixes: [],
    brandColor: '#E5484D',
    bgGradient: ['#E5484D', '#7A4BFF'],
    helpline: '1860-120-7777',
    rating: 4.3,
  },
  {
    id: 'op_sbi_card',
    name: 'SBI Credit Card',
    category: 'creditcard',
    detectedFromPrefixes: [],
    brandColor: '#1FB6FF',
    bgGradient: ['#1FB6FF', '#5A4BFF'],
    helpline: '1860-180-1290',
    rating: 4.2,
  },
  {
    id: 'op_axis_card',
    name: 'Axis Credit Card',
    category: 'creditcard',
    detectedFromPrefixes: [],
    brandColor: '#7A4BFF',
    bgGradient: ['#7A4BFF', '#FF66C4'],
    helpline: '1860-419-5555',
    rating: 4.3,
  },
  {
    id: 'op_amex_card',
    name: 'American Express',
    category: 'creditcard',
    detectedFromPrefixes: [],
    brandColor: '#0F3CC9',
    bgGradient: ['#0F3CC9', '#3CDB95'],
    helpline: '1800-419-1414',
    rating: 4.6,
  },
  {
    id: 'op_fastag_hdfc',
    name: 'HDFC FASTag',
    category: 'fastag',
    detectedFromPrefixes: [],
    brandColor: '#0F3CC9',
    bgGradient: ['#0F3CC9', '#5A4BFF'],
    helpline: '1800-120-1243',
    rating: 4.4,
  },
  {
    id: 'op_fastag_icici',
    name: 'ICICI FASTag',
    category: 'fastag',
    detectedFromPrefixes: [],
    brandColor: '#E5484D',
    bgGradient: ['#E5484D', '#7A4BFF'],
    helpline: '1800-2100-104',
    rating: 4.3,
  },
  {
    id: 'op_fastag_paytm',
    name: 'Paytm FASTag',
    category: 'fastag',
    detectedFromPrefixes: [],
    brandColor: '#1FB6FF',
    bgGradient: ['#1FB6FF', '#5A4BFF'],
    helpline: '1800-120-4210',
    rating: 4.4,
  },
];

export function operatorsByCategory(category: BillCategory): Operator[] {
  return operators.filter((op) => op.category === category);
}

export function detectMobileOperator(phone: string): Operator | undefined {
  const digits = phone.replace(/\D/g, '');
  const last10 = digits.length > 10 ? digits.slice(-10) : digits;
  const prefix = last10.slice(0, 2);
  return operators.find((op) => op.category === 'mobile' && op.detectedFromPrefixes.includes(prefix));
}

export const billCategoryLabels: Record<BillCategory, string> = {
  mobile: 'Mobile Recharge',
  dth: 'DTH',
  electricity: 'Electricity',
  water: 'Water',
  gas: 'Piped Gas',
  broadband: 'Broadband',
  creditcard: 'Credit Card',
  fastag: 'FASTag',
  insurance: 'Insurance',
  loan: 'Loan EMI',
  rent: 'Rent',
  lpg: 'Book LPG',
};

export const billCategoryIcons: Record<BillCategory, string> = {
  mobile: '📱',
  dth: '📺',
  electricity: '💡',
  water: '💧',
  gas: '🔥',
  broadband: '🌐',
  creditcard: '💳',
  fastag: '🚗',
  insurance: '🛡️',
  loan: '🏦',
  rent: '🏠',
  lpg: '🔥',
};

export const billCategoryGradients: Record<BillCategory, [string, string]> = {
  mobile: ['#5A4BFF', '#1FB6FF'],
  dth: ['#7A4BFF', '#FF66C4'],
  electricity: ['#F4A622', '#E5484D'],
  water: ['#1FB6FF', '#3CDB95'],
  gas: ['#FF6F61', '#F4A622'],
  broadband: ['#3D8BFF', '#5A4BFF'],
  creditcard: ['#0F3CC9', '#7A4BFF'],
  fastag: ['#1BB76E', '#1FB6FF'],
  insurance: ['#7A4BFF', '#3D8BFF'],
  loan: ['#FF66C4', '#7A4BFF'],
  rent: ['#3CDB95', '#1FB6FF'],
  lpg: ['#FF6F61', '#FFB347'],
};
