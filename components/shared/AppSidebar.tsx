"use client";

import AppSidebarFooter from "@/components/shared/AppSidebarFooter";
import { Sidebar } from "@/components/ui/sidebar";
import { getErrorMessage } from "@/lib/error";
import { useAppSelector } from "@/store";
import { useLogoutMutation } from "@/store/feature/authApi";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import AppSidebarContent from "./AppSidebarContent";
import AppSidebarHeader from "./AppSidebarHeader";

export default function AppSidebar() {
  const { user, database } = useAppSelector((state) => state.auth);
  const [logOut, { isLoading }] = useLogoutMutation();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logOut().unwrap();
      router.push("/auth/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!user || !database) return null;

  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader database={database} />

      <AppSidebarContent
        pathname={pathname}
        userDesignation={user.designation}
      />

      <AppSidebarFooter
        user={user}
        onLogout={handleLogout}
        isLoggingOut={isLoading}
      />
    </Sidebar>
  );
}
