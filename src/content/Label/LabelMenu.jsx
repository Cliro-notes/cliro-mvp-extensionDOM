import { useState, useRef, useEffect } from 'react';
import LoadingAnimation from '../MenuItems/LoadingAnimation.jsx';
import { COLORS, OPACITY, SPACING, RADIUS, TYPOGRAPHY, ANIMATION } from '../../shared/constants/colors.js';

export default function LabelMenu({ selectedText, onClose }) {
    const [loading, setLoading] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const leaveTimerRef = useRef(null);
    const isMouseInSubmenu = useRef(false);

    const handleAction = async (action, payload = null) => {
        setLoading(true);
        console.log('[LabelMenu]', { action, payload, selectedText });
        await new Promise(r => setTimeout(r, 800));
        setLoading(false);
        setActiveSubmenu(null);
        if (onClose) onClose();
    };

    // Clear any pending timeout
    const clearLeaveTimer = () => {
        if (leaveTimerRef.current) {
            clearTimeout(leaveTimerRef.current);
            leaveTimerRef.current = null;
        }
    };

    // Close submenu immediately when entering a regular menu item
    const handleMenuItemEnter = (label, hasSubmenu) => {
        clearLeaveTimer();
        isMouseInSubmenu.current = false;
        if (hasSubmenu) {
            setActiveSubmenu(label);
        } else {
            // Close any open submenu when hovering over a regular menu item
            setActiveSubmenu(null);
        }
    };

    // Only start closing timer when leaving menu items with submenus
    const handleMenuItemLeave = (label, hasSubmenu) => {
        clearLeaveTimer();
        if (hasSubmenu && activeSubmenu === label && !isMouseInSubmenu.current) {
            leaveTimerRef.current = setTimeout(() => {
                setActiveSubmenu(null);
            }, 150);
        }
    };

    const handleSubmenuEnter = (label) => {
        clearLeaveTimer();
        isMouseInSubmenu.current = true;
        setActiveSubmenu(label);
    };

    const handleSubmenuLeave = () => {
        clearLeaveTimer();
        isMouseInSubmenu.current = false;
        leaveTimerRef.current = setTimeout(() => {
            setActiveSubmenu(null);
        }, 150);
    };

    // Handle click on submenu item - don't immediately close
    const handleSubmenuItemClick = (label, item) => {
        handleAction(label.toUpperCase(), item);
        // Don't setActiveSubmenu(null) here - let it stay open during loading
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => clearLeaveTimer();
    }, []);

    const styles = {
        menu: {
            display: 'flex',
            alignItems: 'stretch',
            height: '32px',
            padding: `0 ${SPACING.xs}`,
            fontFamily: TYPOGRAPHY.fontSans,
            fontSize: TYPOGRAPHY.fontSizeXs,
            position: 'relative',
        },

        menuItemContainer: {
            position: 'relative',
            height: '100%',
        },

        menuItem: {
            height: '100%',
            padding: `0 ${SPACING.sm}`,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            color: COLORS.dark,
            whiteSpace: 'nowrap',
            userSelect: 'none',
            transition: `all ${ANIMATION.durationFast} ${ANIMATION.transitionSmooth}`,
            borderRadius: RADIUS.sm,
            position: 'relative',
        },

        chevron: {
            fontSize: '10px',
            opacity: 0.6,
            transition: `transform ${ANIMATION.durationFast} ${ANIMATION.transitionSmooth}`,
        },

        chevronActive: {
            transform: 'rotate(90deg)',
        },

        /* SUBMENU STYLES */
        submenuContainer: {
            position: 'absolute',
            bottom: 'calc(95%)', // Position directly above with small gap
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
        },

        // Keep submenu visible during loading
        submenuLoading: {
            opacity: 0.7,
            pointerEvents: 'none',
        },
    };

    // Add animations and CSS hover styles
    useEffect(() => {
        const styleId = 'cliro-menu-hover-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-4px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* CSS-only hover for menu items */
            .cliro-menu-item:hover {
                background: ${OPACITY.dark10} !important;
            }
            
            /* CSS-only hover for submenu items */
            .cliro-submenu-item:hover {
                background: ${OPACITY.dark10} !important;
            }
            
            /* Active menu item with submenu */
            .cliro-menu-item.active {
                background: ${OPACITY.dark10} !important;
            }
        `;
        document.head.appendChild(style);

        return () => document.getElementById(styleId)?.remove();
    }, []);

    const MenuItem = ({ label, submenuItems }) => {
        const hasSubmenu = !!submenuItems;
        const isActive = activeSubmenu === label;

        return (
            <div
                style={styles.menuItemContainer}
                onMouseEnter={() => handleMenuItemEnter(label, hasSubmenu)}
                onMouseLeave={() => handleMenuItemLeave(label, hasSubmenu)}
            >
                <button
                    className={`cliro-menu-item ${isActive ? 'active' : ''}`}
                    style={styles.menuItem}
                    onClick={() => !hasSubmenu && handleAction(label.toUpperCase())}
                >
                    {label}
                    {hasSubmenu && (
                        <span style={{
                            ...styles.chevron,
                            ...(isActive ? styles.chevronActive : {})
                        }}>
                            ›
                        </span>
                    )}
                </button>

                {hasSubmenu && isActive && (
                    <div
                        className="cliro-submenu-container"
                        style={{
                            ...styles.submenuContainer,
                            ...(loading ? styles.submenuLoading : {})
                        }}
                        onMouseEnter={() => handleSubmenuEnter(label)}
                        onMouseLeave={handleSubmenuLeave}
                    >
                        <div style={styles.submenu}>
                            {submenuItems.map(item => (
                                <div
                                    key={item}
                                    className="cliro-submenu-item"
                                    style={styles.submenuItem}
                                    onClick={() => handleSubmenuItemClick(label, item)}
                                    onMouseEnter={() => {
                                        isMouseInSubmenu.current = true;
                                    }}
                                    onMouseLeave={() => {
                                        isMouseInSubmenu.current = false;
                                    }}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (loading) return <LoadingAnimation />;

    return (
        <div
            style={styles.menu}
            onMouseLeave={() => {
                clearLeaveTimer();
                if (!isMouseInSubmenu.current) {
                    setActiveSubmenu(null);
                }
            }}
        >
            <MenuItem label="Explain" />
            <MenuItem label="Summarize" />
            <MenuItem
                label="Rewrite"
                submenuItems={['Shorter', 'Formal', 'Casual', 'Simplify']}
            />
            <MenuItem
                label="Translate"
                submenuItems={['EN', 'ES', 'FR', 'DE']}
            />
        </div>
    );
}