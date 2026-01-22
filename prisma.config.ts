import { defineConfig } from 'prisma/config'
import 'dotenv/config'

export default defineConfig({
  migrations: {
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
  datasource: {
    // Defines the database connection for migrations
    url: process.env.DATABASE_URL ?? '',
  },
})
