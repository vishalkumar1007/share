import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./reduxSetup/app/store.js";
import { ThemeProvider } from "./theme/ThemeContext.jsx";
import AppToaster from "./components/AppToaster.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AppToaster />
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
