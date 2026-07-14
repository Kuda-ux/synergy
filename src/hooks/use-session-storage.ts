import { useCallback, useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getStoredString(key: string | null): string | null {
  if (typeof window === "undefined" || !key) return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Read a string from `sessionStorage` safely with SSR/hydration fallback. */
export function useSessionStorageString(key: string | null): string | null {
  const getSnapshot = useCallback(() => getStoredString(key), [key]);
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
