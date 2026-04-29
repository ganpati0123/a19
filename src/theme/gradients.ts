/**
 * Gradient presets used for hero cards, premium buttons and onboarding
 * flows. Keys map 1:1 with the `gradient` prop on `<GradientButton>` and
 * `<GradientCard>`.
 */

export interface Gradient {
  colors: readonly [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export const gradients = {
  primary: {
    colors: ['#5A4BFF', '#1FB6FF'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  primaryStrong: {
    colors: ['#3E2EE0', '#5A4BFF', '#1FB6FF'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  sunrise: {
    colors: ['#FF6F61', '#FFB347', '#FFD96B'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  sunset: {
    colors: ['#FF66C4', '#FF6F61', '#7A4BFF'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  ocean: {
    colors: ['#0EA5E9', '#1FB6FF', '#A5F3FC'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  forest: {
    colors: ['#1BB76E', '#3CDB95', '#A7F3D0'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  midnight: {
    colors: ['#0B0F19', '#1F2740', '#3E2EE0'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  gold: {
    colors: ['#F0C766', '#D4A23A', '#8C6D1F'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  silver: {
    colors: ['#E7EAF1', '#B4B8C7', '#7A8299'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  fire: {
    colors: ['#FF512F', '#DD2476'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  candy: {
    colors: ['#FF66C4', '#FFB6E5', '#A5F3FC'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  bills: {
    colors: ['#3D8BFF', '#5A4BFF', '#FF66C4'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  scan: {
    colors: ['#1FB6FF', '#3CDB95'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  invest: {
    colors: ['#F4A622', '#E5484D', '#5A4BFF'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  glassLight: {
    colors: ['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.45)'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  glassDark: {
    colors: ['rgba(28,36,64,0.7)', 'rgba(16,22,42,0.4)'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  neuLight: {
    colors: ['#F4F6FB', '#E3E7EF'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  neuDark: {
    colors: ['#161D34', '#0B1020'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  rainbow: {
    colors: ['#FF6F61', '#FFD96B', '#3CDB95', '#1FB6FF', '#5A4BFF', '#FF66C4'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  paymentSuccess: {
    colors: ['#1BB76E', '#3CDB95'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  paymentDanger: {
    colors: ['#FF5C66', '#E5484D'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  paymentInfo: {
    colors: ['#3D8BFF', '#1FB6FF'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
} as const;

export type GradientKey = keyof typeof gradients;

export function gradientByCategory(category: string): GradientKey {
  switch (category) {
    case 'home':
      return 'primary';
    case 'scan':
      return 'scan';
    case 'transactions':
      return 'paymentInfo';
    case 'bills':
      return 'bills';
    case 'invest':
      return 'invest';
    case 'gold':
      return 'gold';
    case 'silver':
      return 'silver';
    default:
      return 'primary';
  }
}
