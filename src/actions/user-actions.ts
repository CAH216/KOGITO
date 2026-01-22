'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteMyAccount() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        // Cascade delete should handle most things if configured in Prisma
        // But for safety, we might want to manually clean up relations depending on schema
        // Assuming schema has onDelete: Cascade for Profile -> User, Session -> User etc.
        
        await prisma.user.delete({
            where: { id: session.user.id }
        });

        return { success: true };
    } catch (error) {
        console.error("Error deleting account:", error);
        return { error: "Failed to delete account" };
    }
}

export async function deleteStudentAccount(studentId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'PARENT') return { error: "Unauthorized" };

    try {
        // Verify ownership
        const parentProfile = await prisma.parentProfile.findUnique({
             where: { userId: session.user.id },
             include: { children: true }
        });

        if (!parentProfile || !parentProfile.children.some(c => c.id === studentId)) {
            return { error: "You are not authorized to delete this student." };
        }

        await prisma.student.delete({
            where: { id: studentId }
        });

        revalidatePath('/parent/settings');
        revalidatePath('/parent/dashboard');
        return { success: true };

    } catch (error) {
        console.error("Error deleting student:", error);
        return { error: "Failed to delete student account" };
    }
}
