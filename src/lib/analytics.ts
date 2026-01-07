const MEASUREMENT_ID = "G-HLV32W95T0";
const CONSENT_KEY = "eaw_cookie_consent";
const GA_SCRIPT_ID = "ga4-gtag";

type ConsentStatus = "accepted" | "declined";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

let isInitialized = false;
let isLoadingScript = false;

const getCookieValue = (name: string) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

const initGtag = () => {
  if (isInitialized || typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, { anonymize_ip: true });
  isInitialized = true;
};

export const hasConsent = (): ConsentStatus | null => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(CONSENT_KEY) as ConsentStatus | null;
  if (stored === "accepted" || stored === "declined") return stored;
  const cookie = getCookieValue(CONSENT_KEY) as ConsentStatus | null;
  if (cookie === "accepted" || cookie === "declined") return cookie;
  return null;
};

export const enableAnalytics = () => {
  if (typeof window === "undefined") return;
  if (window[`ga-disable-${MEASUREMENT_ID}`]) {
    window[`ga-disable-${MEASUREMENT_ID}`] = false;
  }
  initGtag();
  if (document.getElementById(GA_SCRIPT_ID) || isLoadingScript) return;
  isLoadingScript = true;
  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  script.onload = () => {
    isLoadingScript = false;
  };
  script.onerror = () => {
    isLoadingScript = false;
  };
  document.head.appendChild(script);
};

export const disableAnalytics = () => {
  if (typeof window === "undefined") return;
  window[`ga-disable-${MEASUREMENT_ID}`] = true;
};

export const trackPageView = (path?: string) => {
  if (typeof window === "undefined" || !window.gtag) return;
  const pagePath =
    path ?? `${window.location.pathname}${window.location.search}`;
  window.gtag("event", "page_view", { page_path: pagePath });
};
