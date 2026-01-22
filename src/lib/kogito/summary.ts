import { prisma } from '@/lib/prisma';
import { generateText } from 'ai';
import { huggingface } from '@ai-sdk/huggingface';

export async function generatePedagogicalSummary(sessionId: string) {
  const session = await prisma.kogitoSession.findUnique({
    where: { id: sessionId },
    include: { 
        messages: true, 
        studentProfile: {
            include: {
                student: {
                    include: {
                        parent: {
                            include: { user: true }
                        }
                    }
                }
            }
        } 
    }
  });

  if (!session || session.messages.length < 2) return null;

  // Filter out private "Confidence Mode" messages so they don't appear in the summary
  const publicMessages = session.messages.filter(m => !m.isPrivate);
  
  if (publicMessages.length === 0) return null; // Nothing public to summarize

  const history = publicMessages.map(m => `${m.role}: ${m.content}`).join('\n');

  const { text } = await generateText({
    model: huggingface('Qwen/Qwen2.5-72B-Instruct'),
    system: `
      You are an "Emotional Intelligence Officer" for a School.
      Your goal is to write a short, inspiring message to the student's PARENTS.
      
      CONTEXT:
      Student Name: ${session.studentProfile.student.name}
      Subject: ${session.subject}
      
      RULES:
      1. IGNORE technical details (don't list exercises).
      2. FOCUS on the EMOTION and EFFORT (Perseverance, Curiosity, Victory).
      3. STORYTELLING: Tell a mini-story about a struggle and a breakthrough.
      4. CALL TO ACTION: Tell the parent specifically how to congratulate the child (e.g., "Ask him about the Pizza Analogy!").
      5. TONE: Warm, enthusiastic, but professional.
      6. LANGUAGE: French.
      7. LENGTH: Max 3 sentences (SMS style but richer).
      
      Example:
      "✨ Victoire pour Léo ! Il était frustré par les fractions au début, mais il a eu un déclic génial grâce à l'analogie des Légos. Félicitez-le pour sa persévérance, il a vaincu le boss final !"
    `,
    prompt: `Analyze this conversation and write the Emotional Digest for the parent:\n\n${history}`,
  });

  // Save Summary
  await prisma.kogitoSession.update({
    where: { id: sessionId },
    data: { 
      parentSummary: text,
      endedAt: new Date(),
      sharedAt: new Date(),
      isSharedWithParent: true
    }
  });
  
  // Create Notification for Parent
  const parentUserId = session.studentProfile.student.parent?.userId;
  if (parentUserId) {
      await prisma.parentNotification.create({
          data: {
              userId: parentUserId,
              type: 'VICTORY',
              title: `🌟 Succès de ${session.studentProfile.student.name}`,
              message: text,
              sessionId: sessionId
          }
      });
  }

  return text;
}
