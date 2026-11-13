import { describe, it, expect } from 'vitest';
import {
  bsToAd,
  adToBs,
  calculateBsAge,
  getDaysInBsMonth,
  getDaysInBsYear,
} from './dateConverter';
import { toNepaliDigits } from '@src/data/bs-calendar';

describe('Bikram Sambat (BS) ↔ Gregorian (AD) Date Converter', () => {
  it('converts anchor date BS 2000-01-01 to AD 1943-04-14', () => {
    const ad = bsToAd({ year: 2000, month: 1, day: 1 });
    expect(ad.adYear).toBe(1943);
    expect(ad.adMonth).toBe(4);
    expect(ad.adDay).toBe(14);
    expect(ad.dayOfWeekEn).toBe('Wednesday');
    expect(ad.dayOfWeekNe).toBe('बुधबार');

    const bs = adToBs({ year: 1943, month: 4, day: 14 });
    expect(bs.bsYear).toBe(2000);
    expect(bs.bsMonth).toBe(1);
    expect(bs.bsDay).toBe(1);
    expect(bs.bsMonthNameEn).toBe('Baishakh');
    expect(bs.bsMonthNameNe).toBe('वैशाख');
  });

  it('converts anchor date BS 2082-01-01 to AD 2025-04-14', () => {
    const ad = bsToAd({ year: 2082, month: 1, day: 1 });
    expect(ad.adYear).toBe(2025);
    expect(ad.adMonth).toBe(4);
    expect(ad.adDay).toBe(14);

    const bs = adToBs({ year: 2025, month: 4, day: 14 });
    expect(bs.bsYear).toBe(2082);
    expect(bs.bsMonth).toBe(1);
    expect(bs.bsDay).toBe(1);
  });

  it('correctly handles month boundary transitions', () => {
    // Last day of Baishakh 2081 has 31 days
    const daysInBaishakh2081 = getDaysInBsMonth(2081, 1);
    expect(daysInBaishakh2081).toBe(31);

    const adLast = bsToAd({ year: 2081, month: 1, day: 31 });
    const bsLast = adToBs({ year: adLast.adYear, month: adLast.adMonth, day: adLast.adDay });
    expect(bsLast.bsYear).toBe(2081);
    expect(bsLast.bsMonth).toBe(1);
    expect(bsLast.bsDay).toBe(31);

    // Next day is Jestha 1
    const adNext = bsToAd({ year: 2081, month: 2, day: 1 });
    const bsNext = adToBs({ year: adNext.adYear, month: adNext.adMonth, day: adNext.adDay });
    expect(bsNext.bsYear).toBe(2081);
    expect(bsNext.bsMonth).toBe(2);
    expect(bsNext.bsDay).toBe(1);
  });

  it('correctly handles year boundary transitions (Chaitra -> Baishakh)', () => {
    const daysInChaitra2080 = getDaysInBsMonth(2080, 12);
    const adEnd = bsToAd({ year: 2080, month: 12, day: daysInChaitra2080 });
    const bsEnd = adToBs({ year: adEnd.adYear, month: adEnd.adMonth, day: adEnd.adDay });
    expect(bsEnd.bsYear).toBe(2080);
    expect(bsEnd.bsMonth).toBe(12);
    expect(bsEnd.bsDay).toBe(daysInChaitra2080);

    const adNewYear = bsToAd({ year: 2081, month: 1, day: 1 });
    const bsNewYear = adToBs({ year: adNewYear.adYear, month: adNewYear.adMonth, day: adNewYear.adDay });
    expect(bsNewYear.bsYear).toBe(2081);
    expect(bsNewYear.bsMonth).toBe(1);
    expect(bsNewYear.bsDay).toBe(1);
  });

  it('rejects invalid dates and throws informative errors', () => {
    // Day 32 in a 31-day month
    expect(() => bsToAd({ year: 2081, month: 1, day: 32 })).toThrow(/invalid/i);
    // Invalid month
    expect(() => bsToAd({ year: 2081, month: 13, day: 1 })).toThrow(/month/i);
    // Year out of range
    expect(() => bsToAd({ year: 1999, month: 1, day: 1 })).toThrow(/range/i);
    expect(() => bsToAd({ year: 2095, month: 1, day: 1 })).toThrow(/range/i);
  });

  it('calculates BS age accurately', () => {
    const birth = { year: 2055, month: 5, day: 10 };
    const ref = { year: 2080, month: 8, day: 25 };
    const age = calculateBsAge(birth, ref);

    expect(age.years).toBe(25);
    expect(age.months).toBe(3);
    expect(age.days).toBe(15);
    expect(age.formattedEn).toBe('25 years, 3 months, 15 days');
    expect(age.formattedNe).toContain('वर्ष');
  });

  it('converts numbers to Nepali numerals', () => {
    expect(toNepaliDigits(2082)).toBe('२०८२');
    expect(toNepaliDigits('14-04-2025')).toBe('१४-०४-२०२५');
  });
});
