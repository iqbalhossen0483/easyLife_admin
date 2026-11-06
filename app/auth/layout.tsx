"use client";
import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [router, user]);

  return children;
};

export default Layout;
