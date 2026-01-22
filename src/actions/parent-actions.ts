'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addChild(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const name = formData.get('name') as string;
  const grade = formData.get('grade') as string;
  const schoolName = formData.get('schoolName') as string;

  if (!name || !grade) {
      throw new Error("Name and Grade are required");
  }

  // Get Parent Profile ID
  const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { parentProfile: true }
  });

  if (!user || !user.parentProfile) {
      throw new Error("Parent profile not found on user");
  }

  // Handle School (Optional: find existing or create placeholder, or just store string if we change schema later, but schema currently links to School model)
  // For now, let's assume we might need to find a school or leave it null if not implementing full school search yet. 
  // If the user provided a school name, we might want to search for it.
  // For simplicity in this step, I'll skip the School relation linkage unless explicitly required, or create a 'Not Listed' school if needed.
  // Actually, let's check the schema again. School is optional on Student.
  // If the user inputs a school name, ideally we should link it. 
  // Let's keep it simple: Just create the student for now. Linking school is a separate complex feature (search/select).

  await prisma.student.create({
      data: {
          name,
          grade,
          parentId: user.parentProfile.id,
          // schoolId: ... (Implemented later via search)
      }
  });

  revalidatePath('/parent/children');
  redirect('/parent/children');
}

export async function updateChild(studentId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const name = formData.get('name') as string;
    const grade = formData.get('grade') as string;

    // Verify parent owns this student
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { parentProfile: { include: { children: true } } }
    });

    const isOwner = user?.parentProfile?.children.some(child => child.id === studentId);
    
    if (!isOwner) throw new Error("Unauthorized access to this student");

    await prisma.student.update({
        where: { id: studentId },
        data: {
            name,
            grade
        }
    });

    revalidatePath('/parent/children');
    revalidatePath(`/parent/children/${studentId}`);
    redirect('/parent/children');
}

export async function deleteChild(studentId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    // Verify parent owns this student
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { parentProfile: { include: { children: true } } }
    });

    const isOwner = user?.parentProfile?.children.some(child => child.id === studentId);
    
    if (!isOwner) throw new Error("Unauthorized access to this student");

    await prisma.student.delete({
        where: { id: studentId }
    });

    revalidatePath('/parent/children');
    redirect('/parent/children');
}

export async function purchaseCredits(packageId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Unauthorized" };
    
    // Simulate payment logic (In real app, Stripe Session creation here)
    let hoursToAdd = 0;
    
    // Check for existing trial usage if buying trial
    if (packageId === 'pack_trial') {
        const existingLog = await prisma.systemLog.findFirst({
            where: {
                userId: session.user.id,
                action: 'PURCHASE_CREDITS',
                message: { contains: 'pack_trial' }
            }
        });
        if (existingLog) return { error: "Offre d'essai déjà utilisée." };
    }

    switch(packageId) {
        case 'pack_trial': hoursToAdd = 1; break;
        case 'pack_5': hoursToAdd = 5; break;
        case 'pack_10': hoursToAdd = 10; break;
        case 'pack_20': hoursToAdd = 20; break;
        default: return { error: "Invalid package" };
    }

    // Update parent profile
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { parentProfile: true }
    });

    if (!user?.parentProfile) return { error: "Parent profile not found" };

    const updatedProfile = await prisma.parentProfile.update({
        where: { id: user.parentProfile.id },
        data: {
            hoursBalance: { increment: hoursToAdd }
        }
    });

    // Log the transaction
    await prisma.systemLog.create({
        data: {
            level: 'INFO',
            action: 'PURCHASE_CREDITS',
            message: `Purchased ${hoursToAdd} hours. New balance: ${updatedProfile.hoursBalance}`,
            userId: user.id,
            metadata: { packageId, amount: hoursToAdd }
        }
    });

    revalidatePath('/parent/dashboard');
    revalidatePath('/parent/billing');
    
    return { success: true, newBalance: updatedProfile.hoursBalance };
}
