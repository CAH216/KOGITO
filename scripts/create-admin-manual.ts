
import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL not found in .env")
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'admin@kogito.com'
  const password = 'admin123'
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
      create: {
        email,
        name: 'Administrateur Kogito',
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    })
    console.log(`Admin user created/updated: ${admin.email}`)
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
