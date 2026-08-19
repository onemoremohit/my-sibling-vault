/**
 * Utility functions for Google Analytics (GA4) custom event tracking
 */

export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPageView = (path) => {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-YSTY4ZG6E9';
  if (typeof window !== 'undefined' && typeof window.gtag === 'function' && gaId) {
    window.gtag('config', gaId, {
      page_path: path,
    });
  }
};
