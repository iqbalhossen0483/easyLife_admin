"use client";

import AppSidebarFooter from "@/components/shared/AppSidebarFooter";
import { Sidebar } from "@/components/ui/sidebar";
import { useAppSelector } from "@/store";
import { usePathname } from "next/navigation";
import AppSidebarContent from "./AppSidebarContent";
import AppSidebarHeader from "./AppSidebarHeader";

export default function AppSidebar() {
  const { user, database } = useAppSelector((state) => state.auth);
  const pathname = usePathname();

  const handleLogout = async () => {};

  if (!user || !database) return null;

  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader database={database} />

      <AppSidebarContent
        pathname={pathname}
        userDesignation={user.designation}
      />

      <AppSidebarFooter user={user} onLogout={handleLogout} />
    </Sidebar>
  );
}
