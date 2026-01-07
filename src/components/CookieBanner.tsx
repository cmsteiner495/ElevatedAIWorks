import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  disableAnalytics,
  enableAnalytics,
  hasConsent,
  trackPageView,
} from "@/lib/analytics";

const CONSENT_KEY = "eaw_cookie_consent";
const CONSENT_MAX_DAYS = 180;

const setConsentStorage = (value: "accepted" | "declined") => {
  const expires = new Date();
  expires.setDate(expires.getDate() + CONSENT_MAX_DAYS);
  document.cookie = `${CONSENT_KEY}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  window.localStorage.setItem(CONSENT_KEY, value);
};

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = hasConsent();
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setConsentStorage("accepted");
    enableAnalytics();
    trackPageView();
    setIsVisible(false);
  };

  const handleDecline = () => {
    setConsentStorage("declined");
    disableAnalytics();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto z-40 w-[calc(100%-2rem)] sm:max-w-xl">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/70 p-4 text-sm text-slate-100 shadow-2xl backdrop-blur-md sm:p-5">
        <p className="leading-relaxed text-slate-100/90">
          We use analytics cookies to understand site usage and improve the
          experience. You can opt out anytime.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleAccept}
              className="rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-md transition hover:shadow-lg"
            >
              Accept analytics
            </button>
            <button
              onClick={handleDecline}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-100 transition hover:bg-white/20"
            >
              Decline
            </button>
          </div>
          <Link
            to="/privacy"
            className="text-xs font-medium text-orange-200/80 transition hover:text-orange-200"
          >
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
}
