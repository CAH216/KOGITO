'use server';

import { prisma } from '@/lib/prisma';
import { TutorStatus } from '@prisma/client';

export interface TutorSearchFilters {
  subject?: string;
  maxPrice?: number;
  grade?: string; // Not in TutorProfile directly but maybe implied or added later
}

export async function searchTutors(filters?: TutorSearchFilters) {
  const whereClause: any = {
    status: TutorStatus.APPROVED,
    // isVerified: true, // Removed strict verification for now to match Student Page
  };

  if (filters?.subject && filters.subject !== 'all') {
    whereClause.subjects = {
      has: filters.subject
    };
  }

  if (filters?.maxPrice) {
    whereClause.hourlyRate = {
      lte: filters.maxPrice
    };
  }

  const tutors = await prisma.tutorProfile.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          name: true,
          image: true,
        }
      },
      _count: {
        select: {
            sessions: true // To show experience/activity
        }
      }
    },
    orderBy: {
       rating: 'desc'
    }
  });

  return tutors;
}
