import { format, parseISO, startOfDay, isEqual, isWithinInterval } from 'date-fns';
import { isMockDatabase } from './config';

/**
 * Returns the current date. In mock mode, this will be a fixed date
 * to ensure consistency with the mock data.
 * @returns A Date object representing the current date.
 */
export function getMockableDate(): Date {
  if (isMockDatabase()) {
    // This is the date around which the mock data is centered.
    // The mock data has a service due on 2025-08-20, so we use this date.
    return new Date('2025-08-20T12:00:00.000Z');
  }
  return new Date();
}

/**
 * Returns a Date object with the time set to midnight in UTC.
 * This function is timezone-aware and ensures that "start of day" is always calculated in UTC.
 * @param date - The date to be truncated.
 * @returns A new Date object set to midnight UTC.
 */
export function dateOnly(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  // To correctly get the start of the day in UTC, we can't just use startOfDay from date-fns,
  // as it is based on the local timezone. We need to work with the date components in UTC.
  return new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate()));
}

/**
 * Compares if two dates are the same day, ignoring time.
 * @param a - The first date.
 * @param b - The second date.
 * @returns True if the dates are on the same day, false otherwise.
 */
export function isSameDate(a: Date | string, b: Date | string): boolean {
  const dateA = dateOnly(a);
  const dateB = dateOnly(b);
  return isEqual(dateA, dateB);
}

/**
 * Checks if a date falls within a given range (inclusive), ignoring time.
 * @param date - The date to check.
 * @param start - The start of the range.
 * @param end - The end of the range.
 * @returns True if the date is within the range, false otherwise.
 */
export function isWithinRange(date: Date | string, start: Date | string, end: Date | string): boolean {
  const dateToCheck = dateOnly(date);
  const startDate = dateOnly(start);
  const endDate = dateOnly(end);
  return isWithinInterval(dateToCheck, { start: startDate, end: endDate });
}

/**
 * Formats a Date object into a YYYY-MM-DD string.
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export function toYYYYMMDD(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
