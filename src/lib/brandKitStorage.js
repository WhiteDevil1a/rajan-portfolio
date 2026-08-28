/**
 * Centralized Brand Kit Storage Service.
 * Uses browser localStorage with automatic reactive sync across components.
 * 100% client-side privacy, zero server uploads.
 */

export const STORAGE_KEY = 'rajan_brand_kit_v1';
export const EVENT_KEY = 'brandkit:updated';

export const DEFAULT_BRAND_KIT = {
  brandName: 'Rajan Bhatta',
  tagline: 'Brand Design, Visual Identity & Creative Strategy',
  website: 'https://rajanbhatta.com.np',
  email: 'hi@rajanbhatta.com.np',
  phone: '+977 9800000000',
  address: 'Kathmandu, Nepal',
  personality: 'Minimal, Bold, Intentional, Modern, Strategic',
  voiceTone: 'Clear, authoritative, thoughtful, professional yet approachable',
  wordsToUse: 'Identity, Systems, Purposeful, Crafted, Strategy, Distinctive',
  wordsToAvoid: 'Cheap, Generic, Cluttered, Temporary, Trend-chasing',
  logos: {
    primary: '',
    darkPrimary: '',
    icon: '',
    darkIcon: '',
    alternate1: '',
    alternate2: '',
  },
  colors: {
    primary: '#FF2828',
    secondary: '#28282B',
    accent: '#F2FFBD',
    accent2: '#F0F4F1',
    accent3: '#8A2BE2',
    accent4: '#3AA0FF',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  lastSaved: null,
};

/**
 * Loads the Brand Kit from localStorage.
 */
export const loadBrandKit = () => {
  if (typeof window === 'undefined') return DEFAULT_BRAND_KIT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BRAND_KIT;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_BRAND_KIT,
      ...parsed,
      logos: { ...DEFAULT_BRAND_KIT.logos, ...(parsed.logos || {}) },
      colors: { ...DEFAULT_BRAND_KIT.colors, ...(parsed.colors || {}) },
      fonts: { ...DEFAULT_BRAND_KIT.fonts, ...(parsed.fonts || {}) },
    };
  } catch (err) {
    console.error('Failed to load Brand Kit from storage:', err);
    return DEFAULT_BRAND_KIT;
  }
};

/**
 * Checks if user has explicitly saved a customized kit.
 */
export const hasCustomBrandKit = () => {
  if (typeof window === 'undefined') return false;
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
};

/**
 * Saves the Brand Kit to localStorage and notifies active listeners.
 */
export const saveBrandKit = (kitData) => {
  if (typeof window === 'undefined') return false;
  try {
    const payload = {
      ...kitData,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: payload }));
    return true;
  } catch (err) {
    console.error('Failed to save Brand Kit:', err);
    return false;
  }
};

/**
 * Clears the stored Brand Kit.
 */
export const clearBrandKit = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: DEFAULT_BRAND_KIT }));
  } catch (err) {
    console.error('Failed to clear Brand Kit:', err);
  }
};

/**
 * Exports the complete Brand Kit as a formatted JSON file download.
 */
export const exportBrandKitJSON = (kitData) => {
  const data = kitData || loadBrandKit();
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  const safeName = (data.brandName || 'brand-kit').toLowerCase().replace(/[^a-z0-9]/g, '-');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `${safeName}-brand-kit.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

/**
 * Imports a JSON file into Brand Kit format.
 */
export const importBrandKitJSON = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON format.');
        }
        const validatedKit = {
          ...DEFAULT_BRAND_KIT,
          ...parsed,
          logos: { ...DEFAULT_BRAND_KIT.logos, ...(parsed.logos || {}) },
          colors: { ...DEFAULT_BRAND_KIT.colors, ...(parsed.colors || {}) },
          fonts: { ...DEFAULT_BRAND_KIT.fonts, ...(parsed.fonts || {}) },
        };
        saveBrandKit(validatedKit);
        resolve(validatedKit);
      } catch (err) {
        reject(new Error('Could not parse Brand Kit JSON file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });

/**
 * Generates CSS Variables string for designers and developers.
 */
export const generateCSSVariables = (kitData) => {
  const kit = kitData || loadBrandKit();
  const { colors, fonts } = kit;
  return `:root {
  /* Brand Colors */
  --brand-primary: ${colors.primary || '#FF2828'};
  --brand-secondary: ${colors.secondary || '#28282B'};
  --brand-accent: ${colors.accent || '#F2FFBD'};
  --brand-accent-2: ${colors.accent2 || '#F0F4F1'};
  --brand-accent-3: ${colors.accent3 || '#8A2BE2'};
  --brand-accent-4: ${colors.accent4 || '#3AA0FF'};

  /* Typography */
  --brand-heading-font: '${fonts.heading || 'Inter'}', sans-serif;
  --brand-body-font: '${fonts.body || 'Inter'}', sans-serif;
}`;
};

/**
 * Downscales an uploaded image to prevent localStorage quota exhaustion.
 */
export const optimizeImageUpload = (file, maxDimension = 600) =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file'));
      return;
    }

    // If SVG, read as dataURL directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP/PNG data URL
        const dataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/webp', 0.9);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
