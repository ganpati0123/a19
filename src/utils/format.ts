/**
 * Formatting helpers for currency, dates, durations and identifiers.
 *
 * These are intentionally lightweight (no external dependencies) so they
 * can be used inside worklets and UI render loops without any cost.
 */

export function formatINR(amount: number, options?: { maximumFractionDigits?: number }): string {
  const max = options?.maximumFractionDigits ?? 2;
  if (!Number.isFinite(amount)) return '₹0';
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  const [whole, fraction] = abs.toFixed(max).split('.');
  const lastThree = whole.slice(-3);
  const rest = whole.slice(0, -3);
  const grouped = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree : lastThree;
  if (fraction && parseInt(fraction, 10) > 0) {
    return `${sign}₹${grouped}.${fraction}`;
  }
  return `${sign}₹${grouped}`;
}

export function formatCompactINR(amount: number): string {
  if (!Number.isFinite(amount)) return '₹0';
  const abs = Math.abs(amount);
  if (abs < 1000) return formatINR(amount, { maximumFractionDigits: 0 });
  if (abs < 100000) return `₹${(amount / 1000).toFixed(abs < 10000 ? 2 : 1)}K`;
  if (abs < 10000000) return `₹${(amount / 100000).toFixed(abs < 1000000 ? 2 : 1)}L`;
  return `₹${(amount / 10000000).toFixed(2)}Cr`;
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const monthsLong = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function formatDate(input: number | Date): string {
  const date = input instanceof Date ? input : new Date(input);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateLong(input: number | Date): string {
  const date = input instanceof Date ? input : new Date(input);
  return `${date.getDate()} ${monthsLong[date.getMonth()]}, ${date.getFullYear()}`;
}

export function formatTime(input: number | Date): string {
  const date = input instanceof Date ? input : new Date(input);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const mm = minutes.toString().padStart(2, '0');
  return `${h12}:${mm} ${ampm}`;
}

export function formatDateTime(input: number | Date): string {
  return `${formatDate(input)} • ${formatTime(input)}`;
}

export function formatRelative(input: number | Date): string {
  const date = input instanceof Date ? input : new Date(input);
  const diff = Date.now() - date.getTime();
  const sec = Math.round(diff / 1000);
  if (sec < 30) return 'Just now';
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return formatDate(date);
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m < 60) return s ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return mm ? `${h}h ${mm}m` : `${h}h`;
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return raw;
}

export function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 4) return raw;
  return `••••••${digits.slice(-4)}`;
}

export function maskCard(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 4) return raw;
  const last = digits.slice(-4);
  return `•••• •••• •••• ${last}`;
}

export function maskUpi(upi: string): string {
  const [user, handle] = upi.split('@');
  if (!user || !handle) return upi;
  const visible = user.slice(0, 2);
  return `${visible}${'•'.repeat(Math.max(0, user.length - 2))}@${handle}`;
}

export function shortId(prefix: string, n = 8): string {
  return `${prefix}${Math.random().toString(36).slice(2, 2 + n).toUpperCase()}`;
}

export function generateUtr(): string {
  const ts = Date.now().toString().slice(-10);
  const rand = Math.floor(Math.random() * 1e6).toString().padStart(6, '0');
  return `${ts}${rand}`.slice(0, 16);
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural ?? singular + 's'}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function snake(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

export function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function bytes(value: number): string {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  if (value < 1024 * 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)} MB`;
  return `${(value / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
