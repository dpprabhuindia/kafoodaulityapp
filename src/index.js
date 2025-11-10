import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { I18nProvider } from './i18n/I18nProvider';

ReactDOM.render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
