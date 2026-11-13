/**
 * Single source of truth for all Brand Tools.
 * Used by: hub page, sitemap, related-tools, structured data, nav.
 *
 * Adding a new tool:
 * 1. Add an entry here.
 * 2. Create its page at src/pages/brand-tools/<slug>/index.page.tsx
 * 3. The sitemap, hub page, and related-tools links update automatically.
 */

export type ToolCategory =
  | 'Brand Foundation'
  | 'Branded Assets'
  | 'Brand Research'
  | 'Image & SVG Tools'
  | 'Nepali Tools';

export type SchemaType = 'DesignApplication' | 'UtilitiesApplication';

export interface FAQ {
  q: string;
  a: string;
}

export interface Tool {
  /** URL slug — must match the directory name under /brand-tools/ */
  id: string;
  /** Display number e.g. "01" */
  number: string;
  category: ToolCategory;
  title: string;
  /** Short one-line tagline shown on hub cards */
  tagline: string;
  /** Medium description shown on hub cards */
  description: string;
  /** Full href for linking */
  href: string;
  /** SEO <title> (keep ≤ 60 chars) */
  seoTitle: string;
  /** Meta description (140–160 chars) */
  seoDescription: string;
  /** Primary keyword for the page (goes in H1) */
  primaryKeyword: string;
  /** Additional keywords for coverage */
  secondaryKeywords: string[];
  /** FAQ items rendered as real HTML on the page */
  faq: FAQ[];
  /** IDs of related tools shown at the bottom of the page */
  relatedIds: string[];
  /** JSON-LD schema applicationCategory */
  schemaType: SchemaType;
  /** Long-form copy (300–500 words) rendered as server HTML */
  longDescription?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// BRAND FOUNDATION
// ─────────────────────────────────────────────────────────────────────────────

const brandFoundationTools: Tool[] = [
  {
    id: 'brand-kit',
    number: '01',
    category: 'Brand Foundation',
    title: 'Brand Kit',
    tagline: 'Unified visual identity manager & guideline generator',
    description:
      'Establish, store, and deploy your complete brand identity system. Powers all creative tools, exports production CSS variables, and compiles multi-page Brand Guidelines PDFs.',
    href: '/brand-tools/brand-kit',
    seoTitle: 'Free Brand Kit Generator – No Signup | Rajan Bhatta',
    seoDescription:
      'Create and manage your complete visual identity system for free. Build a Brand Kit with colors, fonts, logos, and export CSS variables or a Brand Guidelines PDF.',
    primaryKeyword: 'brand kit generator',
    secondaryKeywords: ['brand guidelines generator', 'visual identity kit', 'brand system', 'brand identity tool'],
    faq: [
      {
        q: 'What is a Brand Kit?',
        a: "A Brand Kit is a central document or digital file that stores your brand's core visual assets — logo, color palette, typography, and usage rules — so everyone on your team applies them consistently.",
      },
      {
        q: 'Is the Brand Kit saved anywhere on a server?',
        a: "No. All data lives in your browser's local storage. Nothing is uploaded to any server. Your brand assets never leave your device.",
      },
      {
        q: 'Can I export my Brand Kit?',
        a: 'Yes. You can download a multi-page Brand Guidelines PDF, copy production-ready CSS custom properties, or export a full JSON backup.',
      },
      {
        q: 'Does the Brand Kit sync with other tools?',
        a: 'Yes. When you configure your Brand Kit, every other tool in this suite — Business Cards, Letterheads, QR Codes, and more — automatically inherits your colors, fonts, and logo.',
      },
      {
        q: 'What if I want to use Kantipur or Preeti fonts in my brand?',
        a: 'The Brand Kit stores font family names. For Devanagari display, use the Nepali Unicode Typing tool to prepare your text, then reference any web-safe Devanagari font in your kit.',
      },
    ],
    relatedIds: ['color-palette', 'business-card', 'email-signature', 'qr-code'],
    schemaType: 'DesignApplication',
  },
  {
    id: 'color-palette',
    number: '02',
    category: 'Brand Foundation',
    title: 'Color Palette Extractor',
    tagline: 'Client-side image color clustering & extraction',
    description:
      'Upload logos or photography to extract dominant, harmonious color systems instantly. Inspect HEX, RGB, HSL, and CMYK tokens with one-click Brand Kit sync.',
    href: '/brand-tools/color-palette',
    seoTitle: 'Free Color Palette Extractor from Image | Rajan Bhatta',
    seoDescription:
      'Extract dominant colors from any image in seconds. Get HEX, RGB, HSL, and CMYK values instantly — free, no signup, runs entirely in your browser.',
    primaryKeyword: 'color palette extractor',
    secondaryKeywords: ['extract color from image', 'image color picker', 'dominant color extractor', 'color palette generator'],
    faq: [
      {
        q: 'How does the color extraction work?',
        a: 'The tool uses a k-means color clustering algorithm running entirely in your browser to find the most dominant color groups in your image.',
      },
      {
        q: 'What image formats are supported?',
        a: 'JPG, PNG, WebP, GIF, and SVG are all supported. The image is never uploaded — it is processed in memory in your browser.',
      },
      {
        q: 'Can I export the palette to my Brand Kit?',
        a: 'Yes. Click "Add to Brand Kit" on any color to sync it directly to your Brand Kit palette.',
      },
    ],
    relatedIds: ['brand-kit', 'gradient', 'color-contrast'],
    schemaType: 'DesignApplication',
  },
  {
    id: 'gradient',
    number: '03',
    category: 'Brand Foundation',
    title: 'Gradient Generator',
    tagline: 'Multi-stop linear and radial gradient design',
    description:
      'Design mathematically smooth linear and radial gradients using your Brand Kit colors. Copy standard CSS rules or download high-resolution 1080p PNG wallpapers.',
    href: '/brand-tools/gradient',
    seoTitle: 'Free CSS Gradient Generator – No Signup | Rajan Bhatta',
    seoDescription:
      'Create beautiful linear and radial CSS gradients with live preview. Copy CSS code or download as a high-res PNG. Free, no signup, 100% in-browser.',
    primaryKeyword: 'gradient generator',
    secondaryKeywords: ['css gradient generator', 'linear gradient', 'radial gradient', 'gradient maker'],
    faq: [
      {
        q: 'Can I create multi-stop gradients?',
        a: 'Yes. Add as many color stops as you need and drag them to any position.',
      },
      {
        q: 'How do I use the gradient in my project?',
        a: 'Click "Copy CSS" to get a ready-to-paste CSS background-image rule. Alternatively, download a 1080p PNG wallpaper.',
      },
    ],
    relatedIds: ['brand-kit', 'color-palette', 'color-contrast'],
    schemaType: 'DesignApplication',
  },
  {
    id: 'color-contrast',
    number: '04',
    category: 'Brand Foundation',
    title: 'Color Contrast Checker',
    tagline: 'WCAG 2.1 AA/AAA compliance & tonal scale generator',
    description:
      'Audit typography and interface accessibility ratios in real time. Generate systematically calibrated 10-step tint and shade scales for digital design systems.',
    href: '/brand-tools/color-contrast',
    seoTitle: 'Free WCAG Color Contrast Checker & Shade Generator | Rajan Bhatta',
    seoDescription:
      'Check WCAG 2.1 AA and AAA color contrast ratios instantly. Generate 10-step tint and shade scales. Free accessibility tool, no signup required.',
    primaryKeyword: 'color contrast checker',
    secondaryKeywords: ['wcag contrast checker', 'accessibility color contrast', 'color shade generator', 'color tint generator'],
    faq: [
      {
        q: 'What WCAG levels does this check?',
        a: 'The tool checks both WCAG 2.1 AA (minimum 4.5:1 for normal text, 3:1 for large text) and AAA (7:1 for normal text, 4.5:1 for large text).',
      },
      {
        q: 'What is the shade scale generator?',
        a: 'It creates a 10-step perceptually uniform tint and shade scale from any base color — useful for building design system color tokens.',
      },
    ],
    relatedIds: ['brand-kit', 'color-palette', 'gradient'],
    schemaType: 'UtilitiesApplication',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BRANDED ASSETS
// ─────────────────────────────────────────────────────────────────────────────

const brandedAssetsTools: Tool[] = [
  {
    id: 'business-card',
    number: '05',
    category: 'Branded Assets',
    title: 'Business Card Generator',
    tagline: 'Standard 3.5×2 inch print-ready stationery with vCard QR',
    description:
      'Generate commercial print-ready business cards styled with your brand logo, colors, and typography. Includes dynamic vCard QR code integration and 300 DPI PDF export.',
    href: '/brand-tools/business-card',
    seoTitle: 'Free Business Card Generator – Print-Ready PDF | Rajan Bhatta',
    seoDescription:
      'Design and download print-ready business cards for free. 300 DPI PDF export, vCard QR code, Brand Kit sync. No signup, no watermark.',
    primaryKeyword: 'business card generator',
    secondaryKeywords: ['free business card maker', 'business card design', 'print business card', 'visiting card generator'],
    faq: [
      {
        q: 'What resolution are the exported business cards?',
        a: 'Cards export at 300 DPI, the standard resolution for professional commercial printing.',
      },
      {
        q: 'Can I add a QR code to my business card?',
        a: 'Yes. A vCard QR code is automatically generated from your contact details and embedded in the card design.',
      },
    ],
    relatedIds: ['brand-kit', 'qr-code', 'email-signature'],
    schemaType: 'DesignApplication',
  },
  {
    id: 'email-signature',
    number: '06',
    category: 'Branded Assets',
    title: 'Email Signature Generator',
    tagline: 'Responsive HTML signatures for Gmail, Outlook & Apple Mail',
    description:
      'Generate email-client-compatible HTML table signatures formatted with clean inline CSS. Auto-fills your brand assets and provides one-click rich formatting copy.',
    href: '/brand-tools/email-signature',
    seoTitle: 'Free HTML Email Signature Generator – Gmail & Outlook | Rajan Bhatta',
    seoDescription:
      'Create a professional HTML email signature for Gmail, Outlook, and Apple Mail. Free, no watermark, copy-paste ready. Brand Kit auto-fill included.',
    primaryKeyword: 'email signature generator',
    secondaryKeywords: ['html email signature', 'gmail signature generator', 'outlook signature maker', 'professional email signature'],
    faq: [
      {
        q: 'Will the signature work in Gmail and Outlook?',
        a: 'Yes. The HTML uses inline CSS table layouts tested across Gmail, Outlook, Apple Mail, and Yahoo Mail.',
      },
      {
        q: 'Can I include my photo or logo?',
        a: 'Yes. Upload an image — it is embedded as a base64 data URL so it displays even when images are blocked by email clients.',
      },
    ],
    relatedIds: ['brand-kit', 'business-card', 'letterhead'],
    schemaType: 'DesignApplication',
  },
  {
    id: 'letterhead',
    number: '07',
    category: 'Branded Assets',
    title: 'Letterhead Generator',
    tagline: 'Standardized A4 corporate stationery & vector PDF export',
    description:
      'Generate official A4 business correspondence with your vector logo, header styles, and typographic hierarchy. Includes live editing, print preview, and vector PDF download.',
    href: '/brand-tools/letterhead',
    seoTitle: 'Free Letterhead Generator – A4 PDF Download | Rajan Bhatta',
    seoDescription:
      'Design a professional A4 corporate letterhead and download it as a vector PDF. Free, Brand Kit sync, live preview. No signup or watermark.',
    primaryKeyword: 'letterhead generator',
    secondaryKeywords: ['company letterhead template', 'business letterhead maker', 'a4 letterhead design', 'official letterhead'],
    faq: [
      {
        q: 'What paper size is supported?',
        a: 'A4 (210mm × 297mm) is the default. The PDF is vector-based so you can scale it to other sizes without quality loss.',
      },
    ],
    relatedIds: ['brand-kit', 'email-signature', 'business-card'],
    schemaType: 'DesignApplication',
  },
  {
    id: 'qr-code',
    number: '08',
    category: 'Branded Assets',
    title: 'QR Code Generator',
    tagline: 'Custom branded QR codes with logo embedding & SVG export',
    description:
      'Create customized, high-reliability QR codes for URLs, vCards, WiFi networks, and contact info. Apply brand colors, embed your center logo, and export scalable SVGs or high-res PNGs.',
    href: '/brand-tools/qr-code',
    seoTitle: 'Free Branded QR Code Generator – SVG & PNG | Rajan Bhatta',
    seoDescription:
      'Generate custom QR codes with your brand logo and colors. Export as SVG or high-res PNG. Free, no watermark, no signup required.',
    primaryKeyword: 'qr code generator',
    secondaryKeywords: ['custom qr code', 'branded qr code', 'qr code with logo', 'free qr code maker', 'svg qr code'],
    faq: [
      {
        q: 'What content types can I encode in a QR code?',
        a: 'URL, plain text, vCard contact, WiFi credentials, email, phone number, and SMS.',
      },
      {
        q: 'Can I add my logo to the QR code?',
        a: 'Yes. Upload a PNG or SVG logo and it is centered in the QR code. The error-correction level is automatically increased to ensure the code remains scannable.',
      },
    ],
    relatedIds: ['brand-kit', 'business-card', 'color-palette'],
    schemaType: 'UtilitiesApplication',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BRAND RESEARCH
// ─────────────────────────────────────────────────────────────────────────────

const brandResearchTools: Tool[] = [
  {
    id: 'logo-search',
    number: '09',
    category: 'Brand Research',
    title: 'Brand Logo Search',
    tagline: 'Search 3,000+ official brand logos & hex colors',
    description:
      "Find any brand's official logo SVG and exact hex color instantly. Copy SVG markup, copy hex code, or download SVG and PNG — all free, no login required.",
    href: '/brand-tools/logo',
    seoTitle: 'Free Brand Logo Search – SVG & Colors | Rajan Bhatta',
    seoDescription:
      'Search 3,000+ official brand logos. Find exact brand colors, download SVG or PNG, copy hex codes instantly. Free, no signup.',
    primaryKeyword: 'brand logo search',
    secondaryKeywords: ['company logo download', 'brand svg download', 'official brand colors', 'logo finder'],
    faq: [
      {
        q: 'How many brands are available?',
        a: 'Over 3,000 brands across tech, finance, media, and more — powered by Simple Icons.',
      },
      {
        q: 'Are the logos official?',
        a: 'The logos are sourced from Simple Icons, which maintains an up-to-date library of official SVG brand icons with verified hex colors.',
      },
    ],
    relatedIds: ['color-palette', 'brand-kit', 'color-contrast'],
    schemaType: 'UtilitiesApplication',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE & SVG TOOLS
// ─────────────────────────────────────────────────────────────────────────────

const imageSvgTools: Tool[] = [
  {
    id: 'svg-to-png',
    number: '10',
    category: 'Image & SVG Tools',
    title: 'SVG to PNG Converter',
    tagline: 'Convert SVG to PNG, JPG, or WebP in your browser',
    description:
      'Upload SVG files and convert them to PNG, JPG, or WebP at any resolution. Set exact dimensions, choose transparent or solid background, and download individually or as a ZIP.',
    href: '/brand-tools/svg-to-png',
    seoTitle: 'Free SVG to PNG Converter – Transparent Background | Rajan Bhatta',
    seoDescription:
      'Convert SVG to PNG, JPG, or WebP instantly in your browser. Set custom width, transparent background, batch convert. Free, no signup, files stay on your device.',
    primaryKeyword: 'svg to png',
    secondaryKeywords: ['convert svg to png', 'svg to png transparent', 'svg to jpg', 'svg to webp', 'svg converter'],
    longDescription:
      'SVG (Scalable Vector Graphics) is the go-to format for logos, icons, and illustrations because it scales to any size without losing quality. But many platforms — social media, presentations, WordPress — only accept raster images like PNG or JPG.\n\nThis converter renders your SVG to a pixel-perfect raster image using an offscreen HTML5 Canvas. The SVG is first sanitized: any embedded `<script>` tags, JavaScript event handlers (like `onclick` or `onerror`), and references to external URLs are stripped before rendering, so you can safely convert files from untrusted sources.\n\nSVGs that do not declare a `width` and `height` attribute are handled via their `viewBox` — the tool reads the viewBox and calculates the correct aspect ratio automatically.\n\n**When to use PNG:** Use PNG for logos, icons, and graphics that need a transparent background. PNG is lossless, so it preserves sharp edges and text.\n\n**When to use JPG:** Use JPG for photographic content where file size matters more than transparency. JPG does not support transparency.\n\n**When to use WebP:** WebP gives better compression than PNG or JPG with comparable quality. Use it for web images where you control the technology stack.\n\n**Scale presets:** 1× is the native SVG size; 2× is retina display quality; 4× is suitable for large print and marketing materials.\n\nThis tool processes everything in your browser — your files are never uploaded anywhere.',
    faq: [
      {
        q: 'Does the converter handle SVGs without width/height attributes?',
        a: 'Yes. It reads the viewBox attribute to determine the aspect ratio, then renders at your specified output size.',
      },
      {
        q: 'Is transparent background supported?',
        a: 'Yes for PNG and WebP. JPG does not support transparency — if you choose JPG with a transparent SVG, the transparent areas will be rendered as white.',
      },
      {
        q: 'Can I batch convert multiple SVG files?',
        a: 'Yes. Upload multiple files at once and download all outputs as a ZIP file.',
      },
      {
        q: 'Is it safe to convert SVG files from the internet?',
        a: 'The tool strips all scripts and external references before rendering. That said, always be cautious about files from untrusted sources.',
      },
      {
        q: 'What is the maximum file size?',
        a: 'There is no hard limit, but very large SVGs with complex paths may take a few seconds to render. Processing happens in a background Web Worker to keep the UI responsive.',
      },
      {
        q: 'Are my files uploaded to a server?',
        a: 'No. All conversion happens in your browser. Your files never leave your device.',
      },
    ],
    relatedIds: ['png-to-svg', 'svg-optimizer', 'favicon-generator'],
    schemaType: 'UtilitiesApplication',
  },
  {
    id: 'png-to-svg',
    number: '11',
    category: 'Image & SVG Tools',
    title: 'PNG to SVG Converter',
    tagline: 'Raster to vector tracing in your browser',
    description:
      'Trace PNG or JPG images into SVG vectors using client-side processing. Best for logos and icons with flat colors. Adjust color count, detail level, and smoothing.',
    href: '/brand-tools/png-to-svg',
    seoTitle: 'Free PNG to SVG Converter – Image to Vector | Rajan Bhatta',
    seoDescription:
      'Convert PNG or JPG to SVG vector online. Trace logos and icons to scalable vectors. Free, no signup, runs entirely in your browser.',
    primaryKeyword: 'png to svg',
    secondaryKeywords: ['convert png to svg', 'image to svg', 'jpg to svg', 'logo to vector', 'raster to vector'],
    longDescription:
      'Vector tracing converts a pixel-based raster image (PNG, JPG) into a scalable SVG made of mathematical paths. The result can be scaled to any size without pixelation — ideal for logos, icons, and simple illustrations.\n\nThis tool uses imagetracerjs, a public-domain JavaScript library, to trace your image entirely in the browser. No server upload, no waiting in a queue.\n\n**What works well:** Simple logos, icons, and graphics with flat or solid colors — especially those with clean edges and high contrast between elements. The fewer the colors, the better the trace.\n\n**What does not work well:** Photographs and complex images with gradients, shadows, and thousands of colors. Tracing a photo produces a very large SVG file that is not practically usable as a vector. Use the Image Compressor for photos.\n\n**Mode guide:**\n- *Logo* — optimized for flat, solid-color brand marks (up to 8 colors)\n- *Icon* — reduces to 2 colors for clean silhouette icons\n- *Illustration* — allows up to 16 colors with smooth curves\n- *Photo (simplified)* — posterizes the image for an artistic vector effect\n\nAfter conversion, review the side-by-side preview to judge quality. For professional logo vectorization, a manual vector drawing in Inkscape or Illustrator will always produce a cleaner result.',
    faq: [
      {
        q: 'Will it perfectly vectorize my logo?',
        a: 'For simple, high-contrast logos with solid colors — usually yes, the result is clean enough for direct use. For complex logos, review the output and manually clean up paths if needed.',
      },
      {
        q: 'Can I trace a photo into an SVG?',
        a: 'Technically yes, but the result is a very large SVG with thousands of paths. It is not practical for most uses. The tool is best suited for logos and icons.',
      },
      {
        q: 'What is the color count setting?',
        a: 'It limits how many distinct colors the tracer uses. Lower values produce simpler, cleaner SVGs; higher values capture more detail.',
      },
      {
        q: 'Is the output SVG editable?',
        a: 'Yes. You can copy the SVG code and paste it into Inkscape, Figma, or Illustrator for further editing.',
      },
      {
        q: 'Are my images uploaded to a server?',
        a: 'No. All tracing happens in your browser using imagetracerjs. Your images never leave your device.',
      },
    ],
    relatedIds: ['svg-to-png', 'svg-optimizer', 'image-compressor'],
    schemaType: 'UtilitiesApplication',
  },
  {
    id: 'svg-optimizer',
    number: '12',
    category: 'Image & SVG Tools',
    title: 'SVG Optimizer',
    tagline: 'Compress and clean SVG files with SVGO in your browser',
    description:
      'Reduce SVG file size by removing unnecessary metadata, comments, and redundant attributes using SVGO. See before/after size savings and the optimized code with copy button.',
    href: '/brand-tools/svg-optimizer',
    seoTitle: 'Free SVG Optimizer & Minifier – SVGO Online | Rajan Bhatta',
    seoDescription:
      'Optimize and compress SVG files online using SVGO. Remove metadata, minify, reduce file size. Free, no signup, processes in your browser.',
    primaryKeyword: 'svg optimizer',
    secondaryKeywords: ['svg minifier', 'compress svg', 'reduce svg file size', 'svgo online', 'svg cleaner'],
    longDescription:
      'SVG files exported from design tools like Figma, Adobe Illustrator, or Inkscape often contain large amounts of unnecessary data: editor metadata, comments, inline styles that can be merged, redundant group elements, and decimal-precision coordinates that could be rounded without visible change.\n\nThis tool runs SVGO (SVG Optimizer, MIT license) in a Web Worker in your browser to clean and compress your SVG files without any server upload.\n\n**What SVGO does:**\n- Removes editor-specific metadata (Adobe, Inkscape, Sketch namespaces)\n- Removes comments and hidden elements\n- Merges inline styles with attributes\n- Rounds coordinate values to a configurable decimal precision\n- Removes empty groups and unnecessary wrappers\n- Converts basic shapes to path elements (optional)\n\n**What to watch out for:**\n- The *remove viewBox* option is disabled by default. Removing viewBox breaks SVG scaling in many contexts — only enable it if you know the SVG has explicit width/height attributes and will never be resized.\n- The optimized SVG is previewed alongside the original so you can visually confirm nothing changed.\n\nTypical savings range from 20% to 70% depending on the source application. Files exported from Figma are already relatively clean; files from Illustrator often carry significant overhead.',
    faq: [
      {
        q: 'Is SVGO safe to use on production SVGs?',
        a: 'Yes, with the default settings. Always visually compare the before/after preview before deploying. If the SVG uses JavaScript or animation, some plugins may interact unexpectedly.',
      },
      {
        q: 'What does "multipass" do?',
        a: 'Multipass runs SVGO multiple times until the file size stops decreasing. It produces smaller output but takes slightly longer.',
      },
      {
        q: 'Why is "remove viewBox" a warning option?',
        a: 'The viewBox attribute is what makes SVGs scalable with CSS. Removing it breaks responsiveness in most real-world use cases.',
      },
      {
        q: 'Can I batch optimize multiple SVGs?',
        a: 'Yes. Upload multiple files and download all optimized versions as a ZIP.',
      },
      {
        q: 'Are my files uploaded to a server?',
        a: 'No. SVGO runs entirely in your browser in a Web Worker. Your files are never transmitted anywhere.',
      },
    ],
    relatedIds: ['svg-to-png', 'png-to-svg', 'favicon-generator'],
    schemaType: 'UtilitiesApplication',
  },
  {
    id: 'favicon-generator',
    number: '13',
    category: 'Image & SVG Tools',
    title: 'Favicon Generator',
    tagline: 'Generate all favicon sizes and formats from one image',
    description:
      'Create a complete favicon package — ICO, PNG sizes, Apple Touch Icon, Android Chrome icons, site.webmanifest, and an HTML snippet — all from a single source image.',
    href: '/brand-tools/favicon-generator',
    seoTitle: 'Free Favicon Generator – ICO, PNG, Apple Touch Icon | Rajan Bhatta',
    seoDescription:
      'Generate all favicon formats from one image: .ico, PNG sizes, Apple Touch Icon, Android Chrome icons, webmanifest and HTML code. Free, no signup, fully in-browser.',
    primaryKeyword: 'favicon generator',
    secondaryKeywords: ['png to ico', 'svg to ico', 'favicon.ico generator', 'apple touch icon generator', 'favicon maker'],
    longDescription:
      'Modern browsers and operating systems request favicons in many different sizes and formats. Missing any of them causes broken icons or fallbacks to a generic browser icon.\n\nThis generator creates the complete set from a single source image — all processing happens in your browser:\n\n**Outputs in the ZIP:**\n- `favicon.ico` — multi-size ICO container (16×16, 32×32, 48×48) encoded client-side without any server\n- `favicon-16x16.png`, `favicon-32x32.png` — standard browser favicons\n- `apple-touch-icon.png` (180×180) — used when visitors "Add to Home Screen" on iOS\n- `android-chrome-192x192.png` and `android-chrome-512x512.png` — used by Android PWAs\n- `favicon.svg` — if your source is an SVG, the original is included with a `prefers-color-scheme` dark mode variant\n- `site.webmanifest` — ready-to-use Web App Manifest\n- `head-snippet.html` — copy-paste HTML for your `<head>` tag\n\n**Options:**\n- Padding and background color (for square vs. full-bleed designs)\n- Rounded corners or circle crop for Apple and Android variants\n- Text/emoji input if you do not have a logo image yet\n\n**Dark mode favicon:** When your source is SVG, the tool generates an SVG favicon with a `prefers-color-scheme: dark` media query so it automatically switches to a light icon on dark browser chrome.',
    faq: [
      {
        q: 'What image formats can I upload?',
        a: 'PNG, JPG, SVG, and WebP. For best results, use a square PNG or SVG at least 512×512 pixels.',
      },
      {
        q: 'Is the ICO file generated without a server?',
        a: 'Yes. The .ico container is built entirely in your browser using a client-side ICO encoder. No server is involved.',
      },
      {
        q: 'What is the site.webmanifest file?',
        a: 'It is a JSON file that tells browsers about your web app — name, icons, theme color. Place it in your website root and reference it from your HTML head.',
      },
      {
        q: 'Does it support dark mode favicons?',
        a: 'Yes, when your source is SVG. The output SVG favicon includes a prefers-color-scheme media query so it adapts to the user\'s OS theme.',
      },
      {
        q: 'Are my images uploaded to a server?',
        a: 'No. All generation happens in your browser. Your images never leave your device.',
      },
    ],
    relatedIds: ['svg-to-png', 'svg-optimizer', 'brand-kit'],
    schemaType: 'UtilitiesApplication',
  },
  {
    id: 'image-compressor',
    number: '14',
    category: 'Image & SVG Tools',
    title: 'Image Compressor',
    tagline: 'Compress JPG, PNG, and WebP images in your browser',
    description:
      'Reduce image file size without losing visible quality. Adjust quality, max dimensions, strip EXIF data, convert format, or hit a target file size in KB.',
    href: '/brand-tools/image-compressor',
    seoTitle: 'Free Image Compressor – Compress JPG, PNG, WebP | Rajan Bhatta',
    seoDescription:
      'Compress JPG, PNG, and WebP images online. Reduce file size, strip EXIF data, batch compress, download as ZIP. Free, no signup, runs in your browser.',
    primaryKeyword: 'image compressor',
    secondaryKeywords: [
      'compress jpg',
      'compress png',
      'reduce image size',
      'compress image to 100kb',
      'compress image to 50kb',
      'image file size reducer',
    ],
    longDescription:
      'Large image files slow down your website, increase storage costs, and use more mobile data. Compressing images before uploading them is one of the highest-impact performance optimizations you can make.\n\nThis tool uses browser-image-compression (MIT) running in a Web Worker, so compression runs in the background without freezing your browser tab.\n\n**Formats supported:**\n- Input: JPG, PNG, WebP, AVIF (if your browser supports AVIF decoding)\n- Output: JPG, PNG, WebP, AVIF (output AVIF is only available if your browser supports encoding)\n\n**Key features:**\n- Quality slider (1–100%)\n- Max width and height constraints (the image is resized proportionally if it exceeds these)\n- EXIF metadata strip — removes GPS location, camera model, and other private data embedded in JPG files\n- Format conversion — compress and convert format in one step\n- **Target size mode** — enter a target file size in KB and the tool iterates the quality setting to get as close as possible\n- Batch processing with per-file before/after size, total savings summary, and ZIP download\n\n**When to use each format:**\n- *JPG* — best for photographs; small file, no transparency\n- *PNG* — best for screenshots and graphics with text or transparency; lossless\n- *WebP* — better compression than JPG or PNG; good browser support as of 2024\n- *AVIF* — cutting-edge compression, often 50% smaller than WebP; not supported in all browsers yet',
    faq: [
      {
        q: 'How much can I reduce an image file size?',
        a: 'Typical results: 50–80% reduction for JPGs at quality 75, 30–60% for PNGs. Results vary by image content and original compression.',
      },
      {
        q: 'Does compression reduce image quality?',
        a: 'JPG and WebP compression is lossy — some quality is traded for size. At quality 75–80%, the difference is usually invisible to the eye. PNG compression is lossless.',
      },
      {
        q: 'How does "target size in KB" work?',
        a: 'The tool binary-searches the quality setting to get the output file as close as possible to your target size. It may not hit the exact number if the image cannot be compressed that far without severe quality loss.',
      },
      {
        q: 'Does stripping EXIF data remove my GPS location?',
        a: 'Yes. Photos taken on a phone often embed GPS coordinates in EXIF metadata. Enabling "Strip metadata" removes this before you share or upload the image.',
      },
      {
        q: 'Are my images uploaded to a server?',
        a: 'No. Compression runs entirely in your browser in a Web Worker. Your images never leave your device.',
      },
    ],
    relatedIds: ['svg-to-png', 'png-to-svg', 'favicon-generator'],
    schemaType: 'UtilitiesApplication',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEPALI TOOLS
// ─────────────────────────────────────────────────────────────────────────────

const nepaliTools: Tool[] = [
  {
    id: 'preeti-to-unicode',
    number: '15',
    category: 'Nepali Tools',
    title: 'Preeti to Unicode Converter',
    tagline: 'Two-way Preeti ↔ Unicode Nepali font converter',
    description:
      'Convert Preeti-encoded Nepali text to standard Unicode and vice versa. Live conversion, copy button, swap, and example text. Unicode output works in Word, Google Docs, and everywhere.',
    href: '/brand-tools/preeti-to-unicode',
    seoTitle: 'Free Preeti to Unicode Converter – Nepali Font | Rajan Bhatta',
    seoDescription:
      'Convert Preeti Nepali font text to Unicode instantly. Two-way converter, live preview, copy button. Free, no signup, runs in your browser.',
    primaryKeyword: 'preeti to unicode',
    secondaryKeywords: ['preeti to unicode converter', 'unicode to preeti', 'preeti font converter', 'nepali font converter', 'प्रीति टु युनिकोड'],
    faq: [
      {
        q: 'What is Preeti?',
        a: 'Preeti is a legacy Nepali font encoding that maps Devanagari characters to ASCII positions. Documents typed in Preeti look like Nepali on screen but are not stored as Unicode, so they cannot be read by modern software without the font.',
      },
      {
        q: 'Why should I convert Preeti to Unicode?',
        a: 'Unicode Nepali works everywhere — Word, Google Docs, websites, mobile apps, and social media — without requiring any special font to be installed.',
      },
      {
        q: 'Does it handle the choti-ikar (ि) correctly?',
        a: 'Yes. In Preeti, the choti-ikar is typed before the consonant it belongs to, but in Unicode it must follow the consonant. The converter correctly reorders it.',
      },
      {
        q: 'Can I convert Unicode back to Preeti?',
        a: 'Yes. The converter works both ways. Use the swap button to switch directions.',
      },
      {
        q: 'What about other legacy fonts like Kantipur?',
        a: 'The architecture supports additional font maps. Kantipur and other legacy fonts can be added in future updates.',
      },
      {
        q: 'Are my texts uploaded to a server?',
        a: 'No. All conversion happens in your browser. Your text never leaves your device.',
      },
    ],
    relatedIds: ['preeti-word-to-unicode', 'nepali-unicode-typing', 'nepali-date-converter'],
    schemaType: 'UtilitiesApplication',
  },
  {
    id: 'preeti-word-to-unicode',
    number: '18',
    category: 'Nepali Tools',
    title: 'Preeti Word File (.docx) to Unicode Converter',
    tagline: 'Convert Preeti Word (.docx) documents to Unicode while keeping all formatting',
    description:
      'Upload a Microsoft Word (.docx) document typed in legacy Preeti font and convert it to modern Unicode Devanagari. Preserves tables, bold/italic, font sizes, colors, headers, footers, and footnotes.',
    href: '/brand-tools/preeti-word-to-unicode',
    seoTitle: 'Convert Preeti Word File to Unicode (.docx) – Free, Keeps Formatting',
    seoDescription:
      'Convert Preeti Word documents (.docx) to standard Unicode Devanagari without losing formatting, tables, or styles. 100% in-browser, private, and free.',
    primaryKeyword: 'preeti word file to unicode',
    secondaryKeywords: [
      'convert preeti docx to unicode',
      'ms word preeti to unicode',
      'preeti document to unicode',
      'preeti pdf to unicode',
      'Nepali word file gibberish fix',
      'प्रीति वर्ड फाइल युनिकोडमा बदल्ने',
    ],
    faq: [
      {
        q: 'Why does my Nepali document look like English letters or gibberish?',
        a: 'Preeti is a legacy non-Unicode font that maps Nepali characters over ordinary English ASCII keyboard keys. If the viewing device or app (such as Google Docs, modern Word, or mobile phones) does not have the Preeti font file installed, the operating system renders raw English letters instead.',
      },
      {
        q: 'Can I upload old .doc format files?',
        a: 'This converter processes modern OpenXML (.docx) files. If your file ends in .doc, simply open it in Microsoft Word, WPS Office, or LibreOffice, click File → Save As, and choose Word Document (.docx) before uploading.',
      },
      {
        q: 'Will my tables, bold text, and font sizes be preserved?',
        a: 'Yes. The converter parses the Word XML structure directly, converting only legacy Nepali text runs and updating complex-script attributes while preserving paragraph styles, tables, colors, sizes, and character formatting.',
      },
      {
        q: 'What happens to English paragraphs and numbers?',
        a: 'English runs formatted with fonts like Times New Roman, Arial, or Calibri are detected and left completely untouched. You can also choose whether digits should be converted to Nepali numerals (०-९) or retained as standard ASCII numbers (0-9).',
      },
      {
        q: 'Are other legacy fonts like Kantipur or Sagarmatha supported?',
        a: 'Preeti is fully supported. If other legacy fonts (such as Kantipur or Sagarmatha) are detected, they are flagged in the conversion report to prevent incorrect character mapping.',
      },
      {
        q: 'Is my document uploaded to any server?',
        a: 'Never. All conversion and decompression happen entirely within your browser memory using Web Workers. Your files and text never leave your device.',
      },
      {
        q: 'How does it handle words split across formatting runs?',
        a: 'Microsoft Word frequently splits words across runs (for example, if part of a word is bold or spell-checked). Our engine clusters contiguous legacy runs together so choti-ikar (ि) reordering, reph (र्), and conjuncts are calculated across run boundaries without character corruption.',
      },
    ],
    relatedIds: ['preeti-to-unicode', 'nepali-unicode-typing', 'nepali-date-converter'],
    schemaType: 'UtilitiesApplication',
  },
  {
    id: 'nepali-unicode-typing',
    number: '16',
    category: 'Nepali Tools',
    title: 'Nepali Unicode Typing',
    tagline: 'Type Nepali in your browser with phonetic or keyboard input',
    description:
      'Type standard Unicode Nepali text using phonetic (romanized) input or an on-screen traditional Nepali keyboard. Copy, download as .txt, word count, undo/redo.',
    href: '/brand-tools/nepali-unicode-typing',
    seoTitle: 'Nepali Unicode Typing – Free Online Nepali Keyboard | Rajan Bhatta',
    seoDescription:
      'Type Nepali in Unicode online using phonetic input or the traditional keyboard. Free, no signup, copy and download your text. Works on mobile.',
    primaryKeyword: 'nepali unicode typing',
    secondaryKeywords: ['nepali typing', 'roman to nepali', 'english to nepali typing', 'nepali keyboard online', 'नेपाली युनिकोड टाइपिङ'],
    faq: [
      {
        q: 'What is phonetic/romanized input?',
        a: 'You type Nepali words using English letters (e.g., type "namaste" and get "नमस्ते"). The engine converts your romanized input to Devanagari as you type.',
      },
      {
        q: 'Is the on-screen keyboard usable on mobile?',
        a: 'Yes. The on-screen keyboard is touch-friendly and responsive down to 360px wide.',
      },
      {
        q: 'Is the output standard Unicode?',
        a: 'Yes. The output is NFC-normalized Unicode Nepali (Devanagari script) compatible with all modern software.',
      },
      {
        q: 'Can I download my typed text?',
        a: 'Yes. Click "Download" to save your text as a UTF-8 encoded .txt file.',
      },
    ],
    relatedIds: ['preeti-to-unicode', 'nepali-date-converter'],
    schemaType: 'UtilitiesApplication',
  },
  {
    id: 'nepali-date-converter',
    number: '17',
    category: 'Nepali Tools',
    title: 'Nepali Date Converter',
    tagline: 'Convert Bikram Sambat (BS) to AD and AD to BS',
    description:
      'Convert between Nepali Bikram Sambat (BS) and Gregorian (AD) calendar. Shows Nepali numerals, day of week in Nepali, today\'s BS date, and a BS age calculator.',
    href: '/brand-tools/nepali-date-converter',
    seoTitle: 'Free Nepali Date Converter – BS to AD | Rajan Bhatta',
    seoDescription:
      "Convert Nepali Bikram Sambat (BS) dates to AD and vice versa. Shows today's Nepali date, day name, Nepali numerals. Free, no signup.",
    primaryKeyword: 'nepali date converter',
    secondaryKeywords: ['bs to ad', 'ad to bs', 'nepali calendar converter', 'date converter nepali', 'मिति रूपान्तरण', 'नेपाली मिति परिवर्तन'],
    faq: [
      {
        q: 'What is Bikram Sambat (BS)?',
        a: 'Bikram Sambat is the official calendar of Nepal. It runs approximately 56 years and 8.5 months ahead of the Gregorian (AD) calendar. For example, 2025 AD is approximately 2082 BS.',
      },
      {
        q: 'What year range is supported?',
        a: 'BS 2000 to BS 2100 (approximately AD 1943 to AD 2043).',
      },
      {
        q: 'What is the BS age calculator?',
        a: 'Enter your birth date in BS and the tool calculates your exact age in years, months, and days according to the Bikram Sambat calendar.',
      },
      {
        q: 'How accurate is the conversion?',
        a: 'The conversion uses a verified table of BS month lengths. It is accurate for the supported year range. If you spot a discrepancy, please report it.',
      },
      {
        q: 'Are calculations done on a server?',
        a: 'No. All date arithmetic runs in your browser using a local data table. No data is sent to any server.',
      },
    ],
    relatedIds: ['preeti-to-unicode', 'nepali-unicode-typing'],
    schemaType: 'UtilitiesApplication',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MASTER REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

export const TOOLS: Tool[] = [
  ...brandFoundationTools,
  ...brandedAssetsTools,
  ...brandResearchTools,
  ...imageSvgTools,
  ...nepaliTools,
];

/** Fast O(1) lookup by tool id */
export const TOOLS_BY_ID: Record<string, Tool> = Object.fromEntries(TOOLS.map((t) => [t.id, t]));

/** Tools grouped by category, in display order */
export const TOOLS_BY_CATEGORY: Record<ToolCategory, Tool[]> = {
  'Brand Foundation': brandFoundationTools,
  'Branded Assets': brandedAssetsTools,
  'Brand Research': brandResearchTools,
  'Image & SVG Tools': imageSvgTools,
  'Nepali Tools': nepaliTools,
};

/** Ordered list of categories for display */
export const TOOL_CATEGORIES: ToolCategory[] = [
  'Brand Foundation',
  'Branded Assets',
  'Brand Research',
  'Image & SVG Tools',
  'Nepali Tools',
];
