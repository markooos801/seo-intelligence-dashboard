import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure window.fetch has both getter and setter in iframe environments
if (typeof window !== 'undefined') {
  try {
    let currentFetch = window.fetch;
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!desc || !desc.set || !desc.writable) {
      Object.defineProperty(window, 'fetch', {
        get: () => currentFetch,
        set: (v) => {
          currentFetch = v;
        },
        configurable: true,
        enumerable: true,
      });
    }
  } catch (_) {}
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
