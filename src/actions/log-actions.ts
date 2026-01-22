'use server';

import { prisma } from "@/lib/prisma";
import { LogLevel } from "@/lib/logger";

export type SystemLogWithUser = {
  id: string;
  level: LogLevel;
  action: string;
  message: string;
  metadata: any;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  } | null;
};

export async function getSystemLogs(limit = 100, level?: LogLevel) {
  try {
    const logs = await prisma.systemLog.findMany({
      where: level ? { level } : undefined,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return { success: true, logs: logs as unknown as SystemLogWithUser[] };
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    return { success: false, error: "Failed to fetch logs" };
  }
}
