// components/index.jsx
import { ContextManager } from './Setup/ContextManager.js';
import { setupInputListeners, setupGlobalListeners } from './Setup/setupListeners.js';
import { createAppRenderer, getImageUrl } from './Setup/initReactApp.js';
import { injectCssVariables } from '../shared/constants/colors.js';

function initExtension() {
    // Inyectar variables CSS
    injectCssVariables();

    // Crear gestor de contexto
    const contextManager = new ContextManager();

    // Crear y configurar aplicación React
    const app = createAppRenderer(contextManager, getImageUrl);
    if (!app) return; // Ya está inicializado

    // Suscribir el renderizado a cambios de contexto
    const unsubscribe = contextManager.subscribe(app.render);

    // Configurar listeners
    const cleanupInputListeners = setupInputListeners(contextManager);
    const cleanupGlobalListeners = setupGlobalListeners(contextManager);

    // Actualizar contexto inicial
    contextManager.update();

    // Función de cleanup para desmontar todo
    return () => {
        unsubscribe();
        cleanupInputListeners();
        cleanupGlobalListeners();
        app.cleanup?.();

        // Remover contenedor React
        const container = document.getElementById('cliro-react-root');
        if (container) {
            container.remove();
        }
    };
}

// Inicialización
function init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.__cliroCleanup = initExtension();
        });
    } else {
        window.__cliroCleanup = initExtension();
    }
}

// Exportar para uso en desarrollo/testing
export { init, ContextManager };

// Inicializar automáticamente
init();