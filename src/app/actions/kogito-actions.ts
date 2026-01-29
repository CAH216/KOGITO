'use server';

import { createKogitoSession, processStudentMessage } from '@/lib/kogito/engine';
import { generatePedagogicalSummary } from '@/lib/kogito/summary';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getStudentProfileStatus() {
  const cookieStore = await cookies();
  const currentStudentId = cookieStore.get('currentStudentId')?.value;
  if (!currentStudentId) return null;

  const profile = await prisma.kogitoStudentProfile.findUnique({
    where: { studentId: currentStudentId }
  });
  
  // If no profile exists, create one empty
  if (!profile) {
      await prisma.kogitoStudentProfile.create({
          data: { studentId: currentStudentId }
      });
      return { onboardingDone: false, name: '' };
  }

  const student = await prisma.student.findUnique({
      where: { id: currentStudentId },
      select: { name: true }
  });

  return { 
      onboardingDone: profile.onboardingDone,
      name: student?.name || '',
      interests: (profile.interests as string[]) || [],
      learningStyle: profile.learningStyle || '',
      strengths: (profile.strengths as string[]) || [],
      weaknesses: (profile.weaknesses as string[]) || []
  };
}

export async function updateStudentProfileAction(data: {
    name: string;
    interests: string[];
    learningStyle: string;
    strengths: string[];
    weaknesses: string[];
}) {
    const cookieStore = await cookies();
    const currentStudentId = cookieStore.get('currentStudentId')?.value;
    if (!currentStudentId) throw new Error("Not authenticated");

    // Update Student Name
    if (data.name) {
        await prisma.student.update({
            where: { id: currentStudentId },
            data: { name: data.name }
        });
    }

    // Update Kogito Profile
    await prisma.kogitoStudentProfile.upsert({
        where: { studentId: currentStudentId },
        create: {
            studentId: currentStudentId,
            interests: data.interests,
            learningStyle: data.learningStyle,
            strengths: data.strengths,
            weaknesses: data.weaknesses,
            onboardingDone: true
        },
        update: {
            interests: data.interests,
            learningStyle: data.learningStyle,
            strengths: data.strengths,
            weaknesses: data.weaknesses,
            onboardingDone: true
        }
    });

    revalidatePath('/student');
    return { success: true };
}

export async function shareSessionAction(sessionId: string) {
    const cookieStore = await cookies();
    const currentStudentId = cookieStore.get('currentStudentId')?.value;
    if (!currentStudentId) throw new Error("Not authenticated");

    await prisma.kogitoSession.update({
        where: { id: sessionId },
        data: {
            isSharedWithParent: true,
            sharedAt: new Date()
        }
    });

    revalidatePath('/parent/dashboard');
    return { success: true };   
}

export async function endSessionAction(sessionId: string) {
  try {
     const summary = await generatePedagogicalSummary(sessionId);
     revalidatePath('/student/chat');
     revalidatePath('/parent/dashboard');
     return { success: true, summary };
  } catch (error) {
     console.error("End Session Error:", error);
     return { success: false, error: "Failed to generate summary" };
  }
}

export async function createNewSessionAction(subject: string) {
  const cookieStore = await cookies();
  const currentStudentId = cookieStore.get('currentStudentId')?.value;

  if (!currentStudentId) throw new Error("Not authenticated as student");

  const session = await createKogitoSession(currentStudentId, subject);
  
  // Return the ID so the client can redirect
  return { success: true, sessionId: session.id };
}

export async function createCustomSubjectAction(subject: string) {
  // Just redirects to the subject page, effectively "creating" it when the user starts a session there
  if (!subject) return { error: "Subject Name Required" };
  return { success: true, redirectUrl: `/student/chat/subject/${encodeURIComponent(subject)}` };
}

export async function startRunCallback(subject: string) {
  // const session = await auth();
  // if (!session?.user?.id) redirect('/auth/login');
  
  // For now, mocking or retrieving ID. 
  // In real app, get user from session.
  // We need to find the student record associated with the user.
  
  // Placeholder: We need the student ID, not just User ID
  // const studentId = ... 
  // return createKogitoSession(studentId, subject);
}

export async function sendMessageAction(sessionId: string, message: string, isPrivate: boolean = false, attachment?: string) {
  try {
    const result = await processStudentMessage(sessionId, message, isPrivate, attachment);
    return { success: true, message: result.message, newBadges: result.newBadges };
  } catch (error) {
    console.error("Kogito Error:", error);
    return { success: false, error: "Failed to process message" };
  }
}

export async function deleteSessionAction(sessionId: string) {
  try {
    await prisma.kogitoMessage.deleteMany({
      where: { sessionId }
    });

    await prisma.kogitoSession.delete({
      where: { id: sessionId }
    });

    revalidatePath('/student/chat');
    return { success: true };
  } catch (error) {
    console.error("Delete Session Error:", error);
    return { success: false, error: "Failed to delete session" };
  }
}

export async function requestHumanHelp(sessionId: string) {
    try {
        const session = await prisma.kogitoSession.findUnique({
            where: { id: sessionId },
            include: { 
                studentProfile: {
                    include: {
                        student: {
                            include: {
                                organization: true,
                                parent: { include: { user: true } }
                            }
                        }
                    }
                },
                messages: {
                    orderBy: { createdAt: 'asc' },
                    take: 10 // Last 10 messages for context
                }
            }
        });

        if (!session) throw new Error("Session introuvable");

        const student = session.studentProfile.student;
        const organization = student.organization;
        
        if (!organization) {
             // SCENARIO: Independent Student (No Org, No Supervisor)
             // Action: Redirect to Tutor Marketplace to find help
             return { 
                 success: true, 
                 action: 'REDIRECT', 
                 url: '/student/tutors',
                 message: "Tu n'as pas de tuteur assigné. Je te redirige vers la liste des tuteurs disponibles."
             };
        }

        // Target: Organization Admin/Tutor OR Support
        // For now, we create a SupportTicket linked to the Parent User (owner of account)
        
        const history = session.messages.map(m => `[${m.role.toUpperCase()}] ${m.content.substring(0, 100)}...`).join('\n');
        
        const ticket = await prisma.supportTicket.create({
            data: {
                subject: `🆘 Demande d'aide : ${student.name} (${session.subject})`,
                description: `
L'élève ${student.name} demande l'intervention d'un humain.
Matière : ${session.subject}
Organisation : ${organization?.name || 'Indépendant'}

DERNIERS ÉCHANGES AVEC L'IA :
-----------------------------
${history}
                `,
                userId: student.parent.user.id, // Linked to parent account
                priority: 'HIGH',
                status: 'OPEN'
            }
        });

        return { success: true, action: 'TICKET_CREATED', ticketId: ticket.id };

    } catch (e: any) {
        console.error("Escalation Error", e);
        return { success: false, error: e.message };
    }
}
