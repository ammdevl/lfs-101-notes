import { createContext, useContext, useState, useEffect, useCallback } from "react";
import MODULES from "@data/modules";

const ProgressContext = createContext();

const PROGRESS_COOKIE = "lfs101_progress";
const COOKIE_DAYS = 365;
const LAST_VISITED_KEY = "lfs101_last_visited";

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

function isValidModuleId(id) {
  return typeof id === "string" && MODULES.some((m) => m.id === id);
}

export function ProgressProvider({ children }) {
  const [progressData, setProgressData] = useState({});
  const [lastVisitedId, setLastVisitedIdState] = useState(null);

  // Load progress + last-visited module from storage on mount
  useEffect(() => {
    const visited = localStorage.getItem(LAST_VISITED_KEY);
    if (isValidModuleId(visited)) setLastVisitedIdState(visited);

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

  const saveProgress = useCallback((data) => {
    setCookie(PROGRESS_COOKIE, JSON.stringify(data), COOKIE_DAYS);
  }, []);

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

  // Remember the module the learner is reading ("Continue learning" card)
  const setLastVisited = useCallback((moduleId) => {
    if (!isValidModuleId(moduleId)) return;
    setLastVisitedIdState(moduleId);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(LAST_VISITED_KEY, moduleId);
    }
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        progressData,
        completed,
        total: MODULES.length,
        isCompleted,
        toggleComplete,
        lastVisitedId,
        setLastVisited,
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
