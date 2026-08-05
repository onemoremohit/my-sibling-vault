/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- Primary (Terracotta / Warm Red) ---
        primary:                  '#a33d25',
        'on-primary':             '#ffffff',
        'primary-container':      '#ff8264',
        'on-primary-container':   '#731b06',
        'primary-fixed':          '#ffdad2',
        'primary-fixed-dim':      '#ffb4a3',
        'on-primary-fixed':       '#3d0700',
        'inverse-primary':        '#ffb4a3',

        // --- Secondary (Violet / Indigo) ---
        secondary:                '#5b3cdd',
        'on-secondary':           '#ffffff',
        'secondary-container':    '#7459f7',
        'on-secondary-container': '#fffbff',
        'secondary-fixed':        '#e5deff',
        'secondary-fixed-dim':    '#c9bfff',
        'on-secondary-fixed':     '#1a0063',

        // --- Tertiary (Green) ---
        tertiary:                 '#006d37',
        'on-tertiary':            '#ffffff',
        'tertiary-container':     '#13bf66',
        'on-tertiary-container':  '#004621',
        'tertiary-fixed':         '#6bfe9c',
        'tertiary-fixed-dim':     '#4ae183',
        'on-tertiary-fixed':      '#00210c',

        // --- Surfaces ---
        surface:                      '#fef8f4',
        'surface-bright':             '#fef8f4',
        'surface-dim':                '#ded9d5',
        'surface-variant':            '#e7e1de',
        'surface-container-lowest':   '#ffffff',
        'surface-container-low':      '#f8f2ef',
        'surface-container':          '#f3ede9',
        'surface-container-high':     '#ede7e3',
        'surface-container-highest':  '#e7e1de',
        'inverse-surface':            '#32302e',
        'inverse-on-surface':         '#f5f0ec',

        // --- On-surface ---
        'on-surface':         '#1d1b19',
        'on-surface-variant': '#57423d',
        background:           '#fef8f4',
        'on-background':      '#1d1b19',

        // --- Outline ---
        outline:         '#8a716c',
        'outline-variant':'#dec0b9',

        // --- Error ---
        error:             '#ba1a1a',
        'on-error':        '#ffffff',
        'error-container': '#ffdad6',
      },
      fontFamily: {
        display: ['Literata', 'Georgia', 'serif'],
        body:    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg':     ['48px', { lineHeight: '56px', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-mobile': ['32px', { lineHeight: '40px', fontWeight: '700', letterSpacing: '-0.01em' }],
        'headline-md':    ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg':        ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md':        ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-bold':     ['14px', { lineHeight: '20px', fontWeight: '700' }],
        caption:          ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
      spacing: {
        xs:             '4px',
        sm:             '12px',
        md:             '24px',
        lg:             '48px',
        xl:             '80px',
        gutter:         '24px',
        'container-max':'1200px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
      boxShadow: {
        'soft-memory':       '0 10px 25px -5px rgba(163,61,37,0.10), 0 8px 10px -6px rgba(163,61,37,0.05)',
        'soft-memory-hover': '0 4px 6px -1px rgba(163,61,37,0.10), 0 2px 4px -1px rgba(163,61,37,0.05)',
        'card':              '0 4px 20px -2px rgba(163,61,37,0.10)',
        'card-hover':        '0 2px 10px -2px rgba(163,61,37,0.10)',
        'nav':               '0 1px 4px rgba(0,0,0,0.06)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        smooth: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':      'float 3s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
};
