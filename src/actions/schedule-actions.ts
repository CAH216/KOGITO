'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type AvailabilitySlot = {
    dayOfWeek: number; // 0-6
    startTime: string; // "09:00"
    endTime: string;   // "17:00"
};

export async function saveAvailability(slots: AvailabilitySlot[]) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'TUTOR') return { error: "Unauthorized" };

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { tutorProfile: true }
    });

    if (!user?.tutorProfile) return { error: "Profil tuteur introuvable" };

    try {
        // Transaction: Delete old, create new
        await prisma.$transaction(async (tx) => {
            // Delete existing
            await tx.availability.deleteMany({
                where: { tutorId: user.tutorProfile!.id }
            });

            // Create new
            if (slots.length > 0) {
                await tx.availability.createMany({
                    data: slots.map(slot => ({
                        tutorId: user.tutorProfile!.id,
                        dayOfWeek: slot.dayOfWeek,
                        startTime: slot.startTime,
                        endTime: slot.endTime
                    }))
                });
            }
        });

        revalidatePath('/tutor/schedule');
        return { success: true };
    } catch (error) {
        console.error("Error saving availability:", error);
        return { error: "Erreur lors de la sauvegarde" };
    }
}

export async function getMyAvailability() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { tutorProfile: { include: { availability: true } } }
    });

    return user?.tutorProfile?.availability || [];
}

export async function getTutorAvailability(tutorId: string) {
    return await prisma.availability.findMany({
        where: { tutorId },
        orderBy: { dayOfWeek: 'asc' }
    });
}
