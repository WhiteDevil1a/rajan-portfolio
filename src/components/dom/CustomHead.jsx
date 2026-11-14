import NextHead from 'next/head';
import { useRouter } from 'next/router';

const SITE_URL = 'https://rajanbhatta.com.np';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og.png`;

const getPersonSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rajan Bhatta',
  jobTitle: 'Brand Designer & Visual Identity Strategist',
  url: SITE_URL,
  image: DEFAULT_OG_IMAGE,
  email: 'mailto:hi@rajanbhatta.com.np',
  sameAs: [
    'https://www.linkedin.com/in/rajan-bhatta/',
    'https://www.instagram.com/brandwithrajan/',
    'https://www.facebook.com/brandwithrajan',
  ],
  alumniOf: [
    { '@type': 'Organization', name: 'Tech Integrators' },
    { '@type': 'Organization', name: 'Planning Experts' },
    { '@type': 'Organization', name: 'Advertising Experts' },
    { '@type': 'Organization', name: 'Recruit Experts Sdn Bhd' },
    { '@type': 'Organization', name: 'Cure Vibes' },
  ],
});

/**
 * CustomHead — page-level SEO component.
 *
 * Usage:
 *   <CustomHead
 *     title="Page Title | Rajan Bhatta"
 *     description="140–160 char description"
 *     canonical="https://rajanbhatta.com.np/brand-tools/svg-to-png"
 *     ogImage="https://rajanbhatta.com.np/api/og?title=SVG+to+PNG"
 *   />
 *
 * canonical defaults to the current URL (router.asPath).
 * ogImage defaults to /og.png.
 * keywords meta tag is intentionally omitted (Google ignores it).
 */
function CustomHead({
  title = '',
  description = '',
  canonical: canonicalProp,
  ogImage = DEFAULT_OG_IMAGE,
  robots,
  noPersonSchema = false,
}) {
  const router = useRouter();
  // Build self-referencing canonical — strip query strings for clean URLs
  const path = router.asPath.split('?')[0];
  const canonical = canonicalProp || `${SITE_URL}${path === '/' ? '' : path}` || SITE_URL;
  const robotsContent = robots || (process.env.NODE_ENV !== 'development' ? 'index,follow' : 'noindex,nofollow');

  return (
    <NextHead>
      {/* General */}
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta httpEquiv="x-dns-prefetch-control" content="off" />
      <meta name="robots" content={robotsContent} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="Rajan Bhatta" />
      <meta name="referrer" content="no-referrer" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="geo.region" content="NP" />

      {/* Title & canonical — SELF-REFERENCING */}
      <title>{title}</title>
      <link rel="canonical" href={canonical} />

      {/* OpenGraph */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Rajan Bhatta" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@brandwithrajan" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#333333" />
      <meta name="msapplication-TileColor" content="#f0f4f1" />
      <meta name="theme-color" content="#f0f4f1" />

      {/* Person schema — only on personal pages */}
      {!noPersonSchema && (
        // eslint-disable-next-line react/no-danger
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getPersonSchema()) }}
        />
      )}
    </NextHead>
  );
}

export default CustomHead;
