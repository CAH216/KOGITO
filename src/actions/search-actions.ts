'use server';

import { prisma } from '@/lib/prisma';
import { TutorStatus } from '@prisma/client';

export interface TutorSearchFilters {
  subject?: string;
  maxPrice?: number;
  grade?: string;
  organizationId?: string | null; // Null means "Public Only", Undefined means "All/Default", String means "Specific Org"
}

export async function searchTutors(filters?: TutorSearchFilters) {
  const whereClause: any = {
    status: TutorStatus.APPROVED,
  };

  if (filters?.organizationId !== undefined) {
      whereClause.organizationId = filters.organizationId;
  }


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
