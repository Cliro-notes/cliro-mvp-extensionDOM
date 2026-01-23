import React from 'react';
import { createRoot } from 'react-dom/client';
import { injectCssVariables } from '../shared/constants/colors.js';
import Bubble from './Bubble/Bubble.jsx';
import SelectionLabel from './Label/SelectionLabel.jsx';

// CONTEXT MANAGER
class ContextManager {
    constructor() {
        this.context = {
            text: '',
            isSelected: false,
            selectionTopPosition: null,
            timestamp: 0
        };

        this.bubbleOpen = false;
        this.listeners = [];
    }

    getSelectedText() {
        try {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return null;

            const text = selection.toString().trim();
            return text || null;
        } catch {
            return null;
        }
    }

    getSelectionTopPosition() {
        try {
            // Document not visible → abort
            if (document.visibilityState !== 'visible') return null;

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return null;

            const range = selection.getRangeAt(0);

            const rect = range.getBoundingClientRect();
            if (!rect || rect.width === 0 || rect.height === 0) return null;

            return {
                x: rect.left + rect.width / 2 + window.scrollX,
                y: rect.top + window.scrollY
            };
        } catch {
            return null;
        }
    }

    getPageText() {
        try {
            return document.body?.innerText
                ?.replace(/\s+/g, ' ')
                ?.trim() || '';
        } catch {
            return '';
        }
    }

    update() {
        const selectedText = this.getSelectedText();

        const nextContext = {
            text: selectedText || this.getPageText(),
            selectedText: selectedText,
            isSelected: Boolean(selectedText),
            selectionTopPosition: selectedText
                ? this.getSelectionTopPosition()
                : null,
            timestamp: Date.now()
        };

        const hasChanged =
            nextContext.text !== this.context.text ||
            nextContext.isSelected !== this.context.isSelected ||
            JSON.stringify(nextContext.selectionTopPosition) !==
            JSON.stringify(this.context.selectionTopPosition);

        if (hasChanged) {
            this.context = nextContext;
            this.notifyListeners();
        }

        return this.context;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => {
            try {
                listener(this.context);
            } catch {

            }
        });
    }

    setBubbleOpen(isOpen) {
        this.bubbleOpen = isOpen;
        if (!isOpen) {
            this.update();
        }
    }
}

// EXTENSION CORE
const contextManager = new ContextManager();

function getImageUrl(filename) {
    return chrome.runtime?.getURL?.(filename) || `/${filename}`;
}

function initBubble() {
    injectCssVariables();

    if (document.getElementById('cliro-react-root')) return;

    const container = document.createElement('div');
    container.id = 'cliro-react-root';
    container.style.cssText = `
        position: fixed !important;
        inset: 0 !important;
        pointer-events: none !important;
        z-index: 2147483647 !important;
        isolation: isolate !important;
    `;
    document.body.appendChild(container);

    const root = createRoot(container);

    const render = (context) => {
        root.render(
            <React.StrictMode>
                {context.selectionTopPosition && (
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
                    onOpenChange={(isOpen) =>
                        contextManager.setBubbleOpen(isOpen)
                    }
                />
            </React.StrictMode>
        );
    };

    contextManager.subscribe(render);
    contextManager.update();

    document.addEventListener(
        'selectionchange',
        () => {
            try {
                contextManager.update();
            } catch {
                /* noop */
            }
        },
        { passive: true }
    );
}

// INIT
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBubble);
} else {
    initBubble();
}
