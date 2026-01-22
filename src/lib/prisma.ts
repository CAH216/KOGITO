import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as { prismaV2: PrismaClient }

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prismaV2 || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  // invalidating cache for HMR
  globalForPrisma.prismaV2 = prisma;
}
