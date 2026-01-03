# Frontend (Extension) de Cliro Notes para el MVP
Este repositorio sirve para todo lo que modificara el DOM y todo lo que se use directamente de la extension o con lo que el usuario interactue. \
Se desarrollara en JavaScript y React + Vite

## Estructura / Arquitectura
Buscar video en YT de Extensiones de Google con React \
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

### Qué es cada cosa?
📌 _**popup/ (Territorio React, es lo que aparece cuando el usuario da click al icono superior de la extension)**_
-> Toda la interfaz de usuario
-> Toda la lógica React
-> Todos los ganchos

📌 _**content/ (Autoridad DOM)**_
-> Lee el texto seleccionado
-> Inyecta resaltados/superposiciones de interfaz de usuario
-> Envía mensajes al fondo

•  No se usa React aquí  •  TypeScript/JavaScript simple  •  Aquí es donde debe ir window.getSelection()



📌 _**background/ (Broker de confianza)**_
-> Almacena tokens de autenticación
-> Se comunica con FastAPI
-> Aplica limitación de velocidad
-> Recibe mensajes de popup/content

