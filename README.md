# Frontend (Extension) de Cliro Notes para el MVP
Este repositorio sirve para todo lo que modificara el DOM y todo lo que se use directamente de la extension o con lo que el usuario interactue. \
Se desarrollara en JavaScript y React + Vite

## Cómo se ejecuta este proyecto?
```bash
npm run build
``` 
\+ Chrome Extensions

**Qué hace?**
- Genera el bundle final en dist/ 
- Prepara el proyecto para Chrome (Manifest V3)

**Cómo se prueba?**
- Ir a chrome://extensions
- Activar Developer Mode
- Load unpacked → seleccionar dist/

**Qué ve el desarrollador?**
- El popup real al hacer click en el icono
- El content script actuando dentro de páginas web
- El background ejecutándose en segundo plano

👉 Esta es la experiencia real del usuario final


## Qué pasa si uso 'npm run dev'?
```bash
npm run dev       → Para ejecutar de forma local
```
- Levanta un servidor local con Vite (ej. localhost:5173)
- Sirve solo la UI del popup en modo desarrollo (Lo que ve el usuario al hacer clic en el icono de la extensión)

**Qué NO ves al usar 'npm run dev'?**
- Content scripts
- Background logic
- Comportamiento real dentro de páginas web (todo lo que modifica el DOM o la herramienta en si)

---
## Estructura / Arquitectura
Buscar video en YT de Extensiones de Google con React \
```bash
popup/       → Lo que ve el usuario al hacer clic en el icono de la extensión
content/     → Se ejecuta dentro de páginas web (detecta la selección de texto y el contexto)
background/  → Cerebro de la extensión (llamadas de IA, autenticación, estado)
shared/      → Lógica reutilizable (API, almacenamiento, constantes)
public/      → Recursos necesarios para Chrome (manifiesto, iconos)
```


### Qué es cada cosa?
📌 _**popup/ (Territorio React, es lo que aparece cuando el usuario da click al icono superior de la extension)**_
- Toda la interfaz de usuario
- Toda la lógica React
- Todos los ganchos

📌 _**content/ (Autoridad DOM)**_
- Lee el texto seleccionado (aquí es donde debe ir window.getSelection())
- Inyecta resaltados/superposiciones de interfaz de usuario
- Envía mensajes al fondo

📌 _**background/ (Broker de confianza)**_
- Almacena tokens de autenticación
- Se comunica con FastAPI
- Aplica limitación de velocidad
- Recibe mensajes de popup/content

