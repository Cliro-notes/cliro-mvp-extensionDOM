// content/Setup/initReactApp.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { injectCssVariables } from '../../shared/constants/colors.js';
import Bubble from '../Bubble/Bubble.jsx';
import SelectionLabel from '../Label/SelectionLabel.jsx';

export function getImageUrl(filename) {
    return chrome.runtime?.getURL?.(filename) || `/${filename}`;
}

export function createReactContainer() {
    const containerId = 'cliro-react-root';
    
    if (document.getElementById(containerId)) {
        return null; // Container ya existe
    }

    const container = document.createElement('div');
    container.id = containerId;
    container.style.cssText = `
        position: fixed !important;
        inset: 0 !important;
        pointer-events: none !important;
        z-index: 2147483647 !important;
        isolation: isolate !important;
    `;
    
    document.body.appendChild(container);
    return container;
}

export function createAppRenderer(contextManager, getImageUrl) {
    const container = createReactContainer();
    if (!container) return null;

    const root = createRoot(container);

    const render = (context) => {
        root.render(
            <React.StrictMode>
                {context.isSelected && context.selectionTopPosition && (
                    <SelectionLabel
                        selectedText={context.selectedText}
                        x={context.selectionTopPosition.x}
                        y={context.selectionTopPosition.y}
                    />
                )}

                <Bubble
                    isSelected={context.isSelected}
                    originalText={context.text}
                    getImageUrl={getImageUrl}
                    onOpenChange={(isOpen) => contextManager.setBubbleOpen(isOpen)}
                />
            </React.StrictMode>
        );
    };

    return { render, cleanup: () => root.unmount() };
}