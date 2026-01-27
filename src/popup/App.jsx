import { useState, useEffect } from 'react';
import { Settings, Crown, User, LogOut, Globe, Power, RefreshCw, Scan, Languages, Sparkles, Bell, Play, Star, Bug, MessageSquare, ChevronDown, Eye, EyeOff } from 'lucide-react';

import { BackgroundElements } from './components/BackgroundElements';
import { GrammarAlert } from './components/GrammarAlert';
import { Switch } from './components/ui/Switch';
import { Button } from './components/ui/Button';
import { Dropdown } from './components/ui/Dropdown';
import { MenuItemPopup } from './components/ui/MenuItemPopup';
import { StateService } from '../shared/stateService';

export default function App() {
  const [xrayMode, setXrayMode] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState(['en']);
  const [tone, setTone] = useState('friendly');
  const [grammarErrors] = useState(3);
  const [isPro, setIsPro] = useState(false);
  const [isExtensionOn, setIsExtensionOn] = useState(true);
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);

  // Cargar visibilidad de la burbuja al iniciar
  useEffect(() => {
    const loadBubbleVisibility = async () => {
      try {
        const visible = await StateService.getBubbleVisibility();
        setBubbleVisible(visible);
      } catch (error) {
        console.error('Error loading bubble visibility:', error);
        setBubbleVisible(true); // Default to visible on error
      }
    };
    loadBubbleVisibility();
  }, []);

  // Manejar toggle de visibilidad de la burbuja
  const handleToggleBubbleVisibility = async () => {
    const newVisibility = !bubbleVisible;
    setBubbleVisible(newVisibility);
    try {
      await StateService.setBubbleVisibility(newVisibility);
    } catch (error) {
      console.error('Error toggling bubble visibility:', error);
      // Revertir el estado si hay error
      setBubbleVisible(!newVisibility);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
  ];

  const tones = [
    { value: 'friendly', label: 'Friendly' },
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'professional', label: 'Professional' },
    { value: 'academic', label: 'Academic' },
  ];

  const toggleLanguage = (lang) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
    } else if (selectedLanguages.length < 3) {
      setSelectedLanguages([...selectedLanguages, lang]);
    } else {
      setSelectedLanguages([...selectedLanguages.slice(1), lang]);
    }
  };

  return (
    <div className="w-[380px] bg-light font-sans text-sm text-dark antialiased overflow-hidden shadow-lg relative min-h-screen">
      <BackgroundElements />

      {/* Header */}
      <div className="relative px-6 pt-6 pb-4 border-b border-neutral/20 bg-dark z-20 sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center">
              <div className="w-5 h-5 rounded bg-light flex items-center justify-center">
                <span className="text-xs font-bold text-dark tracking-tighter">C</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-medium text-base text-light tracking-tight">Cliro</h1>
                {isPro && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-light text-dark rounded font-medium tracking-tight">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-xs text-light/80 mt-0.5 tracking-tight">Writing Assistant</p>
            </div>
          </div>

          <Dropdown
            trigger={
              <button className="p-2 hover:bg-light/10 rounded-lg transition-colors duration-200 text-light">
                <Settings className="w-4 h-4" />
              </button>
            }
          >
            <MenuItemPopup
              icon={User}
              label="Account"
              onClick={() => { }}
              chevron
              variant="light"
            />
            {!isPro && (
              <MenuItemPopup
                icon={Crown}
                label="Upgrade to Pro"
                onClick={() => setIsPro(true)}
                chevron
                variant="light"
              />
            )}
            <MenuItemPopup
              icon={Globe}
              label="Preferences"
              onClick={() => { }}
              chevron
              variant="light"
            />
            <div className="border-t border-light/20 my-1" />
            <MenuItemPopup
              icon={LogOut}
              label="Sign Out"
              onClick={() => { }}
              variant="light"
            />
          </Dropdown>
        </div>

        {/* On/Off - Scan */}
        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isExtensionOn ? 'bg-green-500' : 'bg-light/50'}`} />
            <span className="text-xs text-light">{isExtensionOn ? 'Active' : 'Paused'}</span>
          </div>

          <div className="flex gap-2 ml-auto">
            <Button
              variant={isExtensionOn ? "status" : "secondary"}
              onClick={() => setIsExtensionOn(!isExtensionOn)}
              icon={Power}
              iconPosition="left"
              size="sm"
              className={isExtensionOn ? "text-green-500 border-green-500/30" : ""}
            >
              {isExtensionOn ? 'On' : 'Off'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => { }}
              icon={RefreshCw}
              iconPosition="left"
              size="sm"
            >
              Scan
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-5 relative z-10">
        <GrammarAlert errorCount={grammarErrors} />

        {/* Bubble Visibility Toggle */}
        <div className="bg-light/90 backdrop-blur-sm border border-neutral/20 rounded-lg p-4 hover:border-neutral/30 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${bubbleVisible ? 'bg-dark/10' : 'bg-neutral/10'}`}>
                {bubbleVisible ? (
                  <Eye className="w-4 h-4 text-dark" />
                ) : (
                  <EyeOff className="w-4 h-4 text-neutral" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-dark">Assistant Bubble</span>
                  <div className="relative group">
                    <div className="w-3 h-3 bg-dark text-light rounded-full flex items-center justify-center text-[8px] font-bold cursor-help">
                      i
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-dark text-light text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      Toggle the floating assistant bubble
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-dark" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-neutral mt-0.5">Show/hide the floating assistant</p>
              </div>
            </div>
            <Switch
              checked={bubbleVisible}
              onChange={handleToggleBubbleVisibility}
              disabled={!isExtensionOn}
            />
          </div>
        </div>

        {/* X-ray Mode */}
        <div className="bg-light/90 backdrop-blur-sm border border-neutral/20 rounded-lg p-4 hover:border-neutral/30 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${xrayMode ? 'bg-dark/10' : 'bg-neutral/10'}`}>
                <Scan className={`w-4 h-4 ${xrayMode ? 'text-dark' : 'text-neutral'}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-dark">X-ray Mode</span>
                  <div className="relative group">
                    <div className="w-3 h-3 bg-dark text-light rounded-full flex items-center justify-center text-[8px] font-bold cursor-help">
                      i
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-dark text-light text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      Also enables bubble suggestions
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-dark" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-neutral mt-0.5">Highlight text issues</p>
              </div>
            </div>
            <Switch
              checked={xrayMode}
              onChange={setXrayMode}
              disabled={!isExtensionOn}
            />
          </div>
        </div>

        {/* Languages */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Languages className="w-4 h-4 text-dark" />
            <span className="text-sm font-medium text-dark">Languages</span>
            <span className="text-xs text-neutral">(max 3)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => {
              const isSelected = selectedLanguages.includes(lang.code);
              return (
                <Button
                  key={lang.code}
                  onClick={() => toggleLanguage(lang.code)}
                  disabled={!isExtensionOn}
                  variant={isSelected ? 'primary' : 'secondary'}
                  size="md"
                  className="hover:bg-dark/5 hover:border-dark/30"
                >
                  {lang.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Writing Tone */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-dark" />
            <span className="text-sm font-medium text-dark">Writing Tone</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tones.map((toneOption) => {
              const isSelected = tone === toneOption.value;
              return (
                <Button
                  key={toneOption.value}
                  onClick={() => setTone(toneOption.value)}
                  disabled={!isExtensionOn}
                  variant={isSelected ? 'primary' : 'secondary'}
                  size="md"
                  className="hover:bg-dark/5 hover:border-dark/30"
                >
                  {toneOption.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Tips & News */}
        <div className="border border-neutral/20 rounded-lg overflow-hidden backdrop-blur-sm bg-light/90">
          <button
            onClick={() => setIsTipsOpen(!isTipsOpen)}
            className="w-full p-4 hover:bg-light/10 flex items-center justify-between transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-dark" />
              <span className="text-sm font-medium text-dark">Tips & News</span>
              <span className="text-xs px-2 py-0.5 bg-dark/10 text-dark rounded-full font-medium">
                New
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-neutral transition-transform duration-200 ${isTipsOpen ? 'rotate-180' : ''
                }`}
            />
          </button>

          {isTipsOpen && (
            <div className="p-3 border-t border-neutral/20">
              <div className="space-y-1">
                <div className="hover:bg-dark/5 rounded-lg transition-colors duration-200">
                  <MenuItemPopup
                    icon={Play}
                    label="How to write better emails"
                    onClick={() => { }}
                    chevron
                    variant="dark"
                  >
                    2 min read
                  </MenuItemPopup>
                </div>

                <div className="hover:bg-dark/5 rounded-lg transition-colors duration-200">
                  <MenuItemPopup
                    icon={Star}
                    label="Pro tip: Use tone analysis"
                    onClick={() => { }}
                    chevron
                    variant="dark"
                  >
                    New feature
                  </MenuItemPopup>
                </div>

                {!isPro && (
                  <div
                    className="p-3 rounded-lg border border-dark/20 bg-dark/5 cursor-pointer hover:border-dark/30 hover:bg-dark/10 transition-all duration-200"
                    onClick={() => setIsPro(true)}
                  >
                    <div className="flex items-center gap-3">
                      <Crown className="w-3 h-3 text-dark" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-dark">See what Pro can do</p>
                        <p className="text-xs text-neutral mt-0.5">Watch video tour</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="bug"
            icon={Bug}
            iconPosition="left"
            disabled={!isExtensionOn}
            onClick={() => { }}
            className="flex-1"
          >
            Report Bug
          </Button>
          <Button
            variant="suggestion"
            icon={MessageSquare}
            iconPosition="left"
            disabled={!isExtensionOn}
            onClick={() => { }}
            className="flex-1"
          >
            Suggestions
          </Button>
        </div>

        {/* Upgrade to Pro */}
        {!isPro && (
          <Button
            variant="primary"
            icon={Crown}
            iconPosition="left"
            onClick={() => setIsPro(true)}
            className="w-full"
          >
            Upgrade to Pro
          </Button>
        )}

        {/* Status footer */}
        <div className="pt-4 border-t border-neutral/20">
          <div className="flex items-center justify-between text-xs text-neutral">
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${isExtensionOn ? 'bg-green-500' : 'bg-neutral/40'
                  }`}
              />
              <span>v1.2.0</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Cliro</span>
              <span>•</span>
              <span>Writing Assistant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}