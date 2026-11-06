import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_APP_API_URL,
    credentials: "include",
    prepareHeaders: async (headers) => {
      const tenantId = process.env.NEXT_PUBLIC_APP_TENANT_ID;
      if (tenantId) {
        headers.set("x-tenant-id", tenantId);
      }
      const session = await getSession();
      if (session?.accessToken) {
        headers.set("Authorization", `Bearer ${session.accessToken}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "Product",
    "Supplier",
    "Purchase",
    "Order",
    "Customer",
    "Expense",
    "Transaction",
    "Target",
    "Dashboard",
  ],
});
