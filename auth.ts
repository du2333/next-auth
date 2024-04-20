import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

// 自己来扩展默认的属性
declare module "next-auth" {
  interface Session {
    user: {
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "USER";
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    // 自定义错误页面
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  // 修改回调函数逻辑，比如要往token，session里添加自定义属性，自定义登录逻辑
  callbacks: {
    async signIn({ user, account }) {
      // Allow Oauth login
      if (account?.provider !== "credentials") return true;

      if (user.id) {
        const existingUser = await getUserById(user.id);

        // Prevent sign in without email verification
        if (!existingUser?.emailVerified) return false;

        // Check 2FA
        if (existingUser.isTwoFactorEnabled) {
          // check if the 2FA code has been verified
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
            existingUser.id
          );

          if (!twoFactorConfirmation) return false;

          // delete the 2FA confirmation for the next log in
          await db.twoFactorConfirmation.delete({
            where: {
              id: twoFactorConfirmation.id,
            },
          });
        }
      } else {
        return false;
      }

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      // 把user role传递给 token
      token.role = existingUser.role;

      return token;
    },
    async session({ session, token }) {
      // 这里的token就是jwt token，里面的sub属性就是数据库自动生成的对应的id
      if (token.sub && session.user) {
        // 把它添加到session里，这样子浏览器端也可以访问到此id
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        // 把它添加到session里，这样子浏览器端也可以访问到此id
        session.user.role = token.role;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
