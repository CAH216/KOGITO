import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL
console.log('Seed DB URL available:', !!connectionString)

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function seedMathGalaxy(prisma: PrismaClient) {
  console.log("Seeding Math Galaxy...");

  // 1. Create Nodes
  const nodes = [
    // Level 1: Basics
    { slug: 'math-arithmetic', name: 'Arithmétique', x: 0, y: 0, color: '#fbbf24' }, // Amber
    { slug: 'math-numbers', name: 'Nombres Entiers', x: -10, y: 10, color: '#fbbf24' },
    
    // Level 2: Geometry Base
    { slug: 'math-geometry-shapes', name: 'Formes de Base', x: 20, y: 0, color: '#34d399' }, // Emerald
    
    // Level 3: Algebra Intro
    { slug: 'math-variables', name: 'Variables (x, y)', x: 0, y: 20, color: '#60a5fa' }, // Blue
    
    // Level 4: Pre-Pythagore
    { slug: 'math-triangles', name: 'Triangles', x: 20, y: 10, color: '#34d399' },
    { slug: 'math-coordinates', name: 'Coordonnées', x: 10, y: 15, color: '#fbbf24' },
    
    // Level 5: The Boss
    { slug: 'math-pythagore', name: 'Théorème de Pythagore', x: 25, y: 25, color: '#818cf8', radius: 15 }, // Indigo, Bigger
    
    // Side Quest
    { slug: 'math-fractions', name: 'Fractions', x: -20, y: 0, color: '#f87171' }, // Red
  ];
  
  const createdNodes: Record<string, string> = {}; // slug -> id

  for (const n of nodes) {
    const node = await prisma.conceptNode.upsert({
      where: { slug: n.slug },
      update: {},
      create: {
        slug: n.slug,
        name: n.name,
        subject: 'MATHS',
        x: n.x,
        y: n.y,
        color: n.color,
        radius: n.radius || 10
      }
    });
    createdNodes[n.slug] = node.id;
  }

  // 2. Create Edges
  const edges = [
    { from: 'math-numbers', to: 'math-arithmetic' },
    { from: 'math-arithmetic', to: 'math-fractions' },
    { from: 'math-arithmetic', to: 'math-variables' },
    
    { from: 'math-geometry-shapes', to: 'math-triangles' },
    { from: 'math-variables', to: 'math-coordinates' },
    
    // The Path to Pythagore
    { from: 'math-triangles', to: 'math-pythagore' },
    { from: 'math-variables', to: 'math-pythagore' }, // Need algebra to solve a^2 + b^2
  ];

  for (const e of edges) {
    const sourceId = createdNodes[e.from];
    const targetId = createdNodes[e.to];
    
    if (sourceId && targetId) {
      await prisma.conceptEdge.upsert({
        where: {
          sourceId_targetId: { sourceId, targetId }
        },
        update: {},
        create: { sourceId, targetId }
      });
    }
  }

  console.log("Galaxy Seeded!");
}


async function main() {
  await seedMathGalaxy(prisma);

  const hashedPassword = await bcrypt.hash('admin123', 10)
  const parentPassword = await bcrypt.hash('tuteur123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@kogito.com' },
    update: {},
    create: {
      email: 'admin@kogito.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  })
  
  // Create Test Parent for Demo
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@gmail.com' }, // Renamed for clarity
    update: {
        password: parentPassword,
        role: UserRole.PARENT,
        parentProfile: {
            upsert: {
                create: {
                   children: {
                      create: [
                          { name: 'Léo', grade: 'CM2' },
                          { name: 'Sarah', grade: '3ème' }
                      ]
                   }
                },
                update: {}
            }
        }
    },
    create: {
      email: 'parent@gmail.com',
      name: 'Parent Test',
      password: parentPassword,
      role: UserRole.PARENT,
      parentProfile: {
          create: {
              children: {
                  create: [
                      { name: 'Léo', grade: 'CM2' },
                      { name: 'Sarah', grade: '3ème' }
                  ]
              }
          }
      }
    },
  })

  // Create REAL Tutor Account
  const tutorUser = await prisma.user.upsert({
      where: { email: 'tuteur@gmail.com' }, // This WAS the parent, now overwriting or using separate?
      // User asked for "tuteur@gmail.com" to be the tutor. 
      // I will update the existing record to be a TUTOR role and remove parent specific links if possible, 
      // or just force update it.
      update: {
          password: parentPassword, // same password 'tuteur123'
          role: UserRole.TUTOR,
          tutorProfile: {
              upsert: {
                  create: {
                      status: 'APPROVED',
                      bio: 'Professeur de Mathématiques certifié.',
                      subjects: ['Maths', 'Physique'],
                      isVerified: true
                  },
                  update: { status: 'APPROVED' }
              }
          }
      },
      create: {
          email: 'tuteur@gmail.com',
          name: 'Professeur Kogito',
          password: parentPassword,
          role: UserRole.TUTOR,
          tutorProfile: {
              create: {
                  status: 'APPROVED',
                  bio: 'Professeur de Mathématiques certifié.',
                  subjects: ['Maths', 'Physique'],
                  isVerified: true
              }
          }
      }
  })

  // Create REAL Employee Account
  const employeePassword = await bcrypt.hash('employe123', 10)
  const employeeUser = await prisma.user.upsert({
    where: { email: 'sophie.martin@kogito.com' },
    update: {
        password: employeePassword,
        role: UserRole.EMPLOYEE,
        name: 'Sophie Martin',
    },
    create: {
      email: 'sophie.martin@kogito.com',
      name: 'Sophie Martin',
      password: employeePassword,
      role: UserRole.EMPLOYEE,
    }
  })

  console.log('Admin account created:', admin)
  console.log('Parent account created:', parentUser)
  console.log('Tutor account created:', tutorUser)
  console.log('Employee account created:', employeeUser)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
