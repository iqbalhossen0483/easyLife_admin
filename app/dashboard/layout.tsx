import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/20">
      {/* Sidebar will go here */}
      <aside className="w-64 border-r bg-background hidden md:flex flex-col">
        <div className="p-4 border-b font-bold text-xl">EasyLife Admin</div>
        <nav className="flex-1 p-4 space-y-2">{/* Navigation links */}</nav>
      </aside>

      <main className="flex-1 overflow-y-auto relative">{children}</main>
    </div>
  );
}
