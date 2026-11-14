import React from 'react';
import ToolShell from '@src/components/tools/ToolShell';
import BrandKitBanner from './BrandKitBanner';

/**
 * Standard tool layout: delegates directly to ToolShell design system.
 * Keeps existing tool page imports intact while providing unified typography,
 * accessible server-rendered accordions, and above-the-fold layout.
 */
function ToolLayout({
  toolId,
  number,
  category,
  title,
  subtitle,
  seoTitle,
  seoDescription,
  canonical,
  schemaType = 'UtilitiesApplication',
  showBrandKitBanner = true,
  howItWorks = [],
  features = [],
  longDescription = '',
  tipsAndLimitations = [],
  faqs = [],
  relatedToolIds = [],
  lastUpdated = 'November 2026',
  children,
}) {
  return (
    <ToolShell
      toolId={toolId}
      number={number}
      category={category}
      title={title}
      subtitle={subtitle}
      seoTitle={seoTitle}
      seoDescription={seoDescription}
      canonical={canonical}
      schemaType={schemaType}
      howToSteps={howItWorks}
      features={features}
      howItWorksContent={longDescription}
      tipsAndLimitations={tipsAndLimitations}
      faqs={faqs}
      relatedToolIds={relatedToolIds}
      lastUpdated={lastUpdated}
    >
      {children}
      {showBrandKitBanner && (
        <div style={{ marginTop: '1.5rem' }}>
          <BrandKitBanner toolName={title} />
        </div>
      )}
    </ToolShell>
  );
}

export default ToolLayout;
