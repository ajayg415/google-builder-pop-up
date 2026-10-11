import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CafeProvider } from './store/cafeStore';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CafeProvider>
      <App />
    </CafeProvider>
  </React.StrictMode>
);
