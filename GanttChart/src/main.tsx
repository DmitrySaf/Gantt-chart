import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux/es/exports";

import store from "./store/store";
import App from "./Components/App/App";

import './assets/css/styles.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
)
