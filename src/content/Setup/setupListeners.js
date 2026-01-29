// content/Setup/setupListeners.js
export function setupInputListeners(contextManager) {
    const inputSelectors = [
        'input[type="text"]',
        'input[type="search"]',
        'input[type="email"]',
        'input[type="url"]',
        'textarea',
        '[contenteditable="true"]'
    ].join(', ');

    function setupListeners() {
        removeInputListeners(contextManager);
        
        const inputs = document.querySelectorAll(inputSelectors);
        
        inputs.forEach(input => {
            const handler = () => setTimeout(() => contextManager.update(), 50);
            
            input.addEventListener('mouseup', handler);
            input.addEventListener('keyup', handler);
            input.addEventListener('select', handler);
            input.addEventListener('input', handler);
            
            contextManager.inputListeners.set(input, handler);
        });
    }

    function removeInputListeners(contextManager) {
        contextManager.inputListeners.forEach((handler, element) => {
            element.removeEventListener('mouseup', handler);
            element.removeEventListener('keyup', handler);
            element.removeEventListener('select', handler);
            element.removeEventListener('input', handler);
        });
        contextManager.inputListeners.clear();
    }

    // Configurar MutationObserver para detectar nuevos elementos
    const observer = new MutationObserver(() => setupListeners());
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Configurar listeners iniciales
    setupListeners();

    // Retornar función de cleanup
    return () => {
        removeInputListeners(contextManager);
        observer.disconnect();
    };
}

export function setupGlobalListeners(contextManager) {
    const handleSelectionChange = () => {
        try {
            contextManager.update();
        } catch {
            // Ignorar errores
        }
    };

    const handleFocusIn = () => {
        setTimeout(() => contextManager.update(), 100);
    };

    document.addEventListener('selectionchange', handleSelectionChange, { passive: true });
    document.addEventListener('focusin', handleFocusIn);

    // Retornar función de cleanup
    return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
        document.removeEventListener('focusin', handleFocusIn);
    };
}