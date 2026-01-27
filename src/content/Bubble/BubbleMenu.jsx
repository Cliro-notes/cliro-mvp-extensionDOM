import { useState } from "react";
import {
    BUBBLE_MENU_ITEMS,
    rewriteOptions,
    languages,
    getIcon
} from "../MenuItems/constants.js";

import { XRayItem } from "../MenuItems/XRayItem.jsx";
import { TextActionItem } from "../MenuItems/TextActionItem.jsx";
import { RewriteItem } from "../MenuItems/RewriteItem.jsx";
import { TranslateItem } from "../MenuItems/TranslateItem.jsx";
import { MenuItem } from "../MenuItems/MenuItem.jsx";

import LoadingAnimation from "../MenuItems/LoadingAnimation.jsx";
import { TextPreview } from './TextPreview.jsx';
import { ResponseDisplay } from './ResponseDisplay.jsx';
import { sendAIRequest } from "../../shared/api.js";
import { StateService } from "../../shared/stateService.js";
import { SPACING } from "../../shared/constants/colors.js";

export function BubbleMenu({ originalText, onClose, isSelected }) {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [xrayOn, setXrayOn] = useState(true);
    const hasText = Boolean(originalText);

    const handleAction = async (action, payload) => {
        setLoading(true);
        console.log("ACTION:", { action, payload, originalText });
        const aiResponse = await sendAIRequest(action, payload, originalText);
        setResponse(aiResponse);
        setLoading(false);
    };

    // NUEVO HANDLER PARA OCULTAR BURBUJA
    const handleHideBubble = async () => {
        await StateService.setBubbleVisibility(false);
        onClose?.();
    };

    const handleToggleXray = (e) => {
        e?.stopPropagation();
        setXrayOn(prev => !prev);
        handleAction("XRAY_TOGGLE", { enabled: !xrayOn });
    };

    const handleRewriteOption = (option) => {
        const rewriteOption = rewriteOptions.find(opt => opt.label === option);
        const payload = rewriteOption ? rewriteOption.id : option;
        handleAction("REWRITE", payload);
    };

    const handleLanguageClick = (language) => {
        const langObj = languages.find(lang => lang.code === language);
        const payload = langObj ? langObj.lang : language;
        handleAction("TRANSLATE", payload);
    };

    const handleCloseResponse = () => {
        setResponse(null);
    };

    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            gap: SPACING.xs,
        }
    };

    return (
        <div onClick={(e) => e.stopPropagation()} style={styles.container}>
            {loading ? (
                // <LoadingAnimation />
                <ResponseDisplay response={"HOLA ESTO ES UN TEST, DE UN TEXTO PEQUENO"} onClose={handleCloseResponse} />
            ) : response ? (
                <ResponseDisplay response={response} onClose={handleCloseResponse} />
            ) : (
                <div>
                    {hasText && <TextPreview text={originalText} />}

                    <XRayItem
                        xrayOn={xrayOn}
                        onToggle={handleToggleXray}
                    />

                    {BUBBLE_MENU_ITEMS.textActions.map(item => (
                        <TextActionItem
                            key={item.id}
                            id={item.id}
                            icon={getIcon(item.icon)}
                            label={item.label(hasText)}
                            onClick={() => handleAction(item.action, item.id)}
                        />
                    ))}

                    <RewriteItem
                        hasText={hasText}
                        onOptionClick={handleRewriteOption}
                    />

                    <TranslateItem
                        hasText={hasText}
                        onLanguageClick={handleLanguageClick}
                    />

                    {/* CAMBIAR "Ocultar" a "Hide Bubble" */}
                    <MenuItem
                        id={BUBBLE_MENU_ITEMS.active.id}
                        icon={getIcon(BUBBLE_MENU_ITEMS.active.icon)}
                        label="Hide Bubble" // Cambiar label
                        onClick={handleHideBubble} // Usar nuevo handler
                    />
                </div>
            )}
        </div>
    );
}