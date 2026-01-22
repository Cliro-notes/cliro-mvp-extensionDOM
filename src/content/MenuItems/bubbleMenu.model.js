export const BUBBLE_MENU_ITEMS = {
  xray: {
    id: "xray",
    type: "toggle",
    action: "XRAY_TOGGLE",
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
  },

  translate: {
    id: "translate",
    type: "submenu",
    action: "TRANSLATE",
  },

  power: {
    id: "power",
    icon: "power",
    label: "Apagar",
    action: "POWER_OFF",
    requiresText: false,
  },
};
