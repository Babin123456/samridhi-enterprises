import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled Promise rejection:", event.reason);
  event.preventDefault();
});

window.addEventListener("error", (event) => {
  console.error("Global error:", event.error || event.message);
});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ErrorBoundary>
      <HelmetProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </HelmetProvider>
    </ErrorBoundary>
  </BrowserRouter>
);
