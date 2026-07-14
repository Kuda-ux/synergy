import { useSyncExternalStore } from "react";

/**
 * Returns `true` once the component has mounted on the client.
 * Uses `useSyncExternalStore` so it is safe to use for avoiding hydration
 * mismatches, unlike `useEffect(() => setMounted(true), [])`.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
