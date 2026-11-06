"use client";

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
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/reducer/authSlice";
import {
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Truck,
  UserCircle,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function AppSidebar() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  console.log(user);

  const navGroups = [
    {
      group: "Main",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      group: "Management",
      items: [
        { title: "Inventory", href: "/inventory", icon: Package },
        { title: "Finance", href: "/finance", icon: Wallet },
        { title: "Employees", href: "/employees", icon: Users },
        { title: "Dealers", href: "/dealers", icon: Truck },
      ],
    },
    {
      group: "System",
      items: [{ title: "Settings", href: "/settings", icon: Settings }],
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2 font-bold">
          <div className="size-8 shrink-0 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
            E
          </div>
          <span className="truncate">EasyLife Admin</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group, idx) => (
          <SidebarGroup key={idx}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton isActive={pathname === item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex items-center gap-2">
                <UserCircle />
                <p>{user?.name}</p>
                <div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.designation}
                  </p>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => dispatch(logout())}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
