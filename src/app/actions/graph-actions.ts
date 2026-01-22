'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export interface GraphNode {
  id: string;
  slug: string;
  name: string;
  x: number;
  y: number;
  val: number; // radius
  color: string;
  status: 'LOCKED' | 'UNLOCKED' | 'MASTERED';
}

export interface GraphLink {
  source: string;
  target: string;
}

export async function getStudentKnowledgeGraph() {
  const cookieStore = await cookies();
  const currentStudentId = cookieStore.get('currentStudentId')?.value;
  
  if (!currentStudentId) return null;
  
  let profile = await prisma.kogitoStudentProfile.findUnique({
    where: { studentId: currentStudentId }
  });
  
  if (!profile) {
     // Auto-create profile to enable Galaxy view
     profile = await prisma.kogitoStudentProfile.create({
         data: { studentId: currentStudentId }
     });
  }

  // 1. Fetch the Universe
  const nodes = await prisma.conceptNode.findMany();
  const edges = await prisma.conceptEdge.findMany();
  
  // 2. Fetch User Progress
  const mastery = await prisma.kogitoConceptMastery.findMany({
    where: { studentProfileId: profile.id },
    include: { conceptNode: true }
  });
  
  const masteryMap = new Map<string, string>(); // conceptId -> status
  mastery.forEach(m => {
    if (m.conceptId) masteryMap.set(m.conceptId, m.status);
  });
  
  // 3. Transform for Graph (e.g., React-Force-Graph)
  const graphNodes: GraphNode[] = nodes.map(n => {
    const status = (masteryMap.get(n.id) as any) || 'LOCKED';
    
    // Logic: If not master/wip, is it unlocked?
    // A node is unlocked if parents are met. Complexity for later.
    // For now, let's say: 
    // - Default: LOCKED
    // - If in DB: WIP/MASTERED
    // - If Parent Mastered: UNLOCKED (ToDo logic)
    
    let color = n.color;
    if (status === 'LOCKED') color = '#9ca3af'; // Gray
    if (status === 'MASTERED') color = '#fbbf24'; // Gold
    
    return {
      id: n.id,
      slug: n.slug,
      name: n.name,
      x: n.x, 
      y: n.y,
      val: n.radius,
      color: color,
      status: status
    };
  });

  const graphLinks: GraphLink[] = edges.map(e => ({
    source: e.sourceId,
    target: e.targetId
  }));

  return { nodes: graphNodes, links: graphLinks };
}
