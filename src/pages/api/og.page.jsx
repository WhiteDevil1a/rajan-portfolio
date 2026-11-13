import { ImageResponse } from 'next/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Free Brand Design Tools';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#f0f4f1',
            padding: '60px 80px',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#ff2828',
              }}
            />
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#28282b',
                letterSpacing: '-0.5px',
              }}
            >
              Rajan Bhatta — Brand Tools
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxWidth: '1040px',
            }}
          >
            <h1
              style={{
                fontSize: 54,
                fontWeight: 800,
                color: '#28282b',
                lineHeight: 1.15,
                margin: 0,
                letterSpacing: '-1.5px',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 26,
                color: 'rgba(40, 40, 43, 0.7)',
                margin: 0,
              }}
            >
              100% Free · No Login · Runs in Browser · Instant Export
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderTop: '1px solid rgba(40, 40, 43, 0.15)',
              paddingTop: '24px',
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: 'rgba(40, 40, 43, 0.5)',
              }}
            >
              rajanbhatta.com.np/brand-tools
            </span>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#ff2828',
              }}
            >
              Brand Identity System Suite
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
