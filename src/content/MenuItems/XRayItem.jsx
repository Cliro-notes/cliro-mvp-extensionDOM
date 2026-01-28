import { MenuItem } from "./MenuItem";
import { SubItem } from "./SubItem";
import { getIcon } from "./constants.js";
import { COLORS, OPACITY, SPACING, RADIUS, ANIMATION } from "../../shared/constants/colors.js";

export const XRayItem = ({ xrayEnabled, xrayErrorCount, onToggle }) => {
    // El badge de errores solo se muestra si X-ray está habilitado
    const errorBadge = xrayEnabled ? (
        <div style={{
            minWidth: '22px',
            height: '22px',
            borderRadius: '11px',
            background: COLORS.statusAttention,
            color: COLORS.light,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 1.5s infinite'
        }}>
            {xrayErrorCount}
        </div>
    ) : null;

    const toggleStyle = {
        width: '36px',
        height: '18px',
        borderRadius: '9px',
        background: xrayEnabled ? COLORS.dark : COLORS.neutral,
        position: 'relative'
    };

    const toggleHandleStyle = {
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        background: COLORS.light,
        position: 'absolute',
        top: '2px',
        left: xrayEnabled ? '20px' : '2px',
        transition: 'left 0.2s'
    };

    return (
        <MenuItem
            id="xray"
            icon={getIcon("xray")} // Usar getIcon
            label="X-Ray"
            hasSubmenu
            badge={errorBadge}
        >
            <SubItem id="xray-toggle" onClick={onToggle}>
                <div style={{ flex: 1 }}>X-Ray {xrayEnabled ? "ON" : "OFF"}</div>
                <div style={toggleStyle}>
                    <div style={toggleHandleStyle} />
                </div>
            </SubItem>
        </MenuItem>
    );
};