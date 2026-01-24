import { prisma } from "@/lib/prisma";
import { PRICING_CONSTANTS } from "./quota";

export async function checkAndIncrementQuota(studentId: string, actionType: 'CHAT' | 'HOMEWORK') {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { 
      plan: true, 
      dailyAiRequests: true, 
      dailyHomeworkGen: true, 
      lastQuotaReset: true 
    }
  });

  if (!student) throw new Error("Student not found");

  // 1. Check Date Reset
  const now = new Date();
  const lastReset = new Date(student.lastQuotaReset);
  
  const isSameDay = now.getDate() === lastReset.getDate() && 
                    now.getMonth() === lastReset.getMonth() && 
                    now.getFullYear() === lastReset.getFullYear();

  let currentRequests = student.dailyAiRequests;
  let currentHomeworks = student.dailyHomeworkGen;

  if (!isSameDay) {
    // Reset quotas
    await prisma.student.update({
      where: { id: studentId },
      data: {
        dailyAiRequests: 0,
        dailyHomeworkGen: 0,
        lastQuotaReset: now
      }
    });
    currentRequests = 0;
    currentHomeworks = 0;
  }

  // 2. Check Limits
  if (student.plan === 'FREE') {
    if (actionType === 'CHAT') {
      if (currentRequests >= PRICING_CONSTANTS.FREE_PLAN.MAX_DAILY_AI_REQUESTS) {
        return { allowed: false, message: "Limite quotidienne de messages atteinte (Gratuit). Passez au Premium !" };
      }
    } else if (actionType === 'HOMEWORK') {
      if (currentHomeworks >= PRICING_CONSTANTS.FREE_PLAN.MAX_DAILY_HOMEWORK_GEN) {
        return { allowed: false, message: "Limite quotidienne de devoirs atteinte (Gratuit). Passez au Premium !" };
      }
    }
  }

  // 3. Increment (Optimistic - assuming action will succeed)
  // Ideally, we increment AFTER success, but for strict gating, we can do it here or handle it in the caller.
  // For now, let's just return allowed status. The Caller MUST increment if allowed.
  
  return { allowed: true };
}

export async function incrementQuotaUsage(studentId: string, actionType: 'CHAT' | 'HOMEWORK') {
    const updateData = actionType === 'CHAT' 
        ? { dailyAiRequests: { increment: 1 } }
        : { dailyHomeworkGen: { increment: 1 } };

    await prisma.student.update({
        where: { id: studentId },
        data: updateData
    });
}
