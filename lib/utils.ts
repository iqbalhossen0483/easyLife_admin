import { UserRole } from "@/types/auth";

export { cn } from "cn";

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  })
    .format(val)
    .replace("BDT", "৳");
};

export const isRole = (designation: UserRole, roles: UserRole[]) => {
  if (!roles || roles.length === 0) return false;
  return roles.includes(designation);
};
