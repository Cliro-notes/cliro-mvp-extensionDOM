import { useState, useRef } from "react";
import { Icon } from "./Icon";
import { getIcon } from "./constants.js"; // AÑADIR ESTA IMPORTACIÓN
import { COLORS, OPACITY, SPACING, RADIUS, ANIMATION } from "../../shared/constants/colors.js";

export const MenuItem = ({ id, icon, label, hasSubmenu, badge, onClick, children, variant = 'dark' }) => {
    const [hovered, setHovered] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const subRef = useRef();

    const handleMouseEnter = () => {
        setHovered(true);
        if (hasSubmenu) {
            setSubmenuOpen(true);
        }
    };

    const handleMouseLeave = () => {
        setHovered(false);
        if (hasSubmenu) {
            setTimeout(() => {
                const hoveredSub = document.querySelector(`[data-submenu="${id}"]:hover`);
                const hoveredItem = document.querySelector(`[data-menu-item="${id}"]:hover`);
                if (!hoveredSub && !hoveredItem) {
                    setSubmenuOpen(false);
                }
            }, 100);
        }
    };

    const handleSubmenuMouseEnter = () => setSubmenuOpen(true);
    const handleSubmenuMouseLeave = () => {
        setTimeout(() => {
            const hoveredSub = document.querySelector(`[data-submenu="${id}"]:hover`);
            const hoveredItem = document.querySelector(`[data-menu-item="${id}"]:hover`);
            if (!hoveredSub && !hoveredItem) {
                setSubmenuOpen(false);
            }
        }, 100);
    };

    const containerStyle = {
        height: '42px',
        borderRadius: RADIUS.md,
        padding: `0 ${SPACING.md}`,
        display: 'flex',
        alignItems: 'center',
        gap: SPACING.sm,
        cursor: 'pointer',
        background: hovered ? (variant === 'dark' ? OPACITY.dark10 : OPACITY.light10) : 'transparent',
        transition: `background ${ANIMATION.durationFast} ease`,
        position: 'relative'
    };

    const submenuStyle = {
        position: 'absolute',
        left: '100%',
        top: 0,
        marginLeft: SPACING.sm,
        padding: SPACING.sm,
        minWidth: '160px',
        borderRadius: RADIUS.lg,
        backdropFilter: 'blur(20px)',
        zIndex: 1000,
        background: variant === 'dark' ? 'rgba(255,255,255,0.95)' : OPACITY.dark20,
        border: `1px solid ${variant === 'dark' ? OPACITY.dark10 : OPACITY.light10}`,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
    };

    const textStyle = {
        flex: 1,
        color: variant === 'dark' ? COLORS.dark : COLORS.light
    };

    const chevronStyle = {
        opacity: 0.4,
        color: variant === 'dark' ? COLORS.dark : COLORS.light
    };

    return (
        <div style={{ position: "relative" }}>
            <div
                data-menu-item={id}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!hasSubmenu) onClick?.(e);
                }}
                style={containerStyle}
            >
                {/* Renderizar icono */}
                {typeof icon === 'string' ? (
                    <span style={{
                        color: variant === 'dark' ? COLORS.dark : COLORS.light,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '16px',
                        height: '16px'
                    }}>
                        {getIcon(icon)} {/* Ahora getIcon está definido */}
                    </span>
                ) : (
                    <Icon type={icon} color={variant === 'dark' ? COLORS.dark : COLORS.light} />
                )}
                <span style={textStyle}>{label}</span>
                {badge}
                {hasSubmenu && <span style={chevronStyle}>›</span>}
            </div>

            {hasSubmenu && submenuOpen && (
                <div
                    ref={subRef}
                    data-submenu={id}
                    onMouseEnter={handleSubmenuMouseEnter}
                    onMouseLeave={handleSubmenuMouseLeave}
                    style={submenuStyle}
                >
                    {children}
                </div>
            )}
        </div>
    );
};