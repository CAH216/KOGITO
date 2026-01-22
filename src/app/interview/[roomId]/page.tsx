import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import InterviewClient from "./InterviewClient";
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { logSystemEvent, LogLevel } from "@/lib/logger";

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default async function InterviewRoomPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { roomId } = resolvedParams;
  const session = await getServerSession(authOptions);

  let displayName = "Invité";
  let isHost = false;

  // 1. Identify User
  if (session?.user) {
    // Logged in
    displayName = session.user.name || "Utilisateur Connecté";
    
    // Only Admin and Employees are considered HOSTS of the room.
    // Tutors, Parents, and Students are Guests/Candidates.
    if (session.user.role === 'ADMIN' || session.user.role === 'EMPLOYEE') {
        isHost = true;
    }
  } else {
    // Guest (Candidate not logged in, or anonymous)
    // Try to lookup name from Room ID if it matches pattern 'tutor-<id>'
    if (roomId.startsWith('tutor-')) {
        const tutorId = roomId.replace('tutor-', '');
        try {
            const tutorProfile = await prisma.tutorProfile.findUnique({
                where: { id: tutorId },
                include: { user: true }
            });
            
            if (tutorProfile?.user?.name) {
                displayName = tutorProfile.user.name;
                // isHost remains false
            }
        } catch (error) {
            console.error("Error fetching tutor for interview:", error);
        }
    }
  }

  // Log the entry
  await logSystemEvent(
    "INTERVIEW_JOIN",
    `User ${displayName} joined room ${roomId} as ${isHost ? 'HOST' : 'GUEST'}`,
    LogLevel.INFO,
    { roomId, role: isHost ? 'HOST' : 'GUEST', displayName },
    session?.user?.id
  );

  return (
    <InterviewClient 
        roomId={roomId} 
        displayName={displayName} 
        isHost={isHost} 
    />
  );
}
