import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date?: string) {
  if (!date) {
    return 'Draft';
  }

  return format(new Date(date), 'MMM d, yyyy');
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function readingProgressFromScroll(scrollTop: number, scrollHeight: number, clientHeight: number) {
  const distance = scrollHeight - clientHeight;
  if (distance <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((scrollTop / distance) * 100));
}
