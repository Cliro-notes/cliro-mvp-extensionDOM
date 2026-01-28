// /content/BubbleMenu.jsx - MODIFICADO
import { useState, useEffect } from "react"; // Añadir useEffect
import {
    BUBBLE_MENU_ITEMS,
    rewriteOptions,
    languages,
    getIcon,
    XRAY_DEFAULT_ERROR_COUNT
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
    const [xrayEnabled, setXrayEnabled] = useState(false);
    const [xrayErrorCount, setXrayErrorCount] = useState(XRAY_DEFAULT_ERROR_COUNT);
    const hasText = Boolean(originalText);

    // Cargar estado inicial de X-ray
    useEffect(() => {
        const loadXrayState = async () => {
            try {
                const enabled = await StateService.getXrayEnabled();
                const errorCount = await StateService.getXrayErrorCount();
                setXrayEnabled(enabled);
                setXrayErrorCount(errorCount);
            } catch (error) {
                console.error('Error loading X-ray state:', error);
                setXrayEnabled(false);
                setXrayErrorCount(XRAY_DEFAULT_ERROR_COUNT);
            }
        };

        loadXrayState();
    }, []);

    // Escuchar cambios en X-ray enabled
    useEffect(() => {
        const cleanup = StateService.onXrayEnabledChanged((isEnabled) => {
            setXrayEnabled(isEnabled);
        });

        return cleanup;
    }, []);

    // Escuchar cambios en X-ray error count
    useEffect(() => {
        const cleanup = StateService.onXrayErrorCountChanged((count) => {
            setXrayErrorCount(count);
        });

        return cleanup;
    }, []);

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

    const handleToggleXray = async (e) => {
        e?.stopPropagation();
        const newEnabledState = !xrayEnabled;

        try {
            // Actualizar StateService primero
            await StateService.setXrayEnabled(newEnabledState);
            setXrayEnabled(newEnabledState);

            // Llamar a la API después
            handleAction("XRAY_TOGGLE", { enabled: newEnabledState });
        } catch (error) {
            console.error('Error toggling X-ray:', error);
        }
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
                        xrayEnabled={xrayEnabled}          // Cambiado de xrayOn
                        xrayErrorCount={xrayErrorCount}   // Nuevo prop
                        onToggle={handleToggleXray}       // Usa nuevo handler
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