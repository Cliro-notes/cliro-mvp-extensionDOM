# Frontend de Cliro Notes para el MVP
Este repositorio sirve para todo lo que modificara el DOM y todo lo que se use directamente de la extension o con lo que el usuario interactue.

## Estructura / Arquitectura
Algo parecido a esto (consultar con ChatGPT, Deepseek, Gemini, etc): \
extension/ \
├─ public/ \
│  ├─ manifest.json \
│  └─ icons/ \
│     ├─ icon-16.png \
│     ├─ icon-48.png \
│     └─ icon-128.png \
│ \
├─ src/ \
│  ├─ popup/                 # React app (UI) \
│  │  ├─ App.tsx \
│  │  ├─ main.tsx \
│  │  ├─ components/ \
│  │  │  ├─ ActionButton.tsx \
│  │  │  ├─ LanguageSelect.tsx \
│  │  │  └─ ResultView.tsx \
│  │  ├─ hooks/ \
│  │  │  ├─ useSelection.ts \
│  │  │  └─ useAuth.ts \
│  │  ├─ styles/ \
│  │  │  └─ index.css        # Tailwind entry \
│  │  └─ types.ts \
│  │ \
│  ├─ content/ \
│  │  └─ index.ts            # DOM interaction \
│  │ \
│  ├─ background/ \
│  │  └─ index.ts            # auth, API proxy \
│  │ \
│  ├─ shared/ \
│  │  ├─ api.ts              # backend calls \
│  │  ├─ storage.ts          # chrome.storage wrapper \
│  │  └─ constants.ts \
│  │ \
│  └─ env.d.ts \
│ \
├─ tailwind.config.js \
├─ postcss.config.js \
├─ vite.config.ts \
├─ tsconfig.json \
└─ package.json \
