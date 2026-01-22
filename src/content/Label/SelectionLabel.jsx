// SelectionLabel.jsx
import { useState, useRef } from 'react';
import { COLORS, OPACITY, SPACING, RADIUS, TYPOGRAPHY, ANIMATION } from '../../shared/constants/colors.js';
import LabelMenu from './LabelMenu.jsx';

export default function SelectionLabel({ x, y, originalText }) {
    const [open, setOpen] = useState(false);
    const lockRef = useRef(false);
    const openTimer = useRef(null);
    const closeTimer = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(closeTimer.current);
        openTimer.current = setTimeout(() => {
            if (!lockRef.current) setOpen(true);
        }, 200);
    };

    const handleMouseLeave = () => {
        clearTimeout(openTimer.current);
        closeTimer.current = setTimeout(() => {
            if (!lockRef.current) setOpen(false);
        }, 350);
    };

    const styles = {
        wrapper: {
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 'var(--z-overlay)',
            pointerEvents: 'auto',
            fontFamily: TYPOGRAPHY.fontSans,
        },

        container: {
            display: 'inline-flex',
            alignItems: 'center',
            background: COLORS.light,
            borderRadius: RADIUS.md,
            boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
            padding: SPACING.xs,
            whiteSpace: 'nowrap',
        },

        label: {
            position: 'relative',
            padding: `${SPACING.xs} ${SPACING.sm}`,
            fontSize: TYPOGRAPHY.fontSizeSm,
            opacity: open ? 0 : 1,
            transform: open ? 'translateX(-6px)' : 'translateX(0)',
            transition: `all ${ANIMATION.durationSlow} ${ANIMATION.transitionSmooth}`,
        },

        triangle: {
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `6px solid ${COLORS.light}`,
        },

        menuWrapper: {
            overflow: 'hidden',
            maxWidth: open ? '420px' : '0px',
            transition: `max-width ${ANIMATION.durationSlow} ${ANIMATION.transitionSmooth}`,
        },
    };

    return (
        <div
            style={styles.wrapper}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div style={styles.container}>
                <div style={styles.label}>
                    Abrir Cliro
                    <div style={styles.triangle} />
                </div>

                <div style={styles.menuWrapper}>
                    <LabelMenu originalText={originalText} />
                </div>
            </div>
        </div>
    );
}
