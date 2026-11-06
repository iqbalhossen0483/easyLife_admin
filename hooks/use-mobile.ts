import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 767px)";
const TABLET_QUERY = "(min-width: 768px) and (max-width: 1023px)";

function subscribe(query: string, callback: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);

  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(query: string) {
  return window.matchMedia(query).matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobile() {
  return useSyncExternalStore(
    (callback) => subscribe(MOBILE_QUERY, callback),
    () => getSnapshot(MOBILE_QUERY),
    getServerSnapshot,
  );
}

export function useIsTablet() {
  return useSyncExternalStore(
    (callback) => subscribe(TABLET_QUERY, callback),
    () => getSnapshot(TABLET_QUERY),
    getServerSnapshot,
  );
}
