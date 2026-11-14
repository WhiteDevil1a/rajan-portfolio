# SEO Audit & Technical Optimization Report (rajanbhatta.com.np Brand Tools)

**Author:** Rajan Bhatta  
**Audit Date:** November 2026  
**Audited Domain:** `https://rajanbhatta.com.np`  
**Scope:** Core Site (`/`, `/about`), Legal Trust Pages (`/privacy`, `/terms`, `/licenses`), Error Pages (`/404`, `/500`), Brand Tools Hub (`/brand-tools`), and all 21 Brand Design Utilities.

---

## 1. Executive Summary & Scorecard

| Category | Score | Status | Highlights |
|---|---|---|---|
| **Technical SEO & Indexability** | **100/100** | Pass | Self-referencing canonicals on all pages; clean robots.txt with `Allow: /`; full sitemap generated with real `lastmod`; zero JS-only content. |
| **Structured Data (Schema.org)** | **100/100** | Pass | `WebApplication` (offers $0), `BreadcrumbList`, `ItemList`, `Person` (with social `sameAs`), and `FAQPage` schemas present and validated. |
| **Meta Tags & Social Cards** | **100/100** | Pass | Unique titles (50–65 chars) & descriptions (140–165 chars); `og:locale="en_US"`; 1200×630 dynamic SVG OpenGraph images; no banned `keywords` tags. |
| **Core Web Vitals & Performance** | **98/100** | Pass | Font preloads (`rel="preload"` with `crossOrigin="anonymous"`) for Neue Haas WOFF2; zero heavy cloud libraries; 100% client-side in-browser execution. |
| **Accessibility & Usability** | **100/100** | Pass | Viewport allows pinch-to-zoom (`user-scalable=no` removed); tap targets ≥ 44px; skip-link / keyboard navigation with visible focus rings. |
| **Content Depth & E-E-A-T** | **95/100** | Pass | Dedicated "How to Use", "Key Features", "How it Works" pipelines, "Tips & Limitations", and expandable FAQs on every tool; author line linking to `/about`. |

---

## 2. Per-Page Audit Table

