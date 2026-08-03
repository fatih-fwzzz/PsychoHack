"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

/** Avoid SSR mismatch for zustand persist / localStorage consumers. */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const ready = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  if (!ready) {
    return <div className="min-h-screen" />;
  }
  return <>{children}</>;
}
