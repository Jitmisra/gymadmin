import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/main.css';

// Disable StrictMode temporarily to debug white screen issue
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);