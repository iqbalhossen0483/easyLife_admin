"use client";

import { Suspense } from "react";
import { TooltipProvider } from "../ui/tooltip";
import { ReduxProvider } from "./ReduxProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <TooltipProvider>
        <Suspense fallback={null}>{children}</Suspense>
      </TooltipProvider>
    </ReduxProvider>
  );
}
