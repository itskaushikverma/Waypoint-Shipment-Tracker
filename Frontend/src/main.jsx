import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastPosition, ToastProvider } from 'react-toast-kit-js';
import './index.css';
import App from './App.jsx';
import store from './redux/store';
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider position={ToastPosition.TopRight}>
        <App />
      </ToastProvider>
    </Provider>
  </StrictMode>,
);
