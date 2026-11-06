import {
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  ProfileResponse,
} from "@/types/auth";
import { logout, setAuth } from "../reducer/authSlice";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
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
    }),
    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: "/auth/get-profile",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log("result", result);
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
        try {
          dispatch(logout());
        } catch {
          dispatch(logout());
        }
      },
    }),
  }),
});

export const { useLoginMutation, useGetProfileQuery, useLogoutMutation } =
  authApi;
