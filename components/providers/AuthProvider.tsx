"use client";

import { useAppSelector } from "@/store";
import { useGetProfileQuery } from "@/store/feature/authApi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ScreenLoader from "../shared/ScreenLoader";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isError } = useGetProfileQuery();
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isError) router.push("/auth/login");
  }, [isLoading, isError, router]);

  if (isLoading) return <ScreenLoader />;
  if (!user) return null;
  return children;
};

export default AuthProvider;
