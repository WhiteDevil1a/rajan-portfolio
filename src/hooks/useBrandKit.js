import { useEffect, useState } from 'react';
import {
  DEFAULT_BRAND_KIT,
  EVENT_KEY,
  clearBrandKit,
  hasCustomBrandKit,
  loadBrandKit,
  saveBrandKit,
} from '@src/lib/brandKitStorage';
import { loadGoogleFont } from '@src/constants/brandFonts';

export function useBrandKit() {
  const [brandKit, setBrandKit] = useState(DEFAULT_BRAND_KIT);
  const [isCustom, setIsCustom] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const syncState = () => {
      const current = loadBrandKit();
      setBrandKit(current);
      setIsCustom(hasCustomBrandKit());
      setIsLoaded(true);

      // Preload brand fonts
      if (current.fonts?.heading) loadGoogleFont(current.fonts.heading);
      if (current.fonts?.body) loadGoogleFont(current.fonts.body);
    };

    syncState();

    const handleCustomEvent = (e) => {
      if (e.detail) {
        setBrandKit(e.detail);
        setIsCustom(hasCustomBrandKit());
      }
    };

    window.addEventListener(EVENT_KEY, handleCustomEvent);
    window.addEventListener('storage', syncState);

    return () => {
      window.removeEventListener(EVENT_KEY, handleCustomEvent);
      window.removeEventListener('storage', syncState);
    };
  }, []);

  const save = (updatedKit) => {
    const success = saveBrandKit(updatedKit);
    if (success) {
      setBrandKit(updatedKit);
      setIsCustom(true);
    }
    return success;
  };

  const reset = () => {
    clearBrandKit();
    setBrandKit(DEFAULT_BRAND_KIT);
    setIsCustom(false);
  };

  return {
    brandKit,
    setBrandKit,
    save,
    reset,
    isCustom,
    isLoaded,
    hasPrimaryLogo: Boolean(brandKit?.logos?.primary),
  };
}

export default useBrandKit;
