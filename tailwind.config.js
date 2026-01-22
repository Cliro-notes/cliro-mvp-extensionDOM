import { COLORS } from './src/shared/constants/colors.js';

export default {
  content: [
    './index.html',
    './src/popup/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Map COLORS JS to Tailwind
        dark: COLORS.dark,
        neutral: COLORS.neutral,
        light: COLORS.light,
        'status-good': COLORS.statusGood,
        'status-warning': COLORS.statusWarning,
        'status-attention': COLORS.statusAttention,
      },
    },
  },
  plugins: [],
}