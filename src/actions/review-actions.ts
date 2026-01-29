'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReview(sessionId: string, rating: number, comment: string) {
    try {
        const session = await prisma.learningSession.findUnique({
            where: { id: sessionId },
            include: { tutor: true }
        });

        if (!session) return { success: false, error: "Session not found" };
        if (session.status !== 'COMPLETED') return { success: false, error: "Session must be completed to review" };

        // 1. Create Review
        await prisma.sessionReview.create({
            data: {
                sessionId,
                tutorId: session.tutorId,
                rating,
                comment
            }
        });

        // 2. Recalculate Tutor Average
        const allReviews = await prisma.sessionReview.findMany({
            where: { tutorId: session.tutorId }
        });

        const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
        const newAverage = totalRating / allReviews.length;

        await prisma.tutorProfile.update({
            where: { id: session.tutorId },
            data: {
                rating: newAverage,
                totalReviews: allReviews.length
            }
        });

        revalidatePath('/parent/dashboard');
        revalidatePath(`/parent/tutors/${session.tutorId}`);
        revalidatePath('/tutor/dashboard');

        return { success: true };
    } catch (error) {
        console.error("Error submitting review:", error);
        return { success: false, error: "Failed to submit review" };
    }
}
