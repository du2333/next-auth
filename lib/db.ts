import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

// 防止在开发环境中开启多个PrismaClient
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
