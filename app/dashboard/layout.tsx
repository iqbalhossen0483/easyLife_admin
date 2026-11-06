import { auth } from "@/auth";
import AuthProvider from "@/components/providers/AuthProvider";
import AppSidebar from "@/components/shared/AppSidebar";
import DashboardHeader from "@/components/shared/DashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

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
