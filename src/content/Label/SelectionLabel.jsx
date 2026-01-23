import { useState, useRef, useEffect, useCallback } from 'react';
import { COLORS, OPACITY, SPACING, RADIUS, TYPOGRAPHY, ANIMATION } from '../../shared/constants/colors.js';
import LabelMenu from './LabelMenu.jsx';

export default function SelectionLabel({ x, y, selectedText }) {
    const [open, setOpen] = useState(false);
    const openTimer = useRef(null);
    const closeTimer = useRef(null);
    const containerRef = useRef(null);
    const isHovered = useRef(false);

    /* ---------- CSS RESET ---------- */
    useEffect(() => {
        const styleId = 'cliro-selection-label-reset';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .cliro-selection-label {
                font-family: ${TYPOGRAPHY.fontSans} !important;
                font-size: ${TYPOGRAPHY.fontSizeXs} !important;
                color: ${COLORS.dark} !important;
                line-height: 1 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                background: none !important;
            }
            .cliro-selection-label * {
                box-sizing: border-box !important;
                font-family: inherit !important;
            }
        `;
        document.head.appendChild(style);

        return () => document.getElementById(styleId)?.remove();
    }, []);

    /* ---------- Click outside ---------- */
    useEffect(() => {
        const onClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                clearTimeout(openTimer.current);
                clearTimeout(closeTimer.current);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    /* ---------- Hover logic ---------- */
    const handleMouseEnter = useCallback(() => {
        isHovered.current = true;
        clearTimeout(closeTimer.current);
        openTimer.current = setTimeout(() => {
            if (isHovered.current) {
                setOpen(true);
            }
        }, 180);
    }, []);

    const handleMouseLeave = useCallback(() => {
        isHovered.current = false;
        clearTimeout(openTimer.current);
        closeTimer.current = setTimeout(() => {
            if (!isHovered.current) {
                setOpen(false);
            }
        }, 300);
    }, []);

    /* ---------- Cleanup timers ---------- */
    useEffect(() => {
        return () => {
            clearTimeout(openTimer.current);
            clearTimeout(closeTimer.current);
        };
    }, []);

    const styles = {
        wrapper: {
            position: 'fixed',
            left: `${x}px`,
            top: `${y}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 2147483647,
            pointerEvents: 'auto',
        },

        container: {
            display: 'flex',
            alignItems: 'center',
            background: COLORS.light,
            borderRadius: RADIUS.lg,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            overflow: 'visible',
            height: '32px',
            transition: `all ${ANIMATION.durationNormal} ${ANIMATION.transitionSmooth}`,
            minWidth: '32px',
            width: open ? 'auto' : '32px',
        },

        labelContainer: {
            padding: `${SPACING.xs} ${SPACING.sm}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '32px',
            minHeight: '32px',
            background: open ? OPACITY.dark10 : 'transparent',
            transition: `background ${ANIMATION.durationNormal} ${ANIMATION.transitionSmooth}`,
            borderRadius: RADIUS.lg,
        },

        label: {
            width: '16px',
            height: '16px',
            opacity: open ? 0.6 : 1,
            transform: open ? 'scale(0.9)' : 'scale(1)',
            transition: `all ${ANIMATION.durationSlow} ${ANIMATION.transitionSmooth}`,
        },

        icon: {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
        },

        menuWrapper: {
            display: 'flex',
            alignItems: 'center',
            height: '32px',
            overflow: 'visible',
            animation: `${ANIMATION.durationFast} ${ANIMATION.transitionSmooth} fadeIn`,
        },
    };

    // Add fade-in animation for the menu
    useEffect(() => {
        const styleId = 'cliro-menu-animation';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateX(-8px); }
                to { opacity: 1; transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);

        return () => document.getElementById(styleId)?.remove();
    }, []);

    return (
        <div
            ref={containerRef}
            className="cliro-selection-label"
            style={styles.wrapper}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div style={styles.container}>
                {/* MENU & LABEL (conditionally rendered when open) */}
                {open ? (
                    <div style={styles.menuWrapper}>
                        <LabelMenu
                            selectedText={selectedText}
                            onClose={() => setOpen(false)}
                        />
                    </div>
                ) : (
                    <div style={styles.labelContainer}>
                        <div style={styles.label}>
                            <img
                                src={chrome.runtime?.getURL?.('/icons/confusedCliro.png') || '/icons/confusedCliro.png'}
                                alt="Cliro"
                                style={styles.icon}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}