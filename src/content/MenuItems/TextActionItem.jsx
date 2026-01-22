import { MenuItem } from "./MenuItem";

export const TextActionItem = ({ id, icon, label, onClick }) => {
    return (
        <MenuItem
            id={id}
            icon={icon}
            label={label}
            onClick={onClick}
        />
    );
};