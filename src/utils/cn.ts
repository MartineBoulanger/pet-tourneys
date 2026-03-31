import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// helper function to combine tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
