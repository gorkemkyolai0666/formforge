import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#FFF5F2',
          100: '#FFE8E1',
          200: '#FFD0C2',
          300: '#FFB09A',
          400: '#FF8A6B',
          500: '#FF6B4A',
          600: '#E85535',
          700: '#C44025',
          800: '#A03018',
          900: '#7C2510',
        },
        arctic: {
          50: '#F8F9FC',
          100: '#F0F2F8',
          200: '#E2E6F0',
          300: '#C8CEE0',
          400: '#9BA5C0',
          500: '#7080A8',
          600: '#566590',
          700: '#3F4D75',
          800: '#2D3A5E',
          900: '#1E2A4A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
