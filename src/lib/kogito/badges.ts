
import { prisma } from '@/lib/prisma';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  condition: (stats: StudentStats) => boolean;
}

export interface StudentStats {
  totalSessions: number;
  totalMessages: number;
  subjectsExplored: string[];
  daysStreak: number;
  masteryCount: number; // Concepts > 80%
}

export const BADGES: BadgeDefinition[] = [
  {
    id: 'FIRST_STEP',
    name: 'Premier Pas',
    description: 'Avoir lancé sa première session avec Kogito.',
    icon: 'Footprints',
    condition: (stats) => stats.totalSessions >= 1
  },
  {
    id: 'CURIOUS_EXPLORER',
    name: 'Curieux',
    description: 'Avoir posé plus de 10 questions (messages).',
    icon: 'Search',
    condition: (stats) => stats.totalMessages >= 10
  },
  {
    id: 'PERSISTENT',
    name: 'Persévérant',
    description: 'Avoir étudié 3 jours de suite (Simulé pour l\'instant).',
    icon: 'Mountain',
    condition: (stats) => stats.daysStreak >= 3
  },
  {
    id: 'MATH_WIZARD',
    name: 'Apprenti Sorcier',
    description: 'Avoir exploré 3 matières différentes.',
    icon: 'Wand2',
    condition: (stats) => stats.subjectsExplored.length >= 3
  },
  {
    id: 'MASTER_MIND',
    name: 'Grand Maître',
    description: 'Avoir 5 compétences au niveau maximum.',
    icon: 'Crown',
    condition: (stats) => stats.masteryCount >= 5
  }
];

export async function checkBadges(studentProfileId: string, currentBadges: string[] = []): Promise<string[]> {
  // 1. Calculate Stats
  const profile = await prisma.kogitoStudentProfile.findUnique({
    where: { id: studentProfileId },
    include: {
      sessions: { include: { messages: true } },
      mastery: true
    }
  });

  if (!profile) return [];

  const totalSessions = profile.sessions.length;
  const totalMessages = profile.sessions.reduce((acc, s) => acc + s.messages.filter(m => m.role === 'user').length, 0);
  const subjectsExplored = Array.from(new Set(profile.sessions.map(s => s.subject)));
  const masteryCount = profile.mastery.filter(m => m.level >= 80).length;
  
  // TODO: Implement real streak logic
  const daysStreak = 1; 

  const stats: StudentStats = {
    totalSessions,
    totalMessages,
    subjectsExplored,
    daysStreak,
    masteryCount
  };

  // 2. Check Conditions
  const newBadges: string[] = [];

  for (const badge of BADGES) {
    if (!currentBadges.includes(badge.id)) {
      if (badge.condition(stats)) {
        newBadges.push(badge.id);
      }
    }
  }

  // 3. Update DB if new badges
  if (newBadges.length > 0) {
    // Current badges is strictly string[] from the caller, but safely handle JSON
    // We append new badges to the list
    const updatedBadgeList = [...currentBadges, ...newBadges];
    
    await prisma.kogitoStudentProfile.update({
      where: { id: studentProfileId },
      data: {
        badges: updatedBadgeList
      }
    });
  }

  return newBadges;
}
