import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { PreferencesProvider } from "./context/PreferencesProvider";
import App from './App.jsx'
import "./styles/global.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PreferencesProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </PreferencesProvider>
  </StrictMode>,
)
