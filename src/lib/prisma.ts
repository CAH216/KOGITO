import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as { prismaV3: PrismaClient }

const prismaClientSingleton = () => {
    // Fallback to Render DB if env is missing (for Vercel deployment without env var set)
    const connectionString = process.env.DATABASE_URL || "postgresql://db_36g6_user:FXolWwWqZNb3bri18ouLmFh4egTmgT3M@dpg-d5p8bvf5c7fs73bge4u0-a.virginia-postgres.render.com/db_36g6"
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prismaV3 || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  // invalidating cache for HMR
  globalForPrisma.prismaV3 = prisma;
}
