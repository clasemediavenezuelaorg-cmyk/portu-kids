
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to render App:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: sans-serif; background: #fff5f5; color: #c53030; border: 2px solid #feb2b2; border-radius: 8px; margin: 20px;">
      <h1 style="font-size: 24px; margin-bottom: 10px;">¡Ops! Algo salió mal</h1>
      <p>La aplicación no pudo iniciarse correctamente.</p>
      <pre style="text-align: left; background: #eee; padding: 10px; border-radius: 4px; overflow: auto; font-size: 12px;">${error instanceof Error ? error.message : String(error)}</pre>
      <button onclick="window.location.reload()" style="background: #c53030; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Reintentar</button>
    </div>
  `;
}
