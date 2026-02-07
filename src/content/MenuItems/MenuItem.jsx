import { useState, useRef } from "react";
import { Icon } from "./Icon";
import { getIcon } from "./constants.js";
import { COLORS, OPACITY, SPACING, RADIUS, ANIMATION } from "../../shared/constants/colors.js";

export const MenuItem = ({ id, icon, label, hasSubmenu, badge, onClick, children, variant = 'dark', disabled = false }) => {
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
        cursor: disabled ? 'default' : 'pointer',
        background: hovered && !disabled ? (variant === 'dark' ? OPACITY.dark10 : OPACITY.light10) : 'transparent', // CAMBIA ESTO
        transition: `background ${ANIMATION.durationFast} ease`,
        position: 'relative',
        justifyContent: 'space-between',
        opacity: disabled ? 0.6 : 1
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
        background: variant === 'dark' ? COLORS.light : OPACITY.dark20,
        border: `1px solid ${variant === 'dark' ? OPACITY.dark10 : OPACITY.light10}`,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
    };

    const textStyle = {
        flex: 1,
        color: variant === 'dark' ? COLORS.dark : COLORS.light,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    };

    const chevronStyle = {
        opacity: 0.4,
        color: variant === 'dark' ? COLORS.dark : COLORS.light
    };

    const badgeStyle = {
        fontSize: '10px',
        fontWeight: '500',
        padding: '2px 6px',
        borderRadius: RADIUS.full,
        background: disabled ? OPACITY.neutral20 : (variant === 'dark' ? OPACITY.dark10 : OPACITY.light10), // CAMBIA ESTO
        color: disabled ? COLORS.neutral : (variant === 'dark' ? COLORS.dark : COLORS.light), // CAMBIA ESTO
        opacity: disabled ? 0.5 : 0.7,
        marginLeft: SPACING.xs
    };

    return (
        <div style={{ position: "relative" }}>
            <div
                data-menu-item={id}
                onMouseEnter={!disabled ? handleMouseEnter : undefined} // CAMBIA ESTO
                onMouseLeave={!disabled ? handleMouseLeave : undefined} // CAMBIA ESTO
                onClick={(e) => {
                    e.stopPropagation();
                    if (!hasSubmenu && !disabled) onClick?.(e); // CAMBIA ESTO
                }}
                style={containerStyle}
            >
                {/* Renderizar icono */}
                {typeof icon === 'string' ? (
                    <span style={{
                        color: disabled ? COLORS.neutral : (variant === 'dark' ? COLORS.dark : COLORS.light), // CAMBIA ESTO
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '16px',
                        height: '16px',
                        opacity: disabled ? 0.5 : 1 // AÑADE ESTO
                    }}>
                        {getIcon(icon)}
                    </span>
                ) : (
                    <Icon type={icon} color={disabled ? COLORS.neutral : (variant === 'dark' ? COLORS.dark : COLORS.light)} />
                )}

                <span style={{
                    ...textStyle,
                    color: disabled ? COLORS.neutral : textStyle.color, // AÑADE ESTO
                    opacity: disabled ? 0.7 : 1 // AÑADE ESTO
                }}>{label}</span>

                {/* Badge */}
                {badge && <span style={badgeStyle}>{badge}</span>}

                {hasSubmenu && !disabled && <span style={chevronStyle}>›</span>} {/* CAMBIA ESTO */}
            </div>

            {hasSubmenu && submenuOpen && !disabled && ( // AÑADE !disabled
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