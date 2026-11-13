/**
 * dateConverter.ts
 *
 * Accurate, two-way Bikram Sambat (BS) ↔ Gregorian (AD) calendar converter.
 * Includes Nepali numerals, day names in Nepali & English, and BS age calculator.
 *
 * Anchor:
 * BS 2000-01-01 = AD 1943-04-14
 */

import {
  BS_START_YEAR,
  BS_END_YEAR,
  BS_MONTH_DAYS,
  BS_MONTH_NAMES_EN,
  BS_MONTH_NAMES_NE,
  DAYS_OF_WEEK_EN,
  DAYS_OF_WEEK_NE,
  toNepaliDigits,
} from '@src/data/bs-calendar';

export interface BSDate {
  year: number;
  month: number; // 1-12
  day: number; // 1-32
}

export interface ADDate {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

export interface BSConvertedResult {
  bsYear: number;
  bsMonth: number;
  bsDay: number;
  bsMonthNameEn: string;
  bsMonthNameNe: string;
  bsYearNe: string;
  bsDayNe: string;
  dayOfWeekEn: string;
  dayOfWeekNe: string;
  adDateString: string;
}

export interface ADConvertedResult {
  adYear: number;
  adMonth: number;
  adDay: number;
  dayOfWeekEn: string;
  dayOfWeekNe: string;
  bsDateString: string;
  bsDateStringNe: string;
}

export interface BSAgeResult {
  years: number;
  months: number;
  days: number;
  formattedEn: string;
  formattedNe: string;
}

const ANCHOR_AD_MS = Date.UTC(1943, 3, 14); // April 14, 1943 UTC
const MS_PER_DAY = 86400000;

export function getDaysInBsMonth(year: number, month: number): number {
  const yearDays = BS_MONTH_DAYS[year];
  if (!yearDays || month < 1 || month > 12) {
    throw new Error(`Invalid BS year (${year}) or month (${month})`);
  }
  return yearDays[month - 1];
}

export function getDaysInBsYear(year: number): number {
  const yearDays = BS_MONTH_DAYS[year];
  if (!yearDays) {
    throw new Error(`Year ${year} out of supported BS range (${BS_START_YEAR}-${BS_END_YEAR})`);
  }
  return yearDays.reduce((acc, d) => acc + d, 0);
}

/**
 * Convert Bikram Sambat (BS) date to Gregorian (AD)
 */
export function bsToAd(bsDate: BSDate): ADConvertedResult {
  const { year, month, day } = bsDate;

  if (year < BS_START_YEAR || year > BS_END_YEAR) {
    throw new Error(`BS Year ${year} is outside supported range (${BS_START_YEAR}-${BS_END_YEAR})`);
  }
  if (month < 1 || month > 12) {
    throw new Error(`BS Month must be between 1 and 12 (received: ${month})`);
  }
  const maxDay = getDaysInBsMonth(year, month);
  if (day < 1 || day > maxDay) {
    throw new Error(
      `Day ${day} is invalid for ${BS_MONTH_NAMES_EN[month - 1]} ${year} BS (has ${maxDay} days)`
    );
  }

  // Count days from BS 2000-01-01
  let totalDays = 0;
  for (let y = BS_START_YEAR; y < year; y += 1) {
    totalDays += getDaysInBsYear(y);
  }
  for (let m = 1; m < month; m += 1) {
    totalDays += getDaysInBsMonth(year, m);
  }
  totalDays += day - 1;

  // Add to anchor AD timestamp
  const targetUtc = new Date(ANCHOR_AD_MS + totalDays * MS_PER_DAY);
  const adYear = targetUtc.getUTCFullYear();
  const adMonth = targetUtc.getUTCMonth() + 1;
  const adDay = targetUtc.getUTCDate();
  const dayOfWeekIndex = targetUtc.getUTCDay();

  const bsDateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const bsDateStringNe = `${toNepaliDigits(year)}/${toNepaliDigits(String(month).padStart(2, '0'))}/${toNepaliDigits(String(day).padStart(2, '0'))}`;

  return {
    adYear,
    adMonth,
    adDay,
    dayOfWeekEn: DAYS_OF_WEEK_EN[dayOfWeekIndex],
    dayOfWeekNe: DAYS_OF_WEEK_NE[dayOfWeekIndex],
    bsDateString,
    bsDateStringNe,
  };
}

/**
 * Convert Gregorian (AD) date to Bikram Sambat (BS)
 */
export function adToBs(adDate: ADDate): BSConvertedResult {
  const { year, month, day } = adDate;

  if (month < 1 || month > 12) {
    throw new Error(`AD Month must be between 1 and 12 (received: ${month})`);
  }
  const targetUtc = Date.UTC(year, month - 1, day);
  let diffDays = Math.floor((targetUtc - ANCHOR_AD_MS) / MS_PER_DAY);

  if (diffDays < 0) {
    throw new Error(`Date before BS 2000-01-01 (AD 1943-04-14) is not supported.`);
  }

  let bsYear = BS_START_YEAR;
  while (bsYear <= BS_END_YEAR) {
    const daysInYear = getDaysInBsYear(bsYear);
    if (diffDays < daysInYear) break;
    diffDays -= daysInYear;
    bsYear += 1;
  }

  if (bsYear > BS_END_YEAR) {
    throw new Error(`Date after BS ${BS_END_YEAR} Chaitra is not supported.`);
  }

  let bsMonth = 1;
  while (bsMonth <= 12) {
    const daysInMonth = getDaysInBsMonth(bsYear, bsMonth);
    if (diffDays < daysInMonth) break;
    diffDays -= daysInMonth;
    bsMonth += 1;
  }

  const bsDay = diffDays + 1;
  const dayOfWeekIndex = new Date(targetUtc).getUTCDay();

  return {
    bsYear,
    bsMonth,
    bsDay,
    bsMonthNameEn: BS_MONTH_NAMES_EN[bsMonth - 1],
    bsMonthNameNe: BS_MONTH_NAMES_NE[bsMonth - 1],
    bsYearNe: toNepaliDigits(bsYear),
    bsDayNe: toNepaliDigits(bsDay),
    dayOfWeekEn: DAYS_OF_WEEK_EN[dayOfWeekIndex],
    dayOfWeekNe: DAYS_OF_WEEK_NE[dayOfWeekIndex],
    adDateString: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  };
}

/**
 * Get current Nepali date in BS based on client time
 */
export function getTodayNepaliDate(): BSConvertedResult {
  const now = new Date();
  return adToBs({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
}

/**
 * Calculate age in BS calendar (years, months, days)
 */
export function calculateBsAge(birthDate: BSDate, referenceDate?: BSDate): BSAgeResult {
  const ref = referenceDate || {
    year: getTodayNepaliDate().bsYear,
    month: getTodayNepaliDate().bsMonth,
    day: getTodayNepaliDate().bsDay,
  };

  let years = ref.year - birthDate.year;
  let months = ref.month - birthDate.month;
  let days = ref.day - birthDate.day;

  if (days < 0) {
    // Borrow days from previous month in reference year
    const prevMonth = ref.month === 1 ? 12 : ref.month - 1;
    const prevYear = ref.month === 1 ? ref.year - 1 : ref.year;
    const daysInPrevMonth = getDaysInBsMonth(prevYear, prevMonth);
    days += daysInPrevMonth;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  if (years < 0) {
    throw new Error('Birth date cannot be in the future of the reference date.');
  }

  return {
    years,
    months,
    days,
    formattedEn: `${years} years, ${months} months, ${days} days`,
    formattedNe: `${toNepaliDigits(years)} वर्ष, ${toNepaliDigits(months)} महिना, ${toNepaliDigits(days)} दिन`,
  };
}
