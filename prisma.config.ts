import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:passer@localhost:5432/kogito"
  }
});
