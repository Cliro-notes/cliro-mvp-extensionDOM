import { MenuItem } from "./MenuItem";
import { getIcon } from "./constants.js";

export const TextActionItem = ({ id, icon, label, onClick }) => {
    const iconContent = getIcon(icon);

    return (
        <MenuItem
            id={id}
            icon={iconContent}
            label={label}
            onClick={onClick}
        />
    );
};