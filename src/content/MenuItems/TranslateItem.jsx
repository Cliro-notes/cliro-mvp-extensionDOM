import { MenuItem } from "./MenuItem";
import { SubItem } from "./SubItem";
import { languages, getIcon } from "./constants.js";
import { BUBBLE_MENU_ITEMS } from "./constants.js";

export const TranslateItem = ({ hasText, onLanguageClick }) => {
    const label = BUBBLE_MENU_ITEMS.translate.label(hasText);

    return (
        <MenuItem
            id="translate"
            icon={getIcon("translate")} // Usar getIcon
            label={label}
            hasSubmenu
        >
            <div style={{ padding: "8px 0" }}>
                <div style={{ padding: "8px 12px", opacity: 0.6, fontSize: 12 }}>Idiomas:</div>
                {languages.map((lang) => (
                    <SubItem
                        key={lang.lang}
                        id={`translate-${lang.lang}`}
                        onClick={() => onLanguageClick?.(lang.code)} // Pasar solo el código
                    >
                        <span style={{ flex: 1 }}>{lang.name}</span>
                        <span style={{ fontSize: 12, opacity: 0.5 }}>{lang.code}</span>
                    </SubItem>
                ))}
            </div>
        </MenuItem>
    );
};