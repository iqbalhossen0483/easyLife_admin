import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";
import * as React from "react";

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
}

function Input({ className, error, ...props }: InputProps) {
  return (
    <InputPrimitive
      data-slot="input"
      className={cn(
        "w-full min-w-0 rounded-sm border bg-transparent px-2.5 py-2 text-base transition-colors outline-none file:inline-flex file:border-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 file:mr-3 file:h-full file:cursor-pointer file:rounded-md file:bg-primary file:px-3 file:text-xs file:font-medium file:text-primary-foreground hover:file:bg-primary/90",
        error
          ? "border-destructive/50 dark:border-destructive placeholder:text-destructive"
          : "border-input placeholder:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
