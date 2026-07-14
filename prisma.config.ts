import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Must be a PostgreSQL connection string (e.g. from Neon).
    // Set DATABASE_URL in .env locally and in Vercel environment variables.
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
