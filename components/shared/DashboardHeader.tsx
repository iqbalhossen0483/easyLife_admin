"use client";

import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAppSelector } from "@/store";
import { Bell, Building2, Wallet } from "lucide-react";
import React from "react";

export default function DashboardHeader() {
  const { user, database } = useAppSelector((state) => state.auth);

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    })
      .format(val || 0)
      .replace("BDT", "৳");
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="h-4 w-px bg-border hidden sm:block" />
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <Building2 className="size-4 text-muted-foreground" />
          <span className="font-medium text-foreground">
            {database?.title || "Dealership Portal"}
          </span>
          <Badge variant="outline" className="text-[10px] uppercase font-mono">
            {user?.designation?.replace("_", " ") || "Staff"}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && typeof user.have_money === "number" && (
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
            <Wallet className="size-3.5" />
            <span className="hidden sm:inline">Cash In Hand:</span>
            <span>{formatCurrency(user.have_money)}</span>
          </div>
        )}

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}
