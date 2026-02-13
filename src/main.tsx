import { createRoot } from "react-dom/client";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource-variable/inter";
import App from "./App.tsx";
import "./index.css";
import { initGA } from "./lib/analytics";
import "./i18n"; // Initialize i18n

// Initialize Google Analytics in production
if (import.meta.env.PROD) {
  initGA();
}

// Report Web Vitals in production
if (import.meta.env.PROD) {
  import("web-vitals").then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    import("./lib/analytics").then(({ reportWebVitals }) => {
      onCLS(reportWebVitals);
      onFID(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