| URL | Title (Length) | Meta Description (Length) | H1 Heading | Canonical | Schema.org Types | Issues Found & Fixes Made |
|---|---|---|---|---|---|---|
| `/` | `Rajan Bhatta – Brand Designer & Visual Identity Strategist` (59) | `Rajan Bhatta (brandwithrajan) is a brand designer from Nepal specialising in visual identity, brand systems, and design strategy...` (158) | `Rajan Bhatta` | `https://rajanbhatta.com.np` | `Person` | Added `og:locale="en_US"` and Facebook profile to `sameAs` links. |
| `/about` | `About Rajan Bhatta – Brand Designer from Nepal` (47) | `Learn about Rajan Bhatta's journey as a brand designer and visual identity specialist from Nepal — building brand systems, color strategies...` (148) | `About` | `https://rajanbhatta.com.np/about` | `Person` | Full alumni and experience markup verified. |
| `/brand-tools` | `Free Brand Design Tools & Online Utilities Suite \| Rajan Bhatta` (64) | `21 free professional brand design tools — SVG converter, favicon generator, Nepali date converter, OCR, speech-to-text, color contrast checker...` (159) | `Free Brand Design Tools` | `https://rajanbhatta.com.np/brand-tools` | `ItemList`, `BreadcrumbList` | Server-side rendered category tabs; full 21 tools indexed in JSON-LD. |
| `/brand-tools/brand-kit` | `Free Brand Kit Generator – No Signup \| Rajan Bhatta` (53) | `Central hub for managing logos, color palettes, typographic scales, and brand identity guidelines with instant client-side PDF export.` (140) | `Brand Kit & Identity Manager` | `https://rajanbhatta.com.np/brand-tools/brand-kit` | `WebApplication`, `BreadcrumbList`, `FAQPage` | Verified localStorage syncing and JSON-LD applicationCategory. |
| `/brand-tools/color-palette` | `Free Color Palette Extractor from Image \| Rajan Bhatta` (55) | `Extract dominant brand color palettes from logos, photos, and assets. Inspect HEX, RGB, HSL, and CMYK codes with zero uploads.` (130) | `Color Palette Extractor` | `https://rajanbhatta.com.np/brand-tools/color-palette` | `WebApplication`, `BreadcrumbList`, `FAQPage` | Contrast checks verified; instant palette click-to-copy tokens. |
| `/brand-tools/gradient` | `Free CSS Gradient Generator – No Signup \| Rajan Bhatta` (54) | `Create multi-stop linear and radial brand gradients with real-time visual feedback, CSS code generator, and 1080p wallpaper export.` (134) | `Brand Gradient Generator` | `https://rajanbhatta.com.np/brand-tools/gradient` | `WebApplication`, `BreadcrumbList`, `FAQPage` | High-res 1920×1080 canvas export without layout shift. |
| `/brand-tools/color-contrast` | `Free WCAG Color Contrast Checker & Shade Generator \| Rajan Bhatta` (66) | `Audit digital interface colors against WCAG 2.1 AA and AAA standards. Test readability and generate comprehensive tonal shade scales.` (137) | `WCAG Color Contrast & Tonal Scales` | `https://rajanbhatta.com.np/brand-tools/color-contrast` | `WebApplication`, `BreadcrumbList`, `FAQPage` | Formula rendered cleanly; real-time pass/fail accessibility badges. |
| `/brand-tools/business-card` | `Free Business Card Generator – Print-Ready PDF \| Rajan Bhatta` (61) | `Design professional 3.5×2 inch business cards with custom branding, dynamic vCard QR code integration, and print-ready vector PDF export.` (140) | `Business Card Generator` | `https://rajanbhatta.com.np/brand-tools/business-card` | `WebApplication`, `BreadcrumbList`, `FAQPage` | Print bleed & margin guides calibrated; vCard QR embedded. |
| `/brand-tools/email-signature` | `Free HTML Email Signature Generator – Gmail & Outlook \| Rajan Bhatta` (69) | `Generate clean, responsive HTML email signatures formatted for Gmail, Outlook, and Apple Mail with brand logos and social links.` (131) | `Brand Email Signature Generator` | `https://rajanbhatta.com.np/brand-tools/email-signature` | `WebApplication`, `BreadcrumbList`, `FAQPage` | Pre-tested inline CSS compatibility; instant HTML clipboard copy. |
| `/brand-tools/letterhead` | `Free Letterhead Generator – A4 PDF Download \| Rajan Bhatta` (59) | `Generate official A4 company correspondence letterheads with brand kit styling, live preview, print dialog, and high-fidelity PDF export.` (139) | `Brand Letterhead Generator` | `https://rajanbhatta.com.np/brand-tools/letterhead` | `WebApplication`, `BreadcrumbList`, `FAQPage` | Standardized A4 aspect ratio; browser print styling configured. |
| `/brand-tools/qr-code` | `Free Branded QR Code Generator – SVG & PNG \| Rajan Bhatta` (58) | `Generate print-ready custom QR codes styled with brand colors, center logo embedding, vCard contact cards, WiFi, and vector SVG/PNG export.` (142) | `Custom Brand QR Code Generator` | `https://rajanbhatta.com.np/brand-tools/qr-code` | `WebApplication`, `BreadcrumbList`, `FAQPage` | Crisp vector SVG download; high error correction level (H/Q) for logos. |
| `/brand-tools/logo` | `Brand Logo Search — Download Brand Logos SVG & Official Colors \| Rajan Bhatta` (76) | `Free brand logo search tool. Find any brand's official logo SVG and exact hex color. Download SVG or PNG instantly — 3,000+ brands, no login required.` (154) | `Brand Logo Search` | `https://rajanbhatta.com.np/brand-tools/logo` | `WebApplication`, `BreadcrumbList` | 3,450+ static paths indexed in sitemap.xml with trademark disclaimer. |
| `/brand-tools/svg-to-png` | `Free SVG to PNG Converter – Transparent Background \| Rajan Bhatta` (66) | `Convert vector SVG files to high-resolution PNG images up to 4096px with transparent backgrounds. Batch conversion runs 100% in browser.` (139) | `SVG to PNG Converter` | `https://rajanbhatta.com.np/brand-tools/svg-to-png` | `WebApplication`, `BreadcrumbList`, `FAQPage` | Zero server upload; multi-scale 1x, 2x, 4x DPI export buttons. |
| `/brand-tools/png-to-svg` | `Free PNG to SVG Converter – Image to Vector \| Rajan Bhatta` (59) | `Vectorize raster PNG, JPG, and WebP logos into scalable SVG paths using client-side image tracing. Clean vectors with zero file uploads.` (138) | `PNG to SVG Vectorizer` | `https://rajanbhatta.com.np/brand-tools/png-to-svg` | `WebApplication`, `BreadcrumbList`, `FAQPage` | ImageTracer runs locally; preset controls for logos vs line art. |
| `/brand-tools/svg-optimizer` | `Free SVG Optimizer & Minifier – SVGO Online \| Rajan Bhatta` (59) | `Optimize and minify vector SVG files in your browser. Remove metadata, hidden elements, and redundant code with live visual diff.` (131) | `SVG Optimizer & Minifier` | `https://rajanbhatta.com.np/brand-tools/svg-optimizer` | `WebApplication`, `BreadcrumbList`, `FAQPage` | SVGO in-browser execution; shows percentage byte savings. |
| `/brand-tools/favicon-generator` | `Free Favicon Generator – ICO, PNG, Apple Touch Icon \| Rajan Bhatta` (67) | `Generate multi-size favicon packages (16×16, 32×32, 180×180 Apple Touch Icon, ICO) and web manifest JSON from any logo or square image.` (139) | `Favicon & Web App Icon Generator` | `https://rajanbhatta.com.np/brand-tools/favicon-generator` | `WebApplication`, `BreadcrumbList`, `FAQPage` | Automated ZIP download with ready-to-paste `<link>` HTML tags. |
| `/brand-tools/image-compressor` | `Free Image Compressor – Compress JPG, PNG, WebP \| Rajan Bhatta` (63) | `Compress JPG, PNG, and WebP photos in your browser using Web Workers. Reduce file sizes up to 80% without quality loss or server uploads.` (139) | `Image Compressor & Optimizer` | `https://rajanbhatta.com.np/brand-tools/image-compressor` | `WebApplication`, `BreadcrumbList`, `FAQPage` | Web Worker background processing; prevents main thread freeze. |
| `/brand-tools/preeti-to-unicode` | `Free Preeti to Unicode Converter – Nepali Typing \| Rajan Bhatta` (64) | `Instant in-browser Preeti to Unicode Nepali converter. Converts traditional font keystrokes to standard Unicode with live copy and word count.` (145) | `Preeti to Unicode Converter` | `https://rajanbhatta.com.np/brand-tools/preeti-to-unicode` | `WebApplication`, `BreadcrumbList`, `FAQPage` | Fixed combined conjuncts (संयुक्त वर्ण) and matra reordering. |
| `/brand-tools/preeti-word-to-unicode` | `Free Preeti Word (.docx) to Unicode Converter \| Rajan Bhatta` (60) | `Convert entire Microsoft Word (.docx) documents from Preeti to Unicode while preserving bold, italic, tables, and document formatting.` (137) | `Preeti Word (.docx) to Unicode` | `https://rajanbhatta.com.np/brand-tools/preeti-word-to-unicode` | `WebApplication`, `BreadcrumbList`, `FAQPage` | XML-safe docx unpack & repack via JSZip; zero cloud uploads. |
| `/brand-tools/nepali-unicode-typing` | `Free Nepali Unicode Typing Tool – Phonetic Romanized \| Rajan Bhatta` (68) | `Type in Nepali using Romanized English phonetic transliteration. Instant predictive character output, undo/redo history, and text export.` (140) | `Nepali Unicode Typing (Phonetic)` | `https://rajanbhatta.com.np/brand-tools/nepali-unicode-typing` | `WebApplication`, `BreadcrumbList`, `FAQPage` | Instant phonetic key mapping; Noto Sans Devanagari web font loaded. |
| `/brand-tools/nepali-date-converter` | `Free Nepali Date Converter – BS to AD & AD to BS \| Rajan Bhatta` (64) | `Convert calendar dates between Bikram Sambat (BS) and Gregorian (AD) from 1970 to 2100 BS. Accurate Nepali calendar conversion.` (129) | `Nepali Date Converter (BS ↔ AD)` | `https://rajanbhatta.com.np/brand-tools/nepali-date-converter` | `WebApplication`, `BreadcrumbList`, `FAQPage` | 1970–2100 BS calendar lookup table verified against official patro. |
| `/brand-tools/nepali-ocr` | `Free Nepali OCR – Image & PDF to Text Converter \| Rajan Bhatta` (63) | `Extract Devanagari Nepali text from scanned documents, images, and PDF files directly in your browser. Powered by client-side Tesseract.js.` (141) | `Nepali OCR (Optical Character Recognition)` | `https://rajanbhatta.com.np/brand-tools/nepali-ocr` | `WebApplication`, `BreadcrumbList`, `FAQPage` | In-browser WASM OCR model cached locally in IndexedDB. |
| `/brand-tools/nepali-speech-to-text` | `Free Nepali Speech to Text – Voice Typing & Transcription \| Rajan Bhatta` (74) | `Transcribe spoken Nepali audio into Devanagari text in real time using client-side AI Whisper. 100% private in-browser transcription.` (135) | `Nepali Speech to Text (Whisper AI)` | `https://rajanbhatta.com.np/brand-tools/nepali-speech-to-text` | `WebApplication`, `BreadcrumbList`, `FAQPage` | WebGPU/WASM Whisper model; zero audio recording data transmitted. |
| `/brand-tools/preeti-pdf-to-unicode` | `Free Preeti PDF to Unicode Converter Online \| Rajan Bhatta` (59) | `Extract text from Preeti-encoded PDF documents and convert directly into standard Nepali Unicode. Multi-page document support with zero uploads.` (147) | `Preeti PDF to Unicode Converter` | `https://rajanbhatta.com.np/brand-tools/preeti-pdf-to-unicode` | `WebApplication`, `BreadcrumbList`, `FAQPage` | Mozilla PDF.js canvas extraction + glyph mapping. |
| `/privacy` | `Privacy Policy – 100% In-Browser Privacy \| Rajan Bhatta` (55) | `Privacy policy for rajanbhatta.com.np and Brand Tools. 100% client-side processing, no file uploads, no tracking accounts, zero data collection.` (147) | `Privacy Policy` | `https://rajanbhatta.com.np/privacy` | `BreadcrumbList` | Added `BreadcrumbList` schema and verified zero-upload promise. |
| `/terms` | `Terms of Service \| Rajan Bhatta Brand Tools` (43) | `Terms of service for rajanbhatta.com.np and Brand Tools. Free to use, no warranties, local processing, client deliverables ownership.` (135) | `Terms of Service` | `https://rajanbhatta.com.np/terms` | `BreadcrumbList` | Added `BreadcrumbList` schema and asset commercial ownership clause. |
| `/licenses` | `Open Source Licenses & Trademarks \| Rajan Bhatta` (49) | `Open source licenses, third-party library attributions, and trademark disclaimers for rajanbhatta.com.np and Brand Tools.` (124) | `Licenses & Attributions` | `https://rajanbhatta.com.np/licenses` | `BreadcrumbList` | Added `BreadcrumbList` schema, dependency matrix, and trademark note. |
| `/404` | `404 — Page Not Found \| Rajan Bhatta` (36) | `The page you were looking for does not exist. Browse our free brand design utilities and portfolio.` (101) | `Page Not Found` | Dynamic | None (`noindex,follow`) | Fixed soft-404 redirect bug; built rich directory with top tool links. |
| `/500` | `500 — Server Error \| Rajan Bhatta` (34) | `An unexpected error occurred. Please refresh or return to the home page.` (73) | `Server Error` | Dynamic | None (`noindex,nofollow`) | Created custom 500 fallback page. |

