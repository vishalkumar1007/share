import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "sonner";

createRoot(document.getElementById('root')).render(
  <>
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
  </>
)
