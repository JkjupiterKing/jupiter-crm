import { format, parseISO, startOfDay, isEqual, isWithinInterval } from 'date-fns';

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
