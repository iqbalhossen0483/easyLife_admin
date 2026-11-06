"use client";

import { useAppSelector } from "@/store";
import { useGetProfileQuery } from "@/store/feature/authApi";
import ScreenLoader from "../shared/ScreenLoader";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useGetProfileQuery();
  const { user } = useAppSelector((state) => state.auth);

  if (isLoading) return <ScreenLoader />;
  if (!user) return null;
  return children;
};

export default AuthProvider;
