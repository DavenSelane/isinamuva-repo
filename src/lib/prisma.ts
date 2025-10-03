import { PrismaClient } from "@prisma/client";

// Singleton function to avoid creating multiple PrismaClients in dev
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

// Use globalThis to persist Prisma client across hot reloads (Next.js dev)
declare const globalThis: {
  prismaGlobal?: PrismaClient;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Only assign in dev to avoid multiple instances during hot reload
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

// Graceful shutdown in production
if (process.env.NODE_ENV === "production") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}

export const DB = prisma;