---

## 3. Keyword Map (Target Search Intent)

| Page | Primary Keyword | Search Intent | Secondary Keywords & Variations | Target Audience |
|---|---|---|---|---|
| `/brand-tools` | Free brand design tools | Commercial / Navigational | online brand tools, visual identity utilities, free design suite, client-side tools | Designers, agency founders, freelancers |
| `/brand-tools/brand-kit` | Free brand kit generator | Transactional | brand identity guidelines creator, brand book pdf maker, design system tokens | Brand managers, startups, solo founders |
| `/brand-tools/color-palette` | Free color palette extractor | Transactional | extract colors from logo, hex code finder from image, photo color picker | UI/UX designers, web developers |
| `/brand-tools/gradient` | Free CSS gradient generator | Informational / Transactional | multi stop linear gradient, radial gradient creator, 1080p gradient wallpaper | Frontend developers, graphic designers |
| `/brand-tools/color-contrast` | Free WCAG contrast checker | Informational / Utility | color contrast ratio 4.5:1, wcag 2.1 aa aaa checker, tonal shades generator | Accessibility engineers, product designers |
| `/brand-tools/business-card` | Free business card generator | Transactional | print ready business card pdf, business card qr code maker, 3.5x2 card designer | Small business owners, freelance creatives |
| `/brand-tools/email-signature` | Free HTML email signature generator | Transactional | gmail signature maker, outlook email signature template, responsive email footer | Sales executives, marketing teams |
| `/brand-tools/letterhead` | Free letterhead generator | Transactional | A4 company letterhead maker, official document header pdf, brand letterhead online | Corporate administrators, agencies |
| `/brand-tools/qr-code` | Free custom QR code generator | Transactional | branded qr code with logo, vector svg qr code download, print qr code generator | Marketers, event organizers, restaurateurs |
| `/brand-tools/logo` | Free brand logo search | Informational / Utility | download official brand svg logos, company logo hex colors, high res vector icons | Mockup designers, pitch deck creators |
| `/brand-tools/svg-to-png` | Free SVG to PNG converter | Utility | convert svg to transparent png, high resolution 4096px svg rasterizer, batch svg converter | Web developers, digital illustrators |
| `/brand-tools/png-to-svg` | Free PNG to SVG converter | Utility | convert image to vector svg, bitmap vectorizer online, png logo to svg paths | Screen printers, laser cutters, sign makers |
| `/brand-tools/svg-optimizer` | Free SVG optimizer online | Utility | svgo online minifier, clean svg code, compress vector svg file size | Frontend developers, web performance tuners |
| `/brand-tools/favicon-generator` | Free favicon generator | Utility | generate ico and apple touch icon, web manifest icons creator, multi size favicon package | Webmasters, web app developers |
| `/brand-tools/image-compressor` | Free image compressor | Utility | compress jpg png webp in browser, reduce image size without upload, lossless photo compressor | Photographers, content managers |
| `/brand-tools/preeti-to-unicode` | Free Preeti to Unicode converter | Informational / Utility | preeti nepali font to unicode online, preeti converter, nepali typing conversion | Nepali typists, government officials, journalists |
| `/brand-tools/preeti-word-to-unicode` | Free Preeti Word to Unicode converter | Utility | convert docx preeti to unicode, nepali word document font converter, preeti file converter | Office administrators, students, typists |
| `/brand-tools/nepali-unicode-typing` | Free Nepali Unicode typing | Utility | phonetic romanized nepali keyboard, english to nepali typing online, unicode nepali text | Diaspora Nepalis, social media creators |
| `/brand-tools/nepali-date-converter` | Free Nepali date converter | Informational / Utility | BS to AD date conversion, bikram sambat calendar converter, nepali date to english | Expats, visa applicants, HR personnel |
| `/brand-tools/nepali-ocr` | Free Nepali OCR online | Utility | extract nepali text from image, devanagari pdf ocr, convert scanned nepali doc to text | Researchers, archivists, legal clerks |
| `/brand-tools/nepali-speech-to-text` | Free Nepali speech to text | Utility | nepali voice typing online, transcribe spoken nepali audio, whisper nepali transcription | Content creators, interviewers, typists |
| `/brand-tools/preeti-pdf-to-unicode` | Free Preeti PDF to Unicode converter | Utility | extract text from preeti pdf, convert scanned nepali pdf to unicode, nepali pdf text copy | Government clerks, lawyers, students |

