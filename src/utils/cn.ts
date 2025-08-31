import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// helper function to combine tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// helper function to calculate percentages
export function calculatePercentage(part: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((part / total) * 100)}%`;
}

// helper function to capitalize words
export function capitalizeWord(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
