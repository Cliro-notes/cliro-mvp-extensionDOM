import { useState, useRef, useEffect } from 'react';
import LoadingAnimation from '../MenuItems/LoadingAnimation.jsx';
import LabelSubmenu from './LabelSubmenu.jsx';
import { COLORS, OPACITY, SPACING, RADIUS, TYPOGRAPHY, ANIMATION } from '../../shared/constants/colors.js';
import {
    LABEL_MENU_ITEMS,
    rewriteOptions,
    languages,
    getLabelMenuItems,
    getRewriteSubmenuItems,
    getTranslateSubmenuItems,
    getIcon
} from '../MenuItems/constants.js';

export default function LabelMenu({ selectedText, onClose }) {
    const [loading, setLoading] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [response, setResponse] = useState(null);
    const leaveTimerRef = useRef(null);
    const isMouseInSubmenu = useRef(false);

    // Handle AI request
    const handleAction = async (action, payload = null) => {
        setLoading(true);
        console.log("ACTION:", { action, payload, selectedText });
        // const aiResponse = await sendAIRequest(action, payload, selectedText);
        // setResponse(aiResponse);
        await new Promise(r => setTimeout(r, 800)); // Simulate API call
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

    // Handle mouse entering a menu item
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

    // Handle mouse leaving a menu item
    const handleMenuItemLeave = (label, hasSubmenu) => {
        clearLeaveTimer();
        if (hasSubmenu && activeSubmenu === label && !isMouseInSubmenu.current) {
            leaveTimerRef.current = setTimeout(() => {
                setActiveSubmenu(null);
            }, 150);
        }
    };

    // Handle mouse entering submenu area
    const handleSubmenuEnter = (label) => {
        clearLeaveTimer();
        isMouseInSubmenu.current = true;
        setActiveSubmenu(label);
    };

    // Handle mouse leaving submenu area
    const handleSubmenuLeave = () => {
        clearLeaveTimer();
        isMouseInSubmenu.current = false;
        leaveTimerRef.current = setTimeout(() => {
            setActiveSubmenu(null);
        }, 150);
    };

    // Handle click on submenu item
    const handleSubmenuItemClick = (label, item) => {
        // Map the item label to the correct payload based on the submenu type
        let payload = item;

        if (label.toLowerCase() === 'reescribir') {
            // Find the rewrite option by label
            const rewriteOption = rewriteOptions.find(opt => opt.label === item);
            payload = rewriteOption ? rewriteOption.id : item;
        } else if (label.toLowerCase() === 'traducir') {
            // Find the language by code
            const language = languages.find(lang => lang.code === item);
            payload = language ? language.lang : item;
        }

        handleAction(label.toUpperCase(), payload);
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
    };

    // Add CSS hover styles
    useEffect(() => {
        const styleId = 'cliro-menu-hover-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* CSS-only hover for menu items */
            .cliro-menu-item:hover {
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

    // MenuItem component - now using constants
    const MenuItem = ({ item }) => {
        const hasSubmenu = item.type === "submenu";
        const isActive = activeSubmenu === item.label;

        return (
            <div
                style={styles.menuItemContainer}
                onMouseEnter={() => handleMenuItemEnter(item.label, hasSubmenu)}
                onMouseLeave={() => handleMenuItemLeave(item.label, hasSubmenu)}
            >
                <button
                    className={`cliro-menu-item ${isActive ? 'active' : ''}`}
                    style={styles.menuItem}
                    onClick={() => !hasSubmenu && handleAction(item.action)}
                >
                    {item.icon && <span style={{ marginRight: '2px' }}>{getIcon(item.icon)}</span>}
                    {item.label}
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
                    <LabelSubmenu
                        label={item.label}
                        items={item.label === "Reescribir" ? getRewriteSubmenuItems() : getTranslateSubmenuItems()}
                        loading={loading}
                        onItemClick={handleSubmenuItemClick}
                        onMouseEnter={() => handleSubmenuEnter(item.label)}
                        onMouseLeave={handleSubmenuLeave}
                        onSubmenuItemEnter={() => {
                            isMouseInSubmenu.current = true;
                        }}
                        onSubmenuItemLeave={() => {
                            isMouseInSubmenu.current = false;
                        }}
                    />
                )}
            </div>
        );
    };

    if (loading) return <LoadingAnimation />;

    const menuItems = getLabelMenuItems();

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
            {menuItems.map(item => (
                <MenuItem key={item.id} item={item} />
            ))}
        </div>
    );
}