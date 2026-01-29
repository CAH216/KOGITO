'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Award XP to a student (Kogito Profile)
 * @param studentId The ID of the student (not the user ID, but the Student model ID)
 * @param amount Amount of XP to add
 * @param reason Reason for the XP (for logs/history - future)
 */
export async function awardXP(studentId: string, amount: number, reason: string) {
    if (!studentId) return { success: false, message: "Student ID required" };

    try {
        // 1. Get current profile to check for level up
        const profile = await prisma.kogitoStudentProfile.findUnique({
            where: { studentId },
        });

        if (!profile) return { success: false, message: "Profile not found" };

        const newTotalXP = profile.xp + amount;
        
        // simple logic: 100 XP per level
        // Level 1: 0-99
        // Level 2: 100-199
        // etc.
        const calculatedLevel = Math.floor(newTotalXP / 100) + 1;
        const isLevelUp = calculatedLevel > profile.level;

        // 2. Update DB
        await prisma.kogitoStudentProfile.update({
            where: { studentId },
            data: {
                xp: newTotalXP,
                level: calculatedLevel
            }
        });

        // 3. Revalidate dashboard to show new XP immediately
        revalidatePath('/student/dashboard');

        return { 
            success: true, 
            newXP: newTotalXP, 
            newLevel: calculatedLevel, 
            leveledUp: isLevelUp 
        };

    } catch (error) {
        console.error("Error awarding XP:", error);
        return { success: false, error: "Database error" };
    }
}

/**
 * Updates the mastery level of a specific concept
 */
export async function updateMastery(studentId: string, conceptSlug: string, increment: number) {
    try {
        const profile = await prisma.kogitoStudentProfile.findUnique({
            where: { studentId }
        });

        if (!profile) return;

        // Check if mastery exists
        const existing = await prisma.kogitoConceptMastery.findFirst({
            where: {
                studentProfileId: profile.id,
                conceptSlug: conceptSlug
            }
        });

        if (existing) {
            const newLevel = Math.min(100, existing.level + increment);
            await prisma.kogitoConceptMastery.update({
                where: { id: existing.id },
                data: { 
                    level: newLevel,
                    status: newLevel >= 80 ? 'MASTERED' : newLevel > 0 ? 'IN_PROGRESS' : 'LOCKED',
                    lastPracticed: new Date()
                }
            });
        } else {
            // Create new
            await prisma.kogitoConceptMastery.create({
                data: {
                    studentProfileId: profile.id,
                    conceptSlug: conceptSlug,
                    level: Math.min(100, increment),
                    status: 'IN_PROGRESS'
                }
            });
        }

        revalidatePath('/student/dashboard');
        return { success: true };

    } catch (e) {
        console.error("Error updating mastery", e);
        return { success: false };
    }
}
