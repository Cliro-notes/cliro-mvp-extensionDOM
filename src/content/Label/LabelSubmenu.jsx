import { useEffect } from 'react';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ANIMATION } from '../../shared/constants/colors.js';

export function LabelSubmenu({
    label,
    items,
    loading,
    onItemClick,
    onMouseEnter,
    onMouseLeave,
    onSubmenuItemEnter,
    onSubmenuItemLeave
}) {

    // Add submenu animations
    useEffect(() => {
        const styleId = 'cliro-submenu-animations';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-4px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* CSS-only hover for submenu items */
            .cliro-submenu-item:hover {
                background: rgba(0, 0, 0, 0.1) !important;
            }
        `;
        document.head.appendChild(style);

        return () => document.getElementById(styleId)?.remove();
    }, []);

    const styles = {
        submenuContainer: {
            position: 'absolute',
            bottom: 'calc(95%)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2147483648,
            pointerEvents: 'auto',
        },

        submenu: {
            background: COLORS.light,
            borderRadius: RADIUS.md,
            padding: `${SPACING.xs} ${SPACING.sm}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'row',
            gap: SPACING.xs,
            whiteSpace: 'nowrap',
            animation: `${ANIMATION.durationFast} ${ANIMATION.transitionSmooth} slideDown`,
        },

        submenuItem: {
            padding: `${SPACING.xs} ${SPACING.sm}`,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            transition: `background ${ANIMATION.durationFast} ${ANIMATION.transitionSmooth}`,
            borderRadius: RADIUS.sm,
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: TYPOGRAPHY.fontSans,
            fontSize: TYPOGRAPHY.fontSizeXs,
            color: COLORS.dark,
        },

        // Keep submenu visible during loading
        submenuLoading: {
            opacity: 0.7,
            pointerEvents: 'none',
        },
    };

    return (
        <div
            className="cliro-submenu-container"
            style={{
                ...styles.submenuContainer,
                ...(loading ? styles.submenuLoading : {})
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div style={styles.submenu}>
                {items.map(item => (
                    <div
                        key={item}
                        className="cliro-submenu-item"
                        style={styles.submenuItem}
                        onClick={() => onItemClick(label, item)}
                        onMouseEnter={onSubmenuItemEnter}
                        onMouseLeave={onSubmenuItemLeave}
                    >
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}