import { createContext, useContext, useState, useEffect, useCallback } from "react";
import MODULES from "@data/modules";

const ProgressContext = createContext();

const PROGRESS_COOKIE = "lfs101_progress";
const COOKIE_DAYS = 365;
const COOKIE_CONSENT_KEY = "lfs101_cookies_accepted";
const CONSENT_MAX_AGE_DAYS = 30;

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name, value, days) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = location.protocol === "https:" ? ";Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax${secure}`;
}

function getConsent() {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const age = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);
    if (age > CONSENT_MAX_AGE_DAYS) {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      return null;
    }
    return data.value;
  } catch {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    return null;
  }
}

export function ProgressProvider({ children }) {
  const [progressData, setProgressData] = useState({});
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Load progress from cookie on mount
  useEffect(() => {
    const consent = getConsent();
    setCookiesAccepted(consent === "accepted");

    if (!consent) {
      setShowBanner(true);
      return;
    }

    const raw = getCookie(PROGRESS_COOKIE);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return;

      const validIds = new Set(MODULES.map((m) => m.id));
      const cleaned = {};
      for (const [key, val] of Object.entries(parsed)) {
        if (validIds.has(key) && val && typeof val === "object" && typeof val.completed === "boolean") {
          cleaned[key] = { completed: val.completed, updatedAt: val.updatedAt || null };
        }
      }
      setProgressData(cleaned);
    } catch {
      // ignore
    }
  }, []);

  const saveProgress = useCallback(
    (data) => {
      if (!cookiesAccepted) return;
      setCookie(PROGRESS_COOKIE, JSON.stringify(data), COOKIE_DAYS);
    },
    [cookiesAccepted]
  );

  const toggleComplete = useCallback(
    (moduleId) => {
      setProgressData((prev) => {
        const newState = !prev[moduleId]?.completed;
        const updated = {
          ...prev,
          [moduleId]: {
            completed: newState,
            updatedAt: new Date().toISOString(),
          },
        };
        saveProgress(updated);
        return updated;
      });
    },
    [saveProgress]
  );

  const isCompleted = useCallback(
    (moduleId) => progressData[moduleId]?.completed === true,
    [progressData]
  );

  const completed = Object.values(progressData).filter((p) => p.completed).length;

  const acceptCookies = useCallback(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(
        COOKIE_CONSENT_KEY,
        JSON.stringify({ value: "accepted", timestamp: Date.now() })
      );
    }
    setCookiesAccepted(true);
    setShowBanner(false);
    // Reload progress from cookie
    const raw = getCookie(PROGRESS_COOKIE);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setProgressData(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  const declineCookies = useCallback(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(
        COOKIE_CONSENT_KEY,
        JSON.stringify({ value: "declined", timestamp: Date.now() })
      );
    }
    setCookiesAccepted(false);
    setShowBanner(false);
    setProgressData({});
    setCookie(PROGRESS_COOKIE, "", -1);
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        progressData,
        completed,
        total: MODULES.length,
        isCompleted,
        toggleComplete,
        showBanner,
        acceptCookies,
        declineCookies,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
