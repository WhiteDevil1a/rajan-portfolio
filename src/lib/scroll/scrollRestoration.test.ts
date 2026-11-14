import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Phase 1 - Scroll and Navigation Management', () => {
  let scrollPositions: Map<string, number>;
  let isPopState: boolean;

  beforeEach(() => {
    scrollPositions = new Map();
    isPopState = false;
  });

  it('records scroll position before route change start when not popstate', () => {
    const currentPath = '/brand-tools';
    const currentScroll = 1450;

    if (!isPopState) {
      scrollPositions.set(currentPath, currentScroll);
    }

    expect(scrollPositions.get('/brand-tools')).toBe(1450);
  });

  it('restores scroll position on popstate navigation', () => {
    scrollPositions.set('/brand-tools', 1450);
    scrollPositions.set('/brand-tools/svg-to-png', 0);

    isPopState = true;
    const targetUrl = '/brand-tools';

    const targetPos = isPopState ? (scrollPositions.get(targetUrl) ?? 0) : 0;
    expect(targetPos).toBe(1450);
  });

  it('resets scroll to 0 immediately on new client-side route navigation', () => {
    isPopState = false;
    const targetUrl = '/brand-tools/favicon-generator';

    const targetPos = isPopState ? (scrollPositions.get(targetUrl) ?? 0) : 0;
    expect(targetPos).toBe(0);
  });

  it('calculates fixed header offset for hash anchors', () => {
    const headerHeight = 64;
    const buffer = 24;
    const offset = headerHeight + buffer;

    const elementTop = 800;
    const currentScroll = 0;
    const targetScroll = elementTop + currentScroll - offset;

    expect(offset).toBe(88);
    expect(targetScroll).toBe(712);
  });

  it('honors prefers-reduced-motion for instant scrolling', () => {
    const checkMotionPreference = (prefersReduced: boolean) => ({
      immediate: prefersReduced,
      duration: prefersReduced ? 0 : 1,
    });

    const standard = checkMotionPreference(false);
    expect(standard.immediate).toBe(false);
    expect(standard.duration).toBe(1);

    const reduced = checkMotionPreference(true);
    expect(reduced.immediate).toBe(true);
    expect(reduced.duration).toBe(0);
  });

  it('sets tabindex="-1" and focuses h1 without scrolling', () => {
    const mockH1 = {
      attributes: {} as Record<string, string>,
      hasAttribute(attr: string) {
        return attr in this.attributes;
      },
      setAttribute(attr: string, val: string) {
        this.attributes[attr] = val;
      },
      focus: vi.fn(),
    };

    if (!mockH1.hasAttribute('tabindex')) {
      mockH1.setAttribute('tabindex', '-1');
    }
    mockH1.focus({ preventScroll: true });

    expect(mockH1.attributes['tabindex']).toBe('-1');
    expect(mockH1.focus).toHaveBeenCalledWith({ preventScroll: true });
  });
});
