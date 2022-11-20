import React from 'react';
import ReactDOM from 'react-dom/client';

import App from "./Components/App/App";

import './assets/css/styles.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