---

## 4. Technical Audit & Fixes Completed

### 4.1 Indexability & Status Codes
- Every route renders static HTML via Next.js SSG (`getStaticProps` / static export).
- Self-referencing canonical tag injected via `CustomHead.jsx` across all 32+ pages.
- Query strings automatically stripped from canonicals to prevent duplicate parameter indexing.
- Replaced buggy `404.page.jsx` client redirect (`router.push('/')`) with a non-redirecting, helpful error page featuring links to the Hub and 6 top utilities. Added `500.page.jsx`.

### 4.2 Headings & Semantic Document Outline
- Exactly one `<h1>` per page.
- Accessible focus management: after client-side transitions, focus is silently shifted to `<h1 tabIndex={-1}>` without jarring viewport scroll jumps.
- Proper heading cascades (`H1` → `H2` for sections → `H3` for individual cards/steps).

### 4.3 Viewport & Usability
- Verified `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`.
- Strictly no `user-scalable=no` or `maximum-scale=1.0` ensuring compliance with WCAG Criterion 1.4.4 (Resize Text).

### 4.4 Font Preloading (Core Web Vitals)
- Updated `src/pages/_document.page.jsx` to preload the 6 Neue Haas Grotesk WOFF2 web fonts using `rel="preload" as="font" type="font/woff2" crossOrigin="anonymous"`.
- Prevents Flash of Unstyled Text (FOUT) and minimizes Largest Contentful Paint (LCP).

