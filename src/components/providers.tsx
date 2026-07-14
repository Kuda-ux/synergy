"use client";

import { createContext, useContext } from "react";
import { ThemeProvider } from "next-themes";

export interface StoreConfig {
  /** ZWG cents per USD, or null when ZWG display is disabled. */
  zwgCentsPerUsd: number | null;
}

const StoreConfigContext = createContext<StoreConfig>({ zwgCentsPerUsd: null });

export function useStoreConfig(): StoreConfig {
  return useContext(StoreConfigContext);
}

export function Providers({
  config,
  children,
}: {
  config: StoreConfig;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <StoreConfigContext.Provider value={config}>{children}</StoreConfigContext.Provider>
    </ThemeProvider>
  );
}
