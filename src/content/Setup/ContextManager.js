// components/ContextManager.js
export class ContextManager {
    constructor() {
        this.context = {
            text: '',
            selectedText: '',
            isSelected: false,
            selectionTopPosition: null,
            timestamp: 0
        };

        this.bubbleOpen = false;
        this.listeners = [];
        this.inputListeners = new Map();
    }

    getSelectedText() {
        try {
            const activeElement = document.activeElement;

            // Para inputs, textareas y contenteditable
            if (activeElement && this.isInputElement(activeElement)) {
                const inputSelection = this.getInputSelection(activeElement);
                if (inputSelection) return inputSelection;
            }

            // Para selección normal del documento
            return this.getDocumentSelection();
        } catch {
            return null;
        }
    }

    isInputElement(element) {
        return element.tagName === 'INPUT' ||
               element.tagName === 'TEXTAREA' ||
               element.isContentEditable;
    }

    getInputSelection(element) {
        // Para inputs y textareas normales
        if (element.selectionStart !== undefined &&
            element.selectionEnd !== undefined &&
            element.selectionStart !== element.selectionEnd) {
            const selectedText = element.value.substring(
                element.selectionStart,
                element.selectionEnd
            ).trim();
            if (selectedText) return selectedText;
        }

        // Para elementos contenteditable
        if (element.isContentEditable) {
            const selection = window.getSelection();
            if (selection && !selection.isCollapsed) {
                return selection.toString().trim();
            }
        }

        return null;
    }

    getDocumentSelection() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return null;
        
        const text = selection.toString().trim();
        return text || null;
    }

    getSelectionTopPosition() {
        try {
            if (document.visibilityState !== 'visible') return null;

            const activeElement = document.activeElement;

            // Para elementos de entrada
            if (activeElement && this.isInputElement(activeElement)) {
                return this.getInputSelectionPosition(activeElement);
            }

            // Para selección normal del documento
            return this.getDocumentSelectionPosition();
        } catch {
            return null;
        }
    }

    getInputSelectionPosition(activeElement) {
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            const rect = activeElement.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2 + window.scrollX,
                y: rect.top + window.scrollY
            };
        }

        if (activeElement.isContentEditable) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                if (rect && rect.width > 0 && rect.height > 0) {
                    return {
                        x: rect.left + rect.width / 2 + window.scrollX,
                        y: rect.top + window.scrollY
                    };
                }
            }
        }

        return null;
    }

    getDocumentSelectionPosition() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return null;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (!rect || rect.width === 0 || rect.height === 0) return null;

        return {
            x: rect.left + rect.width / 2 + window.scrollX,
            y: rect.top + window.scrollY
        };
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
        const selectionTopPosition = selectedText ? this.getSelectionTopPosition() : null;

        const nextContext = {
            text: selectedText || this.getPageText(),
            selectedText,
            isSelected: Boolean(selectedText),
            selectionTopPosition,
            timestamp: Date.now()
        };

        if (this.hasContextChanged(nextContext)) {
            this.context = nextContext;
            this.notifyListeners();
        }

        return this.context;
    }

    hasContextChanged(nextContext) {
        return nextContext.text !== this.context.text ||
               nextContext.isSelected !== this.context.isSelected ||
               JSON.stringify(nextContext.selectionTopPosition) !==
               JSON.stringify(this.context.selectionTopPosition);
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
                // Silenciar errores
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