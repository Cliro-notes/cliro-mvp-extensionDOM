// /shared/stateService.js
import { 
  XRAY_DEFAULT_ENABLED, 
  XRAY_DEFAULT_ERROR_COUNT,
  XRAY_STORAGE_KEY,
  XRAY_ERROR_COUNT_KEY,
  EXTENSION_DEFAULT_ENABLED,
  EXTENSION_STORAGE_KEY
} from '../content/MenuItems/constants.js';

export class StateService {
  // Claves existentes...
  static BUBBLE_VISIBILITY_KEY = 'cliro_bubble_visible';
  static XRAY_ENABLED_KEY = XRAY_STORAGE_KEY;
  static XRAY_ERROR_COUNT_KEY = XRAY_ERROR_COUNT_KEY;
  static EXTENSION_ENABLED_KEY = EXTENSION_STORAGE_KEY;

  // === EXTENSION STATE METHODS ===
  // Obtener estado de la extensión (true por defecto)
  static async getExtensionEnabled() {
    try {
      const result = await chrome.storage.local.get([this.EXTENSION_ENABLED_KEY]);
      return result[this.EXTENSION_ENABLED_KEY] ?? EXTENSION_DEFAULT_ENABLED;
    } catch (error) {
      console.error('Error getting extension enabled:', error);
      return EXTENSION_DEFAULT_ENABLED;
    }
  }
  
  // Establecer estado de la extensión
  static async setExtensionEnabled(isEnabled) {
    try {
      await chrome.storage.local.set({ 
        [this.EXTENSION_ENABLED_KEY]: isEnabled 
      });
      
      this.notifyAllTabs('EXTENSION_ENABLED_CHANGED', { isEnabled });
      return true;
    } catch (error) {
      console.error('Error setting extension enabled:', error);
      return false;
    }
  }
  
  // Escuchar cambios en estado de la extensión
  static onExtensionEnabledChanged(callback) {
    return this.setupListener('EXTENSION_ENABLED_CHANGED', this.EXTENSION_ENABLED_KEY, callback);
  }
  
  // === BUBBLE VISIBILITY METHODS ===
  // Obtener visibilidad actual (true por defecto)
  static async getBubbleVisibility() {
    try {
      const result = await chrome.storage.local.get([this.BUBBLE_VISIBILITY_KEY]);
      return result[this.BUBBLE_VISIBILITY_KEY] !== false;
    } catch (error) {
      console.error('Error getting bubble visibility:', error);
      return true;
    }
  }
  
  // Establecer visibilidad
  static async setBubbleVisibility(isVisible) {
    try {
      await chrome.storage.local.set({ 
        [this.BUBBLE_VISIBILITY_KEY]: isVisible 
      });
      
      this.notifyAllTabs('BUBBLE_VISIBILITY_CHANGED', { isVisible });
      return true;
    } catch (error) {
      console.error('Error setting bubble visibility:', error);
      return false;
    }
  }
  
  // === X-RAY METHODS ===
  // Obtener estado de X-ray (false por defecto)
  static async getXrayEnabled() {
    try {
      const result = await chrome.storage.local.get([this.XRAY_ENABLED_KEY]);
      return result[this.XRAY_ENABLED_KEY] ?? XRAY_DEFAULT_ENABLED;
    } catch (error) {
      console.error('Error getting X-ray enabled:', error);
      return XRAY_DEFAULT_ENABLED;
    }
  }
  
  // Establecer estado de X-ray
  static async setXrayEnabled(isEnabled) {
    try {
      await chrome.storage.local.set({ 
        [this.XRAY_ENABLED_KEY]: isEnabled 
      });
      
      this.notifyAllTabs('XRAY_ENABLED_CHANGED', { isEnabled });
      return true;
    } catch (error) {
      console.error('Error setting X-ray enabled:', error);
      return false;
    }
  }
  
  // Obtener conteo de errores de X-ray
  static async getXrayErrorCount() {
    try {
      const result = await chrome.storage.local.get([this.XRAY_ERROR_COUNT_KEY]);
      return result[this.XRAY_ERROR_COUNT_KEY] ?? XRAY_DEFAULT_ERROR_COUNT;
    } catch (error) {
      console.error('Error getting X-ray error count:', error);
      return XRAY_DEFAULT_ERROR_COUNT;
    }
  }
  
  // Establecer conteo de errores de X-ray
  static async setXrayErrorCount(count) {
    try {
      await chrome.storage.local.set({ 
        [this.XRAY_ERROR_COUNT_KEY]: count 
      });
      
      this.notifyAllTabs('XRAY_ERROR_COUNT_CHANGED', { count });
      return true;
    } catch (error) {
      console.error('Error setting X-ray error count:', error);
      return false;
    }
  }
  
  // === LISTENER METHODS ===
  // Escuchar cambios en la visibilidad de la burbuja
  static onBubbleVisibilityChanged(callback) {
    return this.setupListener('BUBBLE_VISIBILITY_CHANGED', this.BUBBLE_VISIBILITY_KEY, callback);
  }
  
  // Escuchar cambios en X-ray enabled
  static onXrayEnabledChanged(callback) {
    return this.setupListener('XRAY_ENABLED_CHANGED', this.XRAY_ENABLED_KEY, callback);
  }
  
  // Escuchar cambios en X-ray error count
  static onXrayErrorCountChanged(callback) {
    return this.setupListener('XRAY_ERROR_COUNT_CHANGED', this.XRAY_ERROR_COUNT_KEY, callback);
  }
  
  // === PRIVATE HELPER METHODS ===
  // Notificar a todos los tabs
  static async notifyAllTabs(messageType, data) {
    try {
      const tabs = await chrome.tabs.query({});
      tabs.forEach(tab => {
        try {
          chrome.tabs.sendMessage(tab.id, {
            type: messageType,
            ...data
          });
        } catch (error) {
          // Tab puede no tener content script cargado
        }
      });
    } catch (error) {
      console.error('Error notifying tabs:', error);
    }
  }
  
  // Configurar listener genérico
  static setupListener(messageType, storageKey, callback) {
    // Escuchar cambios en storage
    const storageListener = (changes, namespace) => {
      if (namespace === 'local' && changes[storageKey]) {
        callback(changes[storageKey].newValue);
      }
    };
    
    // Escuchar mensajes directos
    const messageListener = (message, sender, sendResponse) => {
      if (message.type === messageType) {
        // Extraer el valor del mensaje (isVisible, isEnabled, count, etc.)
        const value = Object.values(message).find(val => 
          typeof val === 'boolean' || typeof val === 'number'
        );
        callback(value);
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