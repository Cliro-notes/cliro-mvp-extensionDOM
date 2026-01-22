import { MenuItem } from "./MenuItem";
import { SubItem } from "./SubItem";
import { languages } from "./constants";

export const TranslateItem = ({ hasText, onLanguageClick }) => {
    const label = hasText ? "Traducir" : "Traducir Todo";

    return (
        <MenuItem
            id="translate"
            icon="translate"
            label={label}
            hasSubmenu
        >
            <div style={{ padding: "8px 0" }}>
                <div style={{ padding: "8px 12px", opacity: 0.6, fontSize: 12 }}>Idiomas:</div>
                {languages.map((lang) => (
                    <SubItem
                        key={lang.lang}
                        id={`translate-${lang.lang}`}
                        onClick={() => onLanguageClick?.(lang)}
                    >
                        <span style={{ flex: 1 }}>{lang.name}</span>
                        <span style={{ fontSize: 12, opacity: 0.5 }}>{lang.code}</span>
                    </SubItem>
                ))}
            </div>
        </MenuItem>
    );
};