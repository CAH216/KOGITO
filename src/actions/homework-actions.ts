'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function toggleHomeworkStatus(homeworkId: string, isCompleted: boolean) {
    await prisma.homework.update({
        where: { id: homeworkId },
        data: { isCompleted }
    });
    revalidatePath('/student/homework');
    revalidatePath('/student/dashboard');
}
