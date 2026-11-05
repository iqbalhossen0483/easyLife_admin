import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_APP_API_URL,
    prepareHeaders: (headers) => {
      const tenantId = process.env.NEXT_PUBLIC_APP_TENANT_ID;
      if (tenantId) {
        headers.set("x-tenant-id", tenantId);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["User"],
});
