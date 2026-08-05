import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PacketProvider } from './context/PacketContext';
import App from './App';
import './assets/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PacketProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#32302e',
              color: '#f5f0ec',
              fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
              fontSize: '14px',
              borderRadius: '12px',
            },
            success: { iconTheme: { primary: '#006d37', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ba1a1a', secondary: '#fff' } },
          }}
        />
      </PacketProvider>
    </BrowserRouter>
  </React.StrictMode>
);
