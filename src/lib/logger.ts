import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export enum LogLevel {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  SECURITY = "SECURITY"
}

export async function logSystemEvent(
  action: string,
  message: string,
  level: LogLevel = LogLevel.INFO,
  metadata?: any,
  userId?: string
) {
  try {
    // In development, also log to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level}] ${action}: ${message}`, metadata);
    }

    await prisma.systemLog.create({
      data: {
        action,
        message,
        level,
        metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
        userId
      }
    });
  } catch (error) {
    // Fallback if DB logging fails
    console.error("Failed to write system log:", error);
  }
}
