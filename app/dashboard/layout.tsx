import AuthProvider from "@/components/providers/AuthProvider";
import AppSidebar from "@/components/shared/AppSidebar";
import DashboardHeader from "@/components/shared/DashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
