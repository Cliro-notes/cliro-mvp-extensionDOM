import { useState } from "react";
import { BUBBLE_MENU_ITEMS } from "../MenuItems/bubbleMenu.model.js";

import { XRayItem } from "../MenuItems/XRayItem.jsx";
import { TextActionItem } from "../MenuItems/TextActionItem.jsx";
import { RewriteItem } from "../MenuItems/RewriteItem.jsx";
import { TranslateItem } from "../MenuItems/TranslateItem.jsx";
import { MenuItem } from "../MenuItems/MenuItem.jsx";

import LoadingAnimation from "../MenuItems/LoadingAnimation.jsx";
import { TextPreview } from './TextPreview.jsx';
import { ResponseDisplay } from './ResponseDisplay.jsx';
import { sendAIRequest } from "../../shared/api.js";
import { COLORS, OPACITY, SPACING, RADIUS, TYPOGRAPHY, ANIMATION } from "../../shared/constants/colors.js";

export function BubbleMenu({ originalText, onClose }) {
    const hola = "What is Lorem Ipsum?\\nLorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [xrayOn, setXrayOn] = useState(true);
    const hasText = Boolean(originalText);

    const handleAction = async (action, payload) => {
        setLoading(true);
        console.log("ACTION:", action, payload, originalText);
        const aiResponse = await sendAIRequest(action, payload, originalText);
        setResponse(aiResponse);
        setLoading(false);
    };

    const handleToggleXray = (e) => {
        e?.stopPropagation();
        setXrayOn(prev => !prev);
        handleAction("XRAY_TOGGLE", { enabled: !xrayOn });
    };

    const handleRewriteOption = (option) => {
        handleAction("REWRITE", option);
    };

    const handleLanguageClick = (language) => {
        handleAction("TRANSLATE", language);
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
                <ResponseDisplay response={hola} onClose={handleCloseResponse} />
            ) : response ? (
                <ResponseDisplay response={response} onClose={handleCloseResponse} />
            ) : (
                <div>
                    {hasText && <TextPreview text={originalText} />}
                    <XRayItem xrayOn={xrayOn} onToggle={handleToggleXray} />

                    {BUBBLE_MENU_ITEMS.textActions.map(item => (
                        <TextActionItem
                            key={item.id}
                            id={item.id}
                            icon={item.icon}
                            label={item.label(hasText)}
                            onClick={() => handleAction(item.action, item)}
                        />
                    ))}

                    <RewriteItem hasText={hasText} onOptionClick={handleRewriteOption} />
                    <TranslateItem hasText={hasText} onLanguageClick={handleLanguageClick} />

                    <MenuItem
                        id={BUBBLE_MENU_ITEMS.sleep.id}
                        icon={BUBBLE_MENU_ITEMS.sleep.icon}
                        label={BUBBLE_MENU_ITEMS.sleep.label}
                        onClick={onClose}
                    />
                </div>
            )}
        </div>
    );
}