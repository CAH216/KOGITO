import { prisma } from '@/lib/prisma';

export async function seedMathGalaxy() {
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
