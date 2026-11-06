"use client";

import { TooltipProvider } from "../ui/tooltip";
import AuthProvider from "./AuthProvider";
import { ReduxProvider } from "./ReduxProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <TooltipProvider>
        <AuthProvider>{children}</AuthProvider>
      </TooltipProvider>
    </ReduxProvider>
  );
}
