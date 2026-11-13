import { create } from 'zustand';

// eslint-disable-next-line import/prefer-default-export
export const useStore = create((set) => ({
  lenis: undefined,
  setLenis: (lenis) => set({ lenis }),
  introOut: false,
  setIntroOut: (introOut) => set({ introOut }),
  isMenuOpen: false,
  setIsMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  siteReady: false,
  setSiteReady: (siteReady) => set({ siteReady }),
  fluidColor: '#d7d7d4',
  setFluidColor: (fluidColor) => set({ fluidColor }),
  isAbout: false,
  setIsAbout: (isAbout) => set({ isAbout }),
  // When true, the intro loader animation is skipped (non-loader routes)
  skipLoader: false,
  setSkipLoader: (skipLoader) => set({ skipLoader }),
}));
