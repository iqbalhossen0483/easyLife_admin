"use client";

import { Badge } from "@/components/ui/badge";
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/reducer/authSlice";
import {
  ArrowLeftRight,
  Building2,
  ChevronsUpDown,
  LogOut,
  Settings,
  UserCircle,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NavUser() {
  const dispatch = useAppDispatch();
  const { user, database } = useAppSelector((state) => state.auth);
  const { isMobile } = useSidebar();

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    })
      .format(val || 0)
      .replace("BDT", "৳");
  };

  const handleSignOut = () => {
    dispatch(logout());
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="h-12 w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
              <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs uppercase">
                {user?.name?.charAt(0) || <UserCircle className="size-5" />}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="truncate text-sm font-semibold leading-tight text-foreground">
                  {user?.name || "User"}
                </span>
                <span className="truncate text-[11px] text-muted-foreground capitalize">
                  {user?.designation?.replace("_", " ") || "Member"}
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
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user?.name || "Active User"}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono truncate">
                      {user?.phone || ""}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-1.5 pt-2 border-t text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground truncate">
                    <Building2 className="size-3.5 shrink-0" />
                    <span className="truncate">
                      {database?.title || "Company"}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-mono shrink-0"
                  >
                    {user?.designation?.replace("_", " ") || "Staff"}
                  </Badge>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            {/* Financial Status Quick View */}
            {user && typeof user.have_money === "number" && (
              <>
                <DropdownMenuSeparator />
                <div className="p-2 bg-muted/40 rounded-lg mx-1 my-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Wallet className="size-3.5 text-primary" />
                      Cash in Hand:
                    </span>
                    <span className="font-semibold text-primary font-mono">
                      {formatCurrency(user.have_money)}
                    </span>
                  </div>
                </div>
              </>
            )}

            <DropdownMenuSeparator />

            {/* Navigation Shortcuts */}
            <DropdownMenuGroup>
              <DropdownMenuItem
                render={<Link href="/dashboard/finance/transactions" />}
              >
                <ArrowLeftRight className="size-4" />
                <span>Balance Transfers</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                render={<Link href="/dashboard/settings/tenant" />}
              >
                <Settings className="size-4" />
                <span>Tenant Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Sign Out Action */}
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={handleSignOut}
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
  );
}
