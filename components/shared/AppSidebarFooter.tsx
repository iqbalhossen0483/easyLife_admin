"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/types/auth";
import { ChevronsUpDown, LogOut, UserCheck } from "lucide-react";
import Link from "next/link";

type Props = {
  user: User;
  onLogout: () => Promise<void>;
};

export default function AppSidebarFooter({ onLogout, user }: Props) {
  const { isMobile } = useSidebar();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
              <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
                <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs uppercase">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="truncate text-sm font-semibold leading-tight text-foreground">
                    {user.name}
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground capitalize">
                    {user.designation?.replace("_", " ")}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground/70" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-64 rounded-xl p-2 shadow-xl ring-1 ring-border"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={8}
            >
              {/* User Identity Header */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-2 font-normal">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {user.phone}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Navigation Shortcuts */}
              <DropdownMenuGroup>
                <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
                  <UserCheck className="size-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Sign Out Action */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={onLogout}
                  className="cursor-pointer gap-2"
                >
                  <LogOut className="size-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
