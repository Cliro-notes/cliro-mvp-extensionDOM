import { useState } from "react";
import { COLORS, OPACITY, SPACING, RADIUS, ANIMATION } from "../../shared/constants/colors.js";

export const SubItem = ({ id, children, onClick, variant = 'dark' }) => {
    const [hovered, setHovered] = useState(false);

    const containerStyle = {
        height: '36px',
        borderRadius: RADIUS.md,
        padding: `0 ${SPACING.md}`,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        background: hovered ? (variant === 'dark' ? OPACITY.dark10 : OPACITY.light10) : 'transparent',
        transition: `background ${ANIMATION.durationFast} ease`,
        color: variant === 'dark' ? COLORS.dark : COLORS.light
    };

    return (
        <div
            data-clickable
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            style={containerStyle}
        >
            {children}
        </div>
    );
};