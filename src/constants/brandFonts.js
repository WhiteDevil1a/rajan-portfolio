export const CURATED_FONTS = [
  { name: 'System', family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', category: 'System' },
  { name: 'Inter', family: '"Inter", sans-serif', category: 'Sans-Serif', google: 'Inter:wght@300;400;500;600;700;800' },
  { name: 'Roboto', family: '"Roboto", sans-serif', category: 'Sans-Serif', google: 'Roboto:wght@300;400;500;700' },
  { name: 'Open Sans', family: '"Open Sans", sans-serif', category: 'Sans-Serif', google: 'Open+Sans:wght@300;400;600;700' },
  { name: 'Lato', family: '"Lato", sans-serif', category: 'Sans-Serif', google: 'Lato:wght@300;400;700' },
  { name: 'Montserrat', family: '"Montserrat", sans-serif', category: 'Sans-Serif', google: 'Montserrat:wght@300;400;500;600;700;800' },
  { name: 'Poppins', family: '"Poppins", sans-serif', category: 'Sans-Serif', google: 'Poppins:wght@300;400;500;600;700' },
  { name: 'Work Sans', family: '"Work Sans", sans-serif', category: 'Sans-Serif', google: 'Work+Sans:wght@300;400;500;600;700' },
  { name: 'Source Sans 3', family: '"Source Sans 3", sans-serif', category: 'Sans-Serif', google: 'Source+Sans+3:wght@300;400;600;700' },
  { name: 'Nunito', family: '"Nunito", sans-serif', category: 'Sans-Serif', google: 'Nunito:wght@300;400;600;700' },
  { name: 'Nunito Sans', family: '"Nunito Sans", sans-serif', category: 'Sans-Serif', google: 'Nunito+Sans:wght@300;400;600;700' },
  { name: 'Raleway', family: '"Raleway", sans-serif', category: 'Sans-Serif', google: 'Raleway:wght@300;400;500;600;700' },
  { name: 'DM Sans', family: '"DM Sans", sans-serif', category: 'Sans-Serif', google: 'DM+Sans:wght@400;500;700' },
  { name: 'Manrope', family: '"Manrope", sans-serif', category: 'Sans-Serif', google: 'Manrope:wght@300;400;500;600;700;800' },
  { name: 'Mulish', family: '"Mulish", sans-serif', category: 'Sans-Serif', google: 'Mulish:wght@300;400;600;700' },
  { name: 'Karla', family: '"Karla", sans-serif', category: 'Sans-Serif', google: 'Karla:wght@300;400;500;700' },
  { name: 'Rubik', family: '"Rubik", sans-serif', category: 'Sans-Serif', google: 'Rubik:wght@300;400;500;700' },
  { name: 'Figtree', family: '"Figtree", sans-serif', category: 'Sans-Serif', google: 'Figtree:wght@300;400;500;600;700' },
  { name: 'Merriweather', family: '"Merriweather", serif', category: 'Serif', google: 'Merriweather:wght@300;400;700' },
  { name: 'Lora', family: '"Lora", serif', category: 'Serif', google: 'Lora:wght@400;500;600;700' },
  { name: 'Playfair Display', family: '"Playfair Display", serif', category: 'Serif', google: 'Playfair+Display:wght@400;600;700;800' },
  { name: 'Source Serif 4', family: '"Source Serif 4", serif', category: 'Serif', google: 'Source+Serif+4:wght@300;400;600;700' },
  { name: 'PT Serif', family: '"PT Serif", serif', category: 'Serif', google: 'PT+Serif:wght@400;700' },
];

export const loadGoogleFont = (fontName) => {
  if (typeof document === 'undefined') return;
  const font = CURATED_FONTS.find((f) => f.name.toLowerCase() === (fontName || '').toLowerCase());
  if (!font || !font.google) return;
  const id = `google-font-${font.name.toLowerCase().replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
  document.head.appendChild(link);
};
