import { Database } from "@/types/auth";
import { SidebarHeader } from "../ui/sidebar";

const AppSidebarHeader = ({ database }: { database: Database }) => {
  return (
    <SidebarHeader>
      <div className="flex items-center gap-2.5 py-2 font-bold">
        <div className="size-8 shrink-0 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-sm font-black shadow-sm">
          {database.short_title.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="truncate text-sm font-semibold leading-tight">
            {database?.title}
          </span>
          <span className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-mono">
            Tenant #{database?.id}
          </span>
        </div>
      </div>
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
