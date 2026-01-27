// shared/stateService.js
export class StateService {
  // Clave para almacenar la visibilidad de la burbuja
  static BUBBLE_VISIBILITY_KEY = 'cliro_bubble_visible';
  
  // Obtener visibilidad actual (true por defecto)
  static async getBubbleVisibility() {
    try {
      const result = await chrome.storage.local.get([this.BUBBLE_VISIBILITY_KEY]);
      // Si no existe en storage, retornar true (visible por defecto)
      return result[this.BUBBLE_VISIBILITY_KEY] !== false;
    } catch (error) {
      console.error('Error getting bubble visibility:', error);
      return true; // Default visible on error
    }
  }
  
  // Establecer visibilidad
  static async setBubbleVisibility(isVisible) {
    try {
      await chrome.storage.local.set({ 
        [this.BUBBLE_VISIBILITY_KEY]: isVisible 
      });
      
      // Notificar a todos los content scripts del cambio
      const tabs = await chrome.tabs.query({});
      tabs.forEach(tab => {
        try {
          chrome.tabs.sendMessage(tab.id, {
            type: 'BUBBLE_VISIBILITY_CHANGED',
            isVisible
          });
        } catch (error) {
          // Tab puede no tener content script cargado
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error setting bubble visibility:', error);
      return false;
    }
  }
  
  // Escuchar cambios en la visibilidad
  static onVisibilityChanged(callback) {
    // Escuchar cambios en storage
    const storageListener = (changes, namespace) => {
      if (namespace === 'local' && changes[this.BUBBLE_VISIBILITY_KEY]) {
        callback(changes[this.BUBBLE_VISIBILITY_KEY].newValue);
      }
    };
    
    // Escuchar mensajes directos
    const messageListener = (message, sender, sendResponse) => {
      if (message.type === 'BUBBLE_VISIBILITY_CHANGED') {
        callback(message.isVisible);
      }
    };
    
    chrome.storage.onChanged.addListener(storageListener);
    chrome.runtime.onMessage.addListener(messageListener);
    
    // Retornar función para remover listeners
    return () => {
      chrome.storage.onChanged.removeListener(storageListener);
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }
}