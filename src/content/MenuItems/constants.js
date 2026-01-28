// X-ray constants
export const XRAY_DEFAULT_ENABLED = false;
export const XRAY_DEFAULT_ERROR_COUNT = 12;
export const XRAY_STORAGE_KEY = 'cliro_xray_enabled';
export const XRAY_ERROR_COUNT_KEY = 'cliro_xray_error_count';

// On / Off Feature
export const EXTENSION_DEFAULT_ENABLED = true;
export const EXTENSION_STORAGE_KEY = 'cliro_extension_enabled';

// Menu Items and Icons
export const icons = {
    xray: "◎",
    summary: "≡",
    explain: "?",
    rewrite: "✎",
    translate: "⇄",
    active: "⏻",
    more: "⋯",
};

export const rewriteOptions = [
    { id: "formal", label: "Formal" },
    { id: "concise", label: "Conciso" },
    { id: "casual", label: "Casual" },
    { id: "expand", label: "Texto" }
];

export const languages = [
    { name: "Español", code: "ES", lang: "Spanish" },
    { name: "Inglés", code: "EN", lang: "English" },
    { name: "Francés", code: "FR", lang: "French" },
    { name: "Alemán", code: "DE", lang: "German" },
    { name: "Italiano", code: "IT", lang: "Italian" },
    { name: "Portugués", code: "PT", lang: "Portuguese" }
];

export const BUBBLE_MENU_ITEMS = {
  xray: {
    id: "xray",
    type: "toggle",
    action: "XRAY_TOGGLE",
    icon: "xray",
  },

  textActions: [
    {
      id: "summary",
      icon: "summary",
      action: "SUMMARIZE",
      label: (hasText) => hasText ? "Resumir" : "Resumir Todo",
    },
    {
      id: "explain",
      icon: "explain",
      action: "EXPLAIN",
      label: (hasText) => hasText ? "Explicar / Definir" : "Explicar / Definir Todo",
    },
  ],

  rewrite: {
    id: "rewrite",
    type: "submenu",
    action: "REWRITE",
    icon: "rewrite",
  },

  translate: {
    id: "translate",
    type: "submenu",
    action: "TRANSLATE",
    icon: "translate",
  },

  active: {
    id: "active",
    icon: "active",
    label: "Ocultar",
    action: "ACTIVE_TOGGLE",
  },
};

export const LABEL_MENU_ITEMS = {
  summary: {
    id: "summary",
    icon: "summary",
    action: "SUMMARIZE",
    label: "Resumir"
  },
  explain: {
    id: "explain",
    icon: "explain",
    action: "EXPLAIN",
    label: "Explicar / Definir"
  },
  rewrite: {
    id: "rewrite",
    type: "submenu",
    action: "REWRITE",
    label: "Reescribir",
    icon: "rewrite",
  },
  translate: {
    id: "translate",
    type: "submenu",
    action: "TRANSLATE",
    label: "Traducir",
    icon: "translate",
  },
  more: {
    id: "more",
    icon: "more",
    action: "MORE",
    label: "⋯",
  },
};

// Helper functions for easier access
export const getLabelMenuItems = () => {
  return [
    LABEL_MENU_ITEMS.explain,
    LABEL_MENU_ITEMS.summary,
    LABEL_MENU_ITEMS.rewrite,
    LABEL_MENU_ITEMS.translate,
  ];
};

export const getRewriteSubmenuItems = () => {
  return rewriteOptions.map(option => option.label);
};

export const getTranslateSubmenuItems = () => {
  return languages.slice(0, 4).map(lang => lang.code);
};

// Función universal para obtener iconos
export const getIcon = (iconInput) => {
  if (!iconInput) return "";
  if (typeof iconInput === 'string') {
    if (iconInput in icons) {
      return icons[iconInput];
    }
    return iconInput;
  }
  
  return "";
};