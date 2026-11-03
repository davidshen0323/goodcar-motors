import './tailwind.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from './shared/i18n/I18nProvider';
import ErrorBoundary from './shared/components/ErrorBoundary';
import App from './App';
import './styles.css';
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <I18nProvider>
          <App />
        </I18nProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
