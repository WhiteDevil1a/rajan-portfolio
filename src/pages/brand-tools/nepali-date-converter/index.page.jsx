import React, { useState, useEffect } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import {
  bsToAd,
  adToBs,
  getTodayNepaliDate,
  calculateBsAge,
  getDaysInBsMonth,
} from '@src/lib/nepali/dateConverter';
import {
  BS_START_YEAR,
  BS_END_YEAR,
  BS_MONTH_NAMES_EN,
  BS_MONTH_NAMES_NE,
  toNepaliDigits,
} from '@src/data/bs-calendar';
import { TOOLS_BY_ID } from '@src/data/tools';
import styles from '@src/styles/brandTools.module.scss';

const toolInfo = TOOLS_BY_ID['nepali-date-converter'];

function NepaliDateConverterPage() {
  const [todayBs, setTodayBs] = useState(null);

  // Conversion direction: 'bs-to-ad' | 'ad-to-bs'
  const [direction, setDirection] = useState('bs-to-ad');

  // BS to AD state
  const [bsYear, setBsYear] = useState(2081);
  const [bsMonth, setBsMonth] = useState(1);
  const [bsDay, setBsDay] = useState(1);
  const [adResult, setAdResult] = useState(null);
  const [bsError, setBsError] = useState('');

  // AD to BS state
  const [adYear, setAdYear] = useState(2024);
  const [adMonth, setAdMonth] = useState(4);
  const [adDay, setAdDay] = useState(13);
  const [bsResult, setBsResult] = useState(null);
  const [adError, setAdError] = useState('');

  // Age Calculator state
  const [birthYear, setBirthYear] = useState(2055);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [ageResult, setAgeResult] = useState(null);
  const [ageError, setAgeError] = useState('');

  // Load today's BS date on mount
  useEffect(() => {
    try {
      const today = getTodayNepaliDate();
      setTodayBs(today);
      setBsYear(today.bsYear);
      setBsMonth(today.bsMonth);
      setBsDay(today.bsDay);

      const now = new Date();
      setAdYear(now.getFullYear());
      setAdMonth(now.getMonth() + 1);
      setAdDay(now.getDate());

      // Initial conversions
      const ad = bsToAd({ year: today.bsYear, month: today.bsMonth, day: today.bsDay });
      setAdResult(ad);

      const bs = adToBs({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      });
      setBsResult(bs);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleBsConvert = () => {
    setBsError('');
    try {
      const res = bsToAd({
        year: Number(bsYear),
        month: Number(bsMonth),
        day: Number(bsDay),
      });
      setAdResult(res);
    } catch (e) {
      setBsError(e.message);
      setAdResult(null);
    }
  };

  const handleAdConvert = () => {
    setAdError('');
    try {
      const res = adToBs({
        year: Number(adYear),
        month: Number(adMonth),
        day: Number(adDay),
      });
      setBsResult(res);
    } catch (e) {
      setAdError(e.message);
      setBsResult(null);
    }
  };

  const handleCalculateAge = () => {
    setAgeError('');
    try {
      const res = calculateBsAge({
        year: Number(birthYear),
        month: Number(birthMonth),
        day: Number(birthDay),
      });
      setAgeResult(res);
    } catch (e) {
      setAgeError(e.message);
      setAgeResult(null);
    }
  };

  // Generate day options based on selected BS year and month
  let maxBsDays = 32;
  try {
    maxBsDays = getDaysInBsMonth(Number(bsYear), Number(bsMonth));
  } catch (e) {
    maxBsDays = 32;
  }

  return (
    <ToolLayout
      toolId="nepali-date-converter"
      number={toolInfo.number}
      category={toolInfo.category}
      title={toolInfo.title}
      subtitle={toolInfo.tagline}
      seoTitle={toolInfo.seoTitle}
      seoDescription={toolInfo.seoDescription}
      schemaType={toolInfo.schemaType}
      howItWorks={[
        { title: 'Select Conversion Direction', desc: 'Choose Bikram Sambat (BS) to Gregorian (AD) or Gregorian (AD) to Bikram Sambat (BS).' },
        { title: 'Pick Year, Month & Day', desc: 'Enter or select the date using dynamic dropdown menus with bilingual month and day names.' },
        { title: 'Instant Conversion & Age Audit', desc: 'Inspect day of week in Nepali and English, view today\'s official Nepali date, or calculate exact BS age.' },
      ]}
      features={[
        'Accurate bidirectional BS ↔ AD conversion covering BS 2000 to BS 2090',
        'Official day names in Nepali (आइतबार to शनिबार) and English (Sunday to Saturday)',
        'Bilingual numerals: Displays results in both Devanagari (०-९) and Western digits (0-9)',
        'Built-in Bikram Sambat Age Calculator with exact years, months, and days breakdown',
        'Today\'s Nepali Date live ticker based on current client timestamp',
        '100% In-browser calculation with verified Nepal Panchang Nirnayak Samiti calendar data',
      ]}
      longDescription={toolInfo.longDescription}
      faqs={toolInfo.faq}
      relatedToolIds={toolInfo.relatedIds}
    >
      <div className={styles.toolWorkspace}>
        {/* Today's Date Banner */}
        {todayBs && (
          <div className={styles.todayDateBanner}>
            <div className={styles.todayDateLeft}>
              <span className={styles.todayBadge}>आजको नेपाली मिति (Today in BS)</span>
              <h2 className={styles.todayTitle} lang="ne">
                {todayBs.bsYearNe} {todayBs.bsMonthNameNe} {todayBs.bsDayNe} गते, {todayBs.dayOfWeekNe}
              </h2>
              <span className={styles.todayEn}>
                {todayBs.bsMonthNameEn} {todayBs.bsDay}, {todayBs.bsYear} BS ({todayBs.dayOfWeekEn} · {todayBs.adDateString} AD)
              </span>
            </div>
          </div>
        )}

        {/* Direction Tabs */}
        <div className={styles.controlsBar}>
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Select Mode:</label>
            <div className={styles.scaleButtons}>
              <button
                type="button"
                className={direction === 'bs-to-ad' ? styles.controlBtnActive : styles.controlBtn}
                onClick={() => setDirection('bs-to-ad')}
              >
                BS → AD (Bikram Sambat to English)
              </button>
              <button
                type="button"
                className={direction === 'ad-to-bs' ? styles.controlBtnActive : styles.controlBtn}
                onClick={() => setDirection('ad-to-bs')}
              >
                AD → BS (English to Bikram Sambat)
              </button>
            </div>
          </div>
        </div>

        {/* Main Converter Card */}
        <div className={styles.dateConverterCard}>
          {direction === 'bs-to-ad' ? (
            /* BS to AD form */
            <div>
              <h3 className={styles.cardHeaderTitle}>Convert Bikram Sambat (BS) to English (AD)</h3>
              <div className={styles.datePickerRow}>
                <div className={styles.pickerField}>
                  <label>Year (वर्ष):</label>
                  <select
                    value={bsYear}
                    onChange={(e) => setBsYear(Number(e.target.value))}
                    className={styles.selectInput}
                  >
                    {Array.from({ length: BS_END_YEAR - BS_START_YEAR + 1 }, (_, i) => BS_START_YEAR + i).map((y) => (
                      <option key={y} value={y}>
                        {y} ({toNepaliDigits(y)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.pickerField}>
                  <label>Month (महिना):</label>
                  <select
                    value={bsMonth}
                    onChange={(e) => setBsMonth(Number(e.target.value))}
                    className={styles.selectInput}
                  >
                    {BS_MONTH_NAMES_EN.map((name, i) => (
                      <option key={i + 1} value={i + 1}>
                        {name} ({BS_MONTH_NAMES_NE[i]})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.pickerField}>
                  <label>Day (गते):</label>
                  <select
                    value={bsDay}
                    onChange={(e) => setBsDay(Number(e.target.value))}
                    className={styles.selectInput}
                  >
                    {Array.from({ length: maxBsDays }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {d} ({toNepaliDigits(d)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.pickerField} style={{ alignSelf: 'flex-end' }}>
                  <button
                    type="button"
                    className={styles.primaryActionButton}
                    onClick={handleBsConvert}
                  >
                    Convert to AD
                  </button>
                </div>
              </div>

              {bsError && <div className={styles.dropzoneError}>{bsError}</div>}

              {adResult && (
                <div className={styles.dateResultCard}>
                  <span className={styles.resultLabel}>Converted Gregorian (AD) Date:</span>
                  <h3 className={styles.resultDateHeading}>
                    {adResult.adYear}-{String(adResult.adMonth).padStart(2, '0')}-{String(adResult.adDay).padStart(2, '0')}
                  </h3>
                  <p className={styles.resultDayMeta}>
                    Day: <strong>{adResult.dayOfWeekEn}</strong> (<span lang="ne">{adResult.dayOfWeekNe}</span>)
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* AD to BS form */
            <div>
              <h3 className={styles.cardHeaderTitle}>Convert English (AD) to Bikram Sambat (BS)</h3>
              <div className={styles.datePickerRow}>
                <div className={styles.pickerField}>
                  <label>Year:</label>
                  <input
                    type="number"
                    min={1943}
                    max={2034}
                    value={adYear}
                    onChange={(e) => setAdYear(Number(e.target.value))}
                    className={styles.numInput}
                  />
                </div>

                <div className={styles.pickerField}>
                  <label>Month:</label>
                  <select
                    value={adMonth}
                    onChange={(e) => setAdMonth(Number(e.target.value))}
                    className={styles.selectInput}
                  >
                    {[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December',
                    ].map((m, i) => (
                      <option key={i + 1} value={i + 1}>
                        {m} ({i + 1})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.pickerField}>
                  <label>Day:</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={adDay}
                    onChange={(e) => setAdDay(Number(e.target.value))}
                    className={styles.numInput}
                  />
                </div>

                <div className={styles.pickerField} style={{ alignSelf: 'flex-end' }}>
                  <button
                    type="button"
                    className={styles.primaryActionButton}
                    onClick={handleAdConvert}
                  >
                    Convert to BS
                  </button>
                </div>
              </div>

              {adError && <div className={styles.dropzoneError}>{adError}</div>}

              {bsResult && (
                <div className={styles.dateResultCard}>
                  <span className={styles.resultLabel}>Converted Bikram Sambat (BS) Date:</span>
                  <h3 className={styles.resultDateHeading} lang="ne">
                    {bsResult.bsYearNe} {bsResult.bsMonthNameNe} {bsResult.bsDayNe} गते, {bsResult.dayOfWeekNe}
                  </h3>
                  <p className={styles.resultDayMeta}>
                    {bsResult.bsMonthNameEn} {bsResult.bsDay}, {bsResult.bsYear} BS ({bsResult.dayOfWeekEn})
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BS Age Calculator Section */}
        <div className={styles.ageCalculatorSection}>
          <h3 className={styles.subHeading}>Bikram Sambat (BS) Age Calculator</h3>
          <p className={styles.ageDesc}>
            Enter your birth date in Bikram Sambat to calculate your exact age in years, months, and days.
          </p>

          <div className={styles.datePickerRow}>
            <div className={styles.pickerField}>
              <label>Birth Year (BS):</label>
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(Number(e.target.value))}
                className={styles.selectInput}
              >
                {Array.from({ length: 90 }, (_, i) => 2000 + i).map((y) => (
                  <option key={y} value={y}>
                    {y} ({toNepaliDigits(y)})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.pickerField}>
              <label>Birth Month (BS):</label>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(Number(e.target.value))}
                className={styles.selectInput}
              >
                {BS_MONTH_NAMES_EN.map((name, i) => (
                  <option key={i + 1} value={i + 1}>
                    {name} ({BS_MONTH_NAMES_NE[i]})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.pickerField}>
              <label>Birth Day (BS):</label>
              <input
                type="number"
                min={1}
                max={32}
                value={birthDay}
                onChange={(e) => setBirthDay(Number(e.target.value))}
                className={styles.numInput}
              />
            </div>

            <div className={styles.pickerField} style={{ alignSelf: 'flex-end' }}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleCalculateAge}
              >
                Calculate Age
              </button>
            </div>
          </div>

          {ageError && <div className={styles.dropzoneError}>{ageError}</div>}

          {ageResult && (
            <div className={styles.ageResultCard}>
              <div className={styles.ageNumberCol}>
                <span className={styles.ageBigNumber}>{ageResult.years}</span>
                <span className={styles.ageUnit}>Years (वर्ष)</span>
              </div>
              <div className={styles.ageNumberCol}>
                <span className={styles.ageBigNumber}>{ageResult.months}</span>
                <span className={styles.ageUnit}>Months (महिना)</span>
              </div>
              <div className={styles.ageNumberCol}>
                <span className={styles.ageBigNumber}>{ageResult.days}</span>
                <span className={styles.ageUnit}>Days (दिन)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

export default NepaliDateConverterPage;
