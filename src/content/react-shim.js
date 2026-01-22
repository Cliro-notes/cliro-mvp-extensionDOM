// src/content/react-shim.js
import * as React from 'react';
import ReactDOM from 'react-dom/client';

// Hacer React disponible globalmente
window.React = React;
window.ReactDOM = ReactDOM;
window.createElement = React.createElement;