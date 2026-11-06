import { navGroups } from "@/config/nav";
import { isRole } from "@/lib/utils";
import { UserRole } from "@/types/auth";
import Link from "next/link";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

type Props = {
  pathname: string;
  userDesignation: UserRole;
};

const AppSidebarContent = ({ pathname, userDesignation }: Props) => {
  return (
    <SidebarContent>
      {navGroups.map((group, idx) => {
        const visibleItems = group.items.filter((item) =>
          isRole(userDesignation, item.roles),
        );
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
  );
};

export default AppSidebarContent;
