import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type ScreenLoaderProps = {
  label?: string;
  className?: string;
};

function ScreenLoader({ label, className }: ScreenLoaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-background",
        className,
      )}
    >
      <Spinner className="size-8 text-primary" />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}

export default ScreenLoader;
