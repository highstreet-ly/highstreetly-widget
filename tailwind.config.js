const production = !process.env.ROLLUP_WATCH;
const colors = require('tailwindcss/colors');

module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
  darkMode: false, // or 'media' or 'class'
  important: true,
  theme: {
    screens: {
      'sm': '576px',
      'md': '768px',
      'lg': '992px',
      'xl': '1200px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      orange: {
        light: '#F18700',
        DEFAULT: '#F18700',
        dark: '#F18700',
      },
      overlay: {
        light: 'rgba(0, 0, 0, 0.4)',
        DEFAULT: 'rgba(0, 0, 0, 0.7)',
        dark: 'rgba(0, 0, 0, 0.9)',
      }
    },
    spacing: {
      '0': '0px',
      'px': '1px',
      '0.5': 	'2px',
      '1': '4px',
      '1.5': '6px',
      2: '8px',
      '2.5': '10px',
      3: '12px',
      '3.5': '14px',
      4: '16px',
      5: '	20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '36px',
      10: '40px',
      11: '44px',
      12: '48px',
      14: '56px',
      16: '64px',
      20: '80px',
      24: '96px',
      28: '112px',
      32: '128px',
      36: '144px',
      40: '160px',
      44: '176px',
      48: '192px',
      52: '208px',
      56: '224px',
      60: '240px',
      64: '256px',
      72: '288px',
      80: '320px',
      96: '384px'
    }
  },
  variants: {
    extend: {},
  },
  purge: {
    content: [
     "./src/**/*.svelte",

    ],
    enabled: production // disable purge in dev
  },
};