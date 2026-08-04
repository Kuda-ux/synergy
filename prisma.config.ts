import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Must be a PostgreSQL connection string (e.g. from Neon).
    // For Neon, use the direct (non-pooled) endpoint here so Prisma Migrate
    // can safely acquire advisory locks. Runtime queries use DATABASE_URL.
    url: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL,
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
