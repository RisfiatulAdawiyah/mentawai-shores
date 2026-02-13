// Google Analytics 4 Integration
type GtagFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFunction;
    dataLayer?: unknown[];
  }
}

export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || "";

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID) {
    console.warn("Google Analytics tracking ID not found");
    return;
  }

  // Load gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_TRACKING_ID, {
    page_path: window.location.pathname,
  });
};

// Track page views
export const trackPageView = (url: string) => {
  if (!window.gtag) return;
  
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

// Track events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (!window.gtag) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track property views
export const trackPropertyView = (propertyId: number, propertyTitle: string) => {
  trackEvent("view_property", "Property", propertyTitle, propertyId);
};

// Track search
export const trackSearch = (searchTerm: string, filters?: Record<string, unknown>) => {
  trackEvent("search", "Property Search", searchTerm);
};

// Track contact form submission
export const trackContactForm = (formType: string) => {
  trackEvent("submit_form", "Contact", formType);
};

// Track property inquiry
export const trackPropertyInquiry = (propertyId: number) => {
  trackEvent("property_inquiry", "Lead", `Property ${propertyId}`, propertyId);
};

// Performance monitoring
interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
}

export const reportWebVitals = (metric: WebVitalsMetric) => {
  if (!window.gtag) return;

  window.gtag("event", metric.name, {
    event_category: "Web Vitals",
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
  });
};
