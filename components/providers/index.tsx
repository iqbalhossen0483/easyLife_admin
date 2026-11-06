"use client";

import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
import { TooltipProvider } from "../ui/tooltip";
import { ReduxProvider } from "./ReduxProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider>
        <TooltipProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </TooltipProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
