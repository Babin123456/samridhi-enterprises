import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <ThemeProvider>
      <BrowserRouter>
        <Provider store={store}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </Provider>
      </BrowserRouter>
    </ThemeProvider>
  </HelmetProvider>
);

