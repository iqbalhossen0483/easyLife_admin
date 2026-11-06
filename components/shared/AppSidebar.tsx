"use client";

import NavUser from "@/components/shared/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navGroups, UserRole } from "@/config/nav";
import { useAppSelector } from "@/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function AppSidebar() {
  const { user, database } = useAppSelector((state) => state.auth);
  const pathname = usePathname();

  const isRole = (roles?: UserRole[]) => {
    if (!roles || roles.length === 0) return true;
    if (!user?.designation) return true;
    return roles.includes(user.designation as UserRole);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-2 py-2 font-bold">
          <div className="size-8 shrink-0 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-sm font-black shadow-sm">
            {database?.short_title?.charAt(0) || "E"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-semibold leading-tight">
              {database?.title || "EasyLife Admin"}
            </span>
            <span className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-mono">
              Tenant #{database?.id || "v2"}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group, idx) => {
          const visibleItems = group.items.filter((item) => isRole(item.roles));
          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={idx}>
              <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {group.group}
              </SidebarGroupLabel>
              <SidebarMenu>
                {visibleItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                      <SidebarMenuButton
                        isActive={
                          pathname === item.href ||
                          (item.href !== "/dashboard" &&
                            pathname.startsWith(item.href))
                        }
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span className="truncate">{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
