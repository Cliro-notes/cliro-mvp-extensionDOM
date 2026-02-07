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
    { id: "concise", label: "Concise" },
    { id: "casual", label: "Casual" },
    { id: "friendly", label: "Friendly" }
];

export const languages = [
    { name: "Spanish", code: "ES", lang: "Spanish" },
    { name: "English", code: "EN", lang: "English" },
    { name: "French", code: "FR", lang: "French" },
    { name: "German", code: "DE", lang: "German" },
    { name: "Italian", code: "IT", lang: "Italian" },
    { name: "Portuguese", code: "PT", lang: "Portuguese" }
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
      label: (hasText) => hasText ? "Summary" : "Summary All",
    },
    {
      id: "explain",
      icon: "explain",
      action: "EXPLAIN",
      label: (hasText) => hasText ? "Explain / Define" : "Explain / Define All",
    },
  ],

  rewrite: {
    id: "rewrite",
    type: "submenu",
    action: "REWRITE",
    icon: "rewrite",
    label: (hasText) => hasText ? "Rewrite" : "Rewrite All",
  },

  translate: {
    id: "translate",
    type: "submenu",
    action: "TRANSLATE",
    icon: "translate",
    label: (hasText) => hasText ? "Translate" : "Translate All",
  },

  active: {
    id: "active",
    icon: "active",
    label: "Hide Bubble",
    action: "ACTIVE_TOGGLE",
  },
};

export const LABEL_MENU_ITEMS = {
  summary: {
    id: "summary",
    icon: "summary",
    action: "SUMMARIZE",
    label: "Summary"
  },
  explain: {
    id: "explain",
    icon: "explain",
    action: "EXPLAIN",
    label: "Explain / Define"
  },
  rewrite: {
    id: "rewrite",
    type: "submenu",
    action: "REWRITE",
    label: "Rewrite",
    icon: "rewrite",
  },
  translate: {
    id: "translate",
    type: "submenu",
    action: "TRANSLATE",
    label: "Translate",
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