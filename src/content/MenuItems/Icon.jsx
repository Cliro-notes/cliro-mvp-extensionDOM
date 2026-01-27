import { getIcon } from "./constants.js";

export const Icon = ({ type, color = '#000', size = 16 }) => {
    const iconChar = getIcon(type);

    return (
        <span style={{
            fontSize: size,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: size,
            height: size,
            lineHeight: 1
        }}>
            {iconChar}
        </span>
    );
};