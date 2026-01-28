// /popup/App.jsx - VERSIÓN FINAL CON ANIMACIONES SEPARADAS
import { useState, useEffect } from 'react';
import {
  Settings, Crown, User, LogOut, Globe, Power,
  Languages as LanguagesIcon, Sparkles, Bell, Play, Star, Bug,
  MessageSquare, ChevronDown, Eye, EyeOff, AlertCircle
} from 'lucide-react';

import { BackgroundElements } from './components/BackgroundElements';
import { Animations } from './components/Animations';
import { Switch } from './components/ui/Switch';
import { Button } from './components/ui/Button';
import { Dropdown } from './components/ui/Dropdown';
import { MenuItemPopup } from './components/ui/MenuItemPopup';
import { StateService } from '../shared/stateService';
import {
  getIcon,
  languages as languageConstants,
  rewriteOptions,
  BUBBLE_MENU_ITEMS,
  XRAY_DEFAULT_ERROR_COUNT,
  EXTENSION_DEFAULT_ENABLED
} from '../content/MenuItems/constants.js';

export default function App() {
  const [selectedLanguages, setSelectedLanguages] = useState(['ES']);
  const [tone, setTone] = useState('formal');
  const [isPro, setIsPro] = useState(false);
  const [isExtensionOn, setIsExtensionOn] = useState(false);
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [isXrayDetailsOpen, setIsXrayDetailsOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [xrayEnabled, setXrayEnabled] = useState(false);
  const [xrayErrorCount, setXrayErrorCount] = useState(XRAY_DEFAULT_ERROR_COUNT);

  // Cargar estados iniciales
  useEffect(() => {
    const loadInitialStates = async () => {
      try {
        const extensionState = await StateService.getExtensionEnabled();
        setIsExtensionOn(extensionState);

        const bubbleVisibleState = await StateService.getBubbleVisibility();
        setBubbleVisible(bubbleVisibleState);

        const xrayEnabledState = await StateService.getXrayEnabled();
        setXrayEnabled(xrayEnabledState);

        const errorCount = await StateService.getXrayErrorCount();
        setXrayErrorCount(errorCount);
      } catch (error) {
        console.error('Error cargando estados iniciales:', error);
        setIsExtensionOn(EXTENSION_DEFAULT_ENABLED);
        setBubbleVisible(true);
        setXrayEnabled(false);
        setXrayErrorCount(XRAY_DEFAULT_ERROR_COUNT);
      }
    };

    loadInitialStates();
  }, []);

  // Escuchar cambios en estado de la extensión
  useEffect(() => {
    const cleanup = StateService.onExtensionEnabledChanged((isEnabled) => {
      setIsExtensionOn(isEnabled);
    });

    return cleanup;
  }, []);

  // Escuchar cambios en la visibilidad de la burbuja
  useEffect(() => {
    const cleanup = StateService.onBubbleVisibilityChanged((isVisible) => {
      setBubbleVisible(isVisible);
    });

    return cleanup;
  }, []);

  // Escuchar cambios en X-ray enabled
  useEffect(() => {
    const cleanup = StateService.onXrayEnabledChanged((isEnabled) => {
      setXrayEnabled(isEnabled);
      if (!isEnabled) {
        setIsXrayDetailsOpen(false);
      }
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

  // Manejar toggle del estado de la extensión
  const handleToggleExtension = async () => {
    const newState = !isExtensionOn;
    try {
      await StateService.setExtensionEnabled(newState);
      setIsExtensionOn(newState);
    } catch (error) {
      console.error('Error al cambiar estado de extensión:', error);
    }
  };

  // Manejar toggle de visibilidad de la burbuja
  const handleToggleBubbleVisibility = async () => {
    if (!isExtensionOn) return;

    const newVisibility = !bubbleVisible;
    try {
      await StateService.setBubbleVisibility(newVisibility);
      setBubbleVisible(newVisibility);
    } catch (error) {
      console.error('Error al cambiar visibilidad de burbuja:', error);
    }
  };

  // Manejar toggle de X-ray mode
  const handleToggleXrayMode = async () => {
    if (!isExtensionOn) return;

    const newEnabledState = !xrayEnabled;
    try {
      await StateService.setXrayEnabled(newEnabledState);
      setXrayEnabled(newEnabledState);
    } catch (error) {
      console.error('Error al cambiar modo X-ray:', error);
    }
  };

  // Función para obtener severidad de errores
  const getSeverity = (count) => {
    if (count >= 5) return 'alto';
    if (count >= 3) return 'medio';
    return 'bajo';
  };

  // Usar los idiomas desde constants.js
  const languages = languageConstants;

  // Usar rewriteOptions para tonos de escritura
  const tones = rewriteOptions;

  const toggleLanguage = (langCode) => {
    if (!isExtensionOn) return;

    if (selectedLanguages.includes(langCode)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== langCode));
    } else if (selectedLanguages.length < 3) {
      setSelectedLanguages([...selectedLanguages, langCode]);
    } else {
      setSelectedLanguages([...selectedLanguages.slice(1), langCode]);
    }
  };

  const severity = getSeverity(xrayErrorCount);

  const severityStyles = {
    alto: {
      border: 'border-status-attention/20',
      bg: 'bg-status-attention/10',
      icon: 'text-status-attention',
      text: 'text-status-attention',
      badgeBg: 'bg-status-attention/20',
    },
    medio: {
      border: 'border-status-warning/20',
      bg: 'bg-status-warning/10',
      icon: 'text-status-warning',
      text: 'text-status-warning',
      badgeBg: 'bg-status-warning/20',
    },
    bajo: {
      border: 'border-status-good/20',
      bg: 'bg-status-good/10',
      icon: 'text-status-good',
      text: 'text-status-good',
      badgeBg: 'bg-status-good/20',
    },
  };

  return (
    <div className="w-[380px] bg-light font-sans text-sm text-dark antialiased overflow-hidden shadow-lg relative min-h-screen animate-fade-in">
      {/* Incluir animaciones CSS */}
      <Animations />

      {/* Elementos de fondo decorativos */}
      <BackgroundElements />

      {/* Header con background image */}
      <div
        className="relative px-6 pt-6 pb-4 border-b border-neutral/20 z-20 sticky top-0"
        style={{
          backgroundImage: 'url(popupBackground.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center">
              <div className="w-5 h-5 rounded bg-light/10 backdrop-blur-sm flex items-center justify-center animate-scale-in">
                <span className="text-xs font-bold text-light tracking-tighter">
                  {getIcon("xray")}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-medium text-base text-light tracking-tight animate-fade-in">Cliro</h1>
                {isPro && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-light/20 text-light rounded font-medium tracking-tight backdrop-blur-sm animate-pulse-subtle">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-xs text-light/80 mt-0.5 tracking-tight animate-fade-in">Asistente de escritura</p>
            </div>
          </div>

          <Dropdown
            trigger={
              <button className="p-2 hover:bg-light/10 rounded-lg transition-all duration-200 text-light backdrop-blur-sm animate-fade-in">
                <Settings className="w-4 h-4" />
              </button>
            }
          >
            <MenuItemPopup
              icon={User}
              label="Cuenta"
              onClick={() => { }}
              chevron
              variant="light"
            />
            {!isPro && (
              <MenuItemPopup
                icon={Crown}
                label="Mejorar a Pro"
                onClick={() => setIsPro(true)}
                chevron
                variant="light"
              />
            )}
            <MenuItemPopup
              icon={Globe}
              label="Preferencias"
              onClick={() => { }}
              chevron
              variant="light"
            />
            <div className="border-t border-light/20 my-1" />
            <MenuItemPopup
              icon={LogOut}
              label="Cerrar sesión"
              onClick={() => { }}
              variant="light"
            />
          </Dropdown>
        </div>

        {/* Encendido/Apagado */}
        <div className="flex items-center gap-2 mt-4 animate-slide-in">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isExtensionOn ? 'bg-green-500 animate-pulse-subtle' : 'bg-light/50'}`} />
            <span className="text-xs text-light">{isExtensionOn ? 'Activo' : 'Pausado'}</span>
          </div>

          <div className="flex gap-2 ml-auto">
            <Button
              variant={isExtensionOn ? "status" : "secondary"}
              onClick={handleToggleExtension}
              icon={Power}
              iconPosition="left"
              size="sm"
              className={isExtensionOn ? "text-green-500 border-green-500/30 animate-fade-in" : ""}
            >
              {isExtensionOn ? 'Encendido' : 'Apagado'}
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="p-6 space-y-5 relative z-10">
        {/* Burbuja de asistente - PRIMERO */}
        <div className="bg-light/90 backdrop-blur-sm border border-neutral/20 rounded-lg p-4 hover:border-neutral/30 transition-all duration-200 animate-scale-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${bubbleVisible ? 'bg-neutral/10' : 'bg-neutral/10'}`}>
                {bubbleVisible ? (
                  <Eye className="w-4 h-4 text-dark" />
                ) : (
                  <EyeOff className="w-4 h-4 text-neutral" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-dark">Cliro</span>
                  <div className="relative group">
                    <div className="w-3 h-3 bg-dark text-light rounded-full flex items-center justify-center text-[8px] font-bold cursor-help animate-bounce-subtle">
                      i
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-dark text-light text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 animate-fade-in">
                      Muestra/oculta la burbuja flotante del asistente
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-dark" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-neutral mt-0.5">Muestra/oculta el asistente flotante</p>
              </div>
            </div>
            <Switch
              checked={bubbleVisible}
              onChange={handleToggleBubbleVisibility}
              disabled={!isExtensionOn}
            />
          </div>
        </div>

        {/* Modo Rayos X con detalles desplegables */}
        <div className="bg-light/90 backdrop-blur-sm border border-neutral/20 rounded-lg hover:border-neutral/30 transition-all duration-200 animate-scale-in">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${xrayEnabled ? 'bg-neutral/10' : 'bg-neutral/10'}`}>
                  <span className={`w-4 h-4 flex items-center justify-center ${xrayEnabled ? 'text-dark' : 'text-neutral'}`}>
                    {getIcon("xray")}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-dark">Modo X-Ray</span>
                    <div className="relative group">
                      <div className="w-3 h-3 bg-dark text-light rounded-full flex items-center justify-center text-[8px] font-bold cursor-help animate-bounce-subtle">
                        i
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-dark text-light text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 animate-fade-in">
                        Resalta problemas en el texto {xrayEnabled ? `(${xrayErrorCount} errores encontrados)` : ''}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-dark" />
                      </div>
                    </div>
                    {xrayEnabled && xrayErrorCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-light rounded font-medium animate-pulse-subtle">
                        {xrayErrorCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral mt-0.5">Resalta problemas en el texto</p>
                </div>
              </div>
              <Switch
                checked={xrayEnabled}
                onChange={handleToggleXrayMode}
                disabled={!isExtensionOn}
              />
            </div>
          </div>

          {/* Detalles de Rayos X (solo se muestra si está activado y hay errores) */}
          {xrayEnabled && xrayErrorCount > 0 && (
            <>
              <div className="border-t border-neutral/20">
                <button
                  onClick={() => setIsXrayDetailsOpen(!isXrayDetailsOpen)}
                  className="w-full p-4 hover:bg-light/10 flex items-center justify-between transition-all duration-200 animate-fade-in"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className={`w-4 h-4 ${severityStyles[severity].icon}`} />
                    <div>
                      <p className="text-sm font-medium text-dark">
                        {xrayErrorCount} emisión{xrayErrorCount !== 1 ? 'es' : ''} detectada{xrayErrorCount !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-neutral mt-0.5">Revisar sugerencias</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral transition-all duration-200 ${isXrayDetailsOpen ? 'rotate-180 animate-rotate-chevron' : ''}`}
                  />
                </button>

                {isXrayDetailsOpen && (
                  <div className="px-4 pb-4 border-t border-neutral/20 pt-3 animate-fade-in">
                    <div className={`border rounded-lg p-3 ${severityStyles[severity].border} ${severityStyles[severity].bg}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded ${severityStyles[severity].badgeBg}`}>
                          <AlertCircle className={`w-3.5 h-3.5 ${severityStyles[severity].icon}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-medium ${severityStyles[severity].text}`}>
                              Nivel de severidad: {severity}
                            </p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${severityStyles[severity].badgeBg} ${severityStyles[severity].text}`}>
                              {severity}
                            </span>
                          </div>
                          <p className="text-xs text-neutral mt-0.5">
                            {severity === 'alto'
                              ? 'Se recomienda revisión inmediata'
                              : severity === 'medio'
                                ? 'Se sugiere revisar cuando sea conveniente'
                                : 'Pequeñas mejoras sugeridas'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Detalles específicos de los errores */}
                    <div className="mt-3 space-y-2 animate-slide-in">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral">Errores de gramática</span>
                        <span className="font-medium">{(xrayErrorCount * 0.6).toFixed(0)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral">Mejoras de estilo</span>
                        <span className="font-medium">{(xrayErrorCount * 0.3).toFixed(0)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral">Sugerencias de vocabulario</span>
                        <span className="font-medium">{(xrayErrorCount * 0.1).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Idiomas */}
        <div className="animate-slide-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-4 h-4 flex items-center justify-center text-dark">
              {getIcon("translate")}
            </span>
            <span className="text-sm font-medium text-dark">Idiomas</span>
            <span className="text-xs text-neutral">(máx. 3)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang, index) => {
              const isSelected = selectedLanguages.includes(lang.code);
              return (
                <Button
                  key={lang.code}
                  onClick={() => toggleLanguage(lang.code)}
                  disabled={!isExtensionOn}
                  variant={isSelected ? 'primary' : 'secondary'}
                  size="md"
                  className={`animate-fade-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {lang.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Tono de escritura */}
        <div className="animate-slide-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-4 h-4 flex items-center justify-center text-dark">
              {getIcon("rewrite")}
            </span>
            <span className="text-sm font-medium text-dark">Tono de escritura</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tones.map((toneOption, index) => {
              const isSelected = tone === toneOption.id;
              return (
                <Button
                  key={toneOption.id}
                  onClick={() => setTone(toneOption.id)}
                  disabled={!isExtensionOn}
                  variant={isSelected ? 'primary' : 'secondary'}
                  size="md"
                  className={`animate-fade-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {toneOption.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="animate-slide-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-4 h-4 flex items-center justify-center text-dark">
              {getIcon("explain")}
            </span>
            <span className="text-sm font-medium text-dark">Acciones rápidas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => { }}
              disabled={!isExtensionOn}
              variant="secondary"
              size="md"
              className="animate-fade-in"
              style={{ animationDelay: '0ms' }}
            >
              <span className="mr-1">{getIcon("summary")}</span>
              {BUBBLE_MENU_ITEMS.textActions[0].label(true)}
            </Button>

            <Button
              onClick={() => { }}
              disabled={!isExtensionOn}
              variant="secondary"
              size="md"
              className="animate-fade-in"
              style={{ animationDelay: '50ms' }}
            >
              <span className="mr-1">{getIcon("explain")}</span>
              {BUBBLE_MENU_ITEMS.textActions[1].label(true)}
            </Button>
          </div>
        </div>

        {/* Consejos y novedades */}
        <div className="border border-neutral/20 rounded-lg overflow-hidden backdrop-blur-sm bg-light/90 animate-scale-in">
          <button
            onClick={() => setIsTipsOpen(!isTipsOpen)}
            className="w-full p-4 hover:bg-light/10 flex items-center justify-between transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-dark" />
              <span className="text-sm font-medium text-dark">Consejos y novedades</span>
              <span className="text-xs px-2 py-0.5 bg-neutral/10 text-dark rounded-full font-medium animate-pulse-subtle">
                Nuevo
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-neutral transition-all duration-200 ${isTipsOpen ? 'rotate-180 animate-rotate-chevron' : ''}`}
            />
          </button>

          {isTipsOpen && (
            <div className="p-3 border-t border-neutral/20 animate-fade-in">
              <div className="space-y-1">
                <div className="hover:bg-neutral/5 rounded-lg transition-all duration-200">
                  <MenuItemPopup
                    icon={Play}
                    label="Cómo escribir mejores correos"
                    onClick={() => { }}
                    chevron
                    variant="dark"
                  >
                    2 min lectura
                  </MenuItemPopup>
                </div>

                <div className="hover:bg-neutral/5 rounded-lg transition-all duration-200">
                  <MenuItemPopup
                    icon={Star}
                    label="Consejo Pro: Usa análisis de tono"
                    onClick={() => { }}
                    chevron
                    variant="dark"
                  >
                    Nueva función
                  </MenuItemPopup>
                </div>

                {!isPro && (
                  <div
                    className="p-3 rounded-lg border border-neutral/20 bg-neutral/5 cursor-pointer hover:border-neutral/30 hover:bg-neutral/10 transition-all duration-200 animate-fade-in"
                    onClick={() => setIsPro(true)}
                  >
                    <div className="flex items-center gap-3">
                      <Crown className="w-3 h-3 text-dark" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-dark">Descubre lo que Pro puede hacer</p>
                        <p className="text-xs text-neutral mt-0.5">Ver tour en video</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 animate-slide-in">
          <Button
            variant="bug"
            icon={Bug}
            iconPosition="left"
            disabled={!isExtensionOn}
            onClick={() => { }}
            className="flex-1"
          >
            Reportar error
          </Button>
          <Button
            variant="suggestion"
            icon={MessageSquare}
            iconPosition="left"
            disabled={!isExtensionOn}
            onClick={() => { }}
            className="flex-1"
          >
            Sugerencias
          </Button>
        </div>

        {/* Mejorar a Pro */}
        {!isPro && (
          <Button
            variant="primary"
            icon={Crown}
            iconPosition="left"
            onClick={() => setIsPro(true)}
            className="w-full animate-pulse-subtle"
          >
            Mejorar a Pro
          </Button>
        )}

        {/* Pie de estado */}
        <div className="pt-4 border-t border-neutral/20 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-neutral">
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${isExtensionOn ? 'bg-green-500' : 'bg-neutral/40'}`}
              />
              <span>v1.2.0</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Cliro</span>
              <span>•</span>
              <span>Asistente de escritura</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}