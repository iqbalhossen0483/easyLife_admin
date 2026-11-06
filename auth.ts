import { LoginResponse } from "@/types/auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const phone = credentials?.phone as string | undefined;
        const password = credentials?.password as string | undefined;

        const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
        const tenantId = process.env.NEXT_PUBLIC_APP_TENANT_ID;

        if (!phone || !password || !apiUrl || !tenantId) {
          return null;
        }

        const res = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-id": tenantId,
          },
          body: JSON.stringify({ phone, password }),
        });

        const data: LoginResponse = await res.json().catch(() => null);

        if (!res.ok || !data?.success || !data?.data) {
          const errorMessage = data?.message || "Invalid phone or password";
          throw new Error(errorMessage);
        }

        const user = data.data.user;
        return {
          id: String(user.id),
          name: user.name,
          phone: user.phone,
          designation: user.designation,
          token: data.data.token,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.phone = user.phone;
        token.designation = user.designation;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
