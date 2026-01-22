'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { calculateSessionCost } from '@/lib/pricing';
import { logSystemEvent, LogLevel } from '@/lib/logger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { startConversation, sendMessage } from '@/actions/message-actions';

export async function requestSession(data: FormData) {
  const cookieStore = await cookies();
  const currentStudentId = cookieStore.get('currentStudentId')?.value;

  if (!currentStudentId) {
    return { error: "Non authentifié" };
  }

  const tutorId = data.get('tutorId') as string;
  const subject = data.get('subject') as string;
  const message = data.get('message') as string;
  const duration = parseInt(data.get('duration') as string) || 60;
  const dateStr = data.get('date') as string;
  const aiChatId = data.get('aiChatId') as string;

  if (!tutorId || !subject || !dateStr) {
      return { error: "Données manquantes (Tuteur, Matière ou Date)" };
  }

  // Parse Date
  const startTime = new Date(dateStr);
  if (isNaN(startTime.getTime())) return { error: "Date invalide" };
  const endTime = new Date(startTime.getTime() + duration * 60000);

  // Fetch Tutor
  const tutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      select: { hourlyRate: true, userId: true }
  });

  if (!tutor) return { error: "Tuteur introuvable" };

  const estimatedCost = calculateSessionCost(tutor.hourlyRate || 0, duration / 60);

  // Check Parent Balance
  const student = await prisma.student.findUnique({
      where: { id: currentStudentId },
      include: { parent: true }
  });

  if (!student || !student.parent) return { error: "Profil parent introuvable" };

  if (student.parent.hoursBalance < estimatedCost) {
      return { error: `Crédits insuffisants pour ${duration} min. Coût: ${estimatedCost} crédits. Solde: ${student.parent.hoursBalance}` };
  }

  // Handle AI Chat Context
  let noteContext = message;
  let chatContextMsg = "";
  
  if (aiChatId) {
      const chat = await prisma.aiChat.findUnique({
          where: { id: aiChatId },
          select: { title: true, subject: true }
      });
      if (chat) {
          const contextStr = `\n\n[Contexte IA lié: ${chat.title || chat.subject || 'Conversation'}]`;
          noteContext += contextStr;
          chatContextMsg = `L'élève a lié une conversation Kogito pour contexte: "${chat.title || chat.subject}"`;
      }
  }

  // Create the session request
  await prisma.learningSession.create({
      data: {
          studentId: currentStudentId,
          tutorId,
          subject,
          startTime: startTime,
          endTime: endTime,
          status: 'REQUESTED',
          notes: noteContext,
          price: estimatedCost // Lock in the price in Credits
      }
  });

  // Start Conversation & Send Request Message
  try {
      if (tutor.userId) {
          const conversationId = await startConversation(tutor.userId);
          if (conversationId) {
               let fullMsg = `Nouvelle demande de cours pour ${subject}.\nDate: ${startTime.toLocaleString()}\nMessage: ${message}`;
               if (chatContextMsg) fullMsg += `\n\n${chatContextMsg}`;
               
               await sendMessage(conversationId, fullMsg);
          }
      }
  } catch(e) {
      console.error("Failed to link chat", e);
      // Don't fail the request if chat fails
  }

  revalidatePath('/student/tutors');
  revalidatePath('/student/dashboard'); // update upcoming/requests
  revalidatePath('/parent/schedule');
  return { success: true };
}

export async function confirmSession(sessionId: string) {
    const sessionHelper = await getServerSession(authOptions);
    if (!sessionHelper?.user?.id) return { error: "Unauthorized" };

    const session = await prisma.learningSession.findUnique({
        where: { id: sessionId },
        include: { student: { include: { parent: true } } }
    });

    if (!session) return { error: "Session non trouvée" };
    if (session.status !== 'REQUESTED') return { error: "Session déjà traitée" };

    const cost = session.price || 1; // Fallback to 1

    // Transaction
    // 1. Check balance again (in case they spent it elsewhere)
    if (session.student.parent.hoursBalance < cost) {
        return { error: "Le parent n'a plus assez de crédits." };
    }

    // 2. Deduct
    await prisma.parentProfile.update({
        where: { id: session.student.parent.id },
        data: {
            hoursBalance: { decrement: cost }
        }
    });

    // 3. Update Session
    await prisma.learningSession.update({
        where: { id: sessionId },
        data: {
            status: 'SCHEDULED'
        }
    });

    await logSystemEvent('SESSION_CONFIRMED', `Session ${sessionId} confirmed. Cost: ${cost} credits.`, LogLevel.INFO);

    revalidatePath('/tutor/dashboard');
    revalidatePath('/parent/schedule');
    
    return { success: true };
}

