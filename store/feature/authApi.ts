import { LogoutResponse, ProfileResponse } from "@/types/auth";
import { logout, setAuth } from "../reducer/authSlice";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: "/auth/get-profile",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            setAuth({
              database: result.data.data.database,
              user: result.data.data.user,
            }),
          );
        } catch {
          dispatch(logout());
        }
      },
      providesTags: ["User"],
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch }) {
        dispatch(logout());
      },
    }),
  }),
});

export const { useGetProfileQuery, useLogoutMutation } = authApi;
