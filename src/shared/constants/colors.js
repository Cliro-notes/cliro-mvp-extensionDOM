export const COLORS = {
    // Main colors
    dark: '#0d0906',
    neutral: '#7D7D7D',
    light: '#ffffff',
    
    // Status colors
    statusGood: '#10b981',
    statusWarning: '#f59e0b',
    statusAttention: '#ef4444',
};

export const OPACITY = {
    neutral10: 'rgba(125, 125, 125, 0.1)',
    neutral20: 'rgba(125, 125, 125, 0.2)',
    neutral30: 'rgba(125, 125, 125, 0.3)',
    dark10: 'rgba(13, 9, 6, 0.1)',
    dark20: 'rgba(13, 9, 6, 0.2)',
    dark30: 'rgba(13, 9, 6, 0.3)',
    light10: 'rgba(255, 255, 255, 0.1)',
    light20: 'rgba(255, 255, 255, 0.2)',
    light50: 'rgba(255, 255, 255, 0.5)',
};

export const SPACING = {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
};

export const RADIUS = {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '18px',
};

export const TYPOGRAPHY = {
    fontSans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSizeXs: '11px',
    fontSizeSm: '12px',
    fontSizeMd: '13px',
    fontSizeLg: '14px',
    fontSizeXl: '16px',
};

export const ANIMATION = {
    transitionSmooth: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    durationFast: '150ms',
    durationNormal: '250ms',
    durationSlow: '350ms',
};

export const SHADOWS = {
    sm: '0 2px 4px rgba(0, 0, 0, 0.08)',
    md: '0 4px 12px rgba(0, 0, 0, 0.12)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.16)',
};

// Helper function to create CSS variables
export const injectCssVariables = () => {
    if (document.querySelector('#cliro-css-variables')) return;
    
    const style = document.createElement('style');
    style.id = 'cliro-css-variables';
    style.textContent = `
        :root {
            /* Colors */
            --color-dark: ${COLORS.dark};
            --color-neutral: ${COLORS.neutral};
            --color-light: ${COLORS.light};
            --color-status-good: ${COLORS.statusGood};
            --color-status-warning: ${COLORS.statusWarning};
            --color-status-attention: ${COLORS.statusAttention};
            
            /* Opacity */
            --color-dark-opacity-10: ${OPACITY.dark10};
            --color-dark-opacity-20: ${OPACITY.dark20};
            --color-dark-opacity-30: ${OPACITY.dark30};
            --color-neutral-opacity-10: ${OPACITY.neutral10};
            --color-neutral-opacity-20: ${OPACITY.neutral20};
            --color-neutral-opacity-30: ${OPACITY.neutral30};
            --color-light-opacity-10: ${OPACITY.light10};
            --color-light-opacity-20: ${OPACITY.light20};
            --color-light-opacity-50: ${OPACITY.light50};
            
            /* Spacing */
            --spacing-xs: ${SPACING.xs};
            --spacing-sm: ${SPACING.sm};
            --spacing-md: ${SPACING.md};
            --spacing-lg: ${SPACING.lg};
            --spacing-xl: ${SPACING.xl};
            
            /* Border radius */
            --radius-sm: ${RADIUS.sm};
            --radius-md: ${RADIUS.md};
            --radius-lg: ${RADIUS.lg};
            --radius-xl: ${RADIUS.xl};
            
            /* Typography */
            --font-sans: ${TYPOGRAPHY.fontSans};
            --font-size-xs: ${TYPOGRAPHY.fontSizeXs};
            --font-size-sm: ${TYPOGRAPHY.fontSizeSm};
            --font-size-md: ${TYPOGRAPHY.fontSizeMd};
            --font-size-lg: ${TYPOGRAPHY.fontSizeLg};
            --font-size-xl: ${TYPOGRAPHY.fontSizeXl};
            
            /* Animation */
            --transition-smooth: ${ANIMATION.transitionSmooth};
            --duration-fast: ${ANIMATION.durationFast};
            --duration-normal: ${ANIMATION.durationNormal};
            --duration-slow: ${ANIMATION.durationSlow};
            
            /* Shadows */
            --shadow-sm: ${SHADOWS.sm};
            --shadow-md: ${SHADOWS.md};
            --shadow-lg: ${SHADOWS.lg};
            
            /* Z-index */
            --z-overlay: 2147483647;
            --z-highlight: 2147483646;
            --z-dropdown: 1000;
        }
    `;
    document.head.appendChild(style);
};