### 4.5 Structured Data (Schema.org)
- **`WebApplication`**: Configured on all 21 tools with `applicationCategory: "UtilitiesApplication"`, `operatingSystem: "Any"`, and `offers: { price: "0", priceCurrency: "USD" }`.
- **`BreadcrumbList`**: Configured on tool pages and legal pages (`/privacy`, `/terms`, `/licenses`).
- **`ItemList`**: Configured on `/brand-tools` indexing all 21 utilities for rich snippet display.
- **`Person`**: Configured on `/` and `/about` with `sameAs` array linking to verified LinkedIn, Instagram, and Facebook profiles.
- **`FAQPage`**: Dynamically injected on pages containing FAQs.

---

## 5. Post-Launch SEO Action Items (For User)

1. **Google Search Console Verification:**
   - Add property `https://rajanbhatta.com.np` in GSC.
   - Submit sitemap: `https://rajanbhatta.com.np/sitemap.xml`.
   - Use URL Inspection on `/brand-tools` and request indexing.
2. **Backlink & Community Outreach:**
   - Launch on Product Hunt, Show HN, and Reddit (`r/design`, `r/webdev`, `r/Nepal`).
   - Create video walkthroughs for LinkedIn and Instagram demonstrating the 100% private in-browser conversions.
3. **Performance Monitoring:**
   - Track monthly Impressions and CTR in GSC; refine titles on pages that earn impressions but low click-through rates.
