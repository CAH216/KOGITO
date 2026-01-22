
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

dotenv.config();

// Replicate the client creation logic
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'parent@gmail.com';
  const password = 'passer123';
  console.log(`Hashing password for ${email}...`);
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`Searching for user...`);
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log(`User ${email} not found.`);
    return;
  }

  console.log(`Updating user...`);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log(`Password for ${email} updated successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
