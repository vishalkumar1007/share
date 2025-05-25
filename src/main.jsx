import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "sonner";
import { Provider } from 'react-redux';
import store from './reduxSetup/app/store.js';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Toaster
      position="top-right"
      richColors
      toastOptions={{
        style: {
          border: "1px solid #404143c7",
          fontSize: "17px",
          backdropFilter:"blur(3px)",
          backgroundColor:'transparent',
        },
      }}
    />
    <App />
  </Provider>
)
