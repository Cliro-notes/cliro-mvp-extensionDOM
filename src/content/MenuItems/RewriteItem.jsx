import { MenuItem } from "./MenuItem";
import { SubItem } from "./SubItem";
import { rewriteOptions } from "./constants";

export const RewriteItem = ({ hasText, onOptionClick }) => {
    const label = hasText ? "Reescribir" : "Reescribir Todo";

    return (
        <MenuItem
            id="rewrite"
            icon="rewrite"
            label={label}
            hasSubmenu
        >
            <div style={{ padding: "8px 0" }}>
                <div style={{ padding: "8px 12px", opacity: 0.6, fontSize: 12 }}>
                    {hasText ? "Reescribir opciones:" : "Reescribir opciones:"}
                </div>
                {rewriteOptions.map((option) => (
                    <SubItem
                        key={option.id}
                        id={`rewrite-${option.id}`}
                        onClick={() => onOptionClick?.(option)}
                    >
                        {option.label}
                    </SubItem>
                ))}
            </div>
        </MenuItem>
    );
};