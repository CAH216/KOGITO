'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function getUserProfiles() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return null; 
  }

  // Get User with ParentProfile and Children
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      parentProfile: {
        include: {
          children: true
        }
      }
    }
  });

  if (!user) {
    return null;
  }

  return {
    user: {
        id: user.id,
        name: user.name || 'Parent',
        image: user.image,
        role: user.role,
        balance: user.parentProfile?.hoursBalance || 0 // Added balance
    },
    students: user.parentProfile?.children || []
  };
}

export async function selectStudentProfile(studentId: string) {
    'use server';
    const cookieStore = await cookies();
    cookieStore.set('currentStudentId', studentId);
    // return { success: true };
}

export async function getCurrentStudentProfile() {
    const cookieStore = await cookies();
    const studentId = cookieStore.get('currentStudentId')?.value;

    if (!studentId) return null;

    const student = await prisma.student.findUnique({
        where: { id: studentId }
    });
    
    return student;
}
