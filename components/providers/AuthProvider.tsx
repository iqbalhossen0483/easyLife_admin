"use client";

import { useGetProfileQuery } from "@/store/feature/authApi";
import { Suspense } from "react";

function ProfileLoader() {
  useGetProfileQuery();
  return null;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Suspense fallback={null}>
        <ProfileLoader />
      </Suspense>
      {children}
    </>
  );
};

export default AuthProvider;
