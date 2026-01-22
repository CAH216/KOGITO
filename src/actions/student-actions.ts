'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getRecentAiChats() {
    const cookieStore = await cookies();
    const currentStudentId = cookieStore.get('currentStudentId')?.value;

    if (!currentStudentId) return [];

    try {
        const chats = await prisma.aiChat.findMany({
            where: { studentId: currentStudentId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                title: true,
                subject: true,
                createdAt: true,
                messages: true // We need this to extract summary if needed, or just title
            }
        });
        return chats;
    } catch (e) {
        console.error("Error fetching AI chats", e);
        return [];
    }
}
