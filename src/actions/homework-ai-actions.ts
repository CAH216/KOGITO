'use server';

import { prisma } from '@/lib/prisma';
import { huggingface } from '@ai-sdk/huggingface';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { parseAiJson } from '@/lib/utils';

// --- SCHEMAS ---

const QuestionSchema = z.object({
  id: z.string(),
  type: z.enum(['TEXT', 'MULTIPLE_CHOICE']),
  question: z.string(),
  options: z.array(z.string()).optional(), // Only for MCQ
});

const HomeworkContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  subject: z.string(),
  questions: z.array(QuestionSchema),
});

const CorrectionSchema = z.object({
  generalFeedback: z.string(),
  score: z.number().min(0).max(100),
  results: z.array(z.object({
    questionId: z.string(),
    isCorrect: z.boolean(),
    feedback: z.string(),
    correctAnswer: z.string().optional(),
  }))
});


// --- ACTIONS ---

export async function generateAiHomework(formData: FormData) {
    const cookieStore = await cookies();
    const studentId = cookieStore.get('currentStudentId')?.value;
    if (!studentId) throw new Error("Unauthorized");

    const subject = formData.get('subject') as string;
    const topic = formData.get('topic') as string;
    const sourceChatId = formData.get('chatId') as string | null;

    let context = "";
    
    // If ChatId is present, fetch chat history to add to context
    if (sourceChatId) {
        const session = await prisma.kogitoSession.findUnique({
            where: { id: sourceChatId },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });
        
        if (session) {
             context = session.messages.map(m => `${m.role}: ${m.content}`).join('\n');
             // If subject/topic not provided, infer from session
             if (!subject || subject === 'null') {
                 // We could ask AI to infer, but for now take session subject
                 // Note: formData 'subject' might be empty if UI hides it in Chat Mode
             }
        }
    }

    const prompt = `
      Create a homework assignment for a student${subject ? ` in ${subject}` : ''} ${topic ? `about "${topic}"` : ''}.
      ${sourceChatId ? 'Based strictly on the concepts discussed in the provided conversation context.' : ''}
      
      Target Audience: Middle school level.
      Format: 3-5 questions. Mix of Multiple Choice and Open Text.
      Language: French.
      ${context ? `\n--- CONVERSATION CONTEXT ---\n${context}\n---------------------------` : ''}

      RETURN ONLY A VALID JSON OBJECT. NO MARKDOWN. NO COMMENTS.
      Structure:
      {
        "title": "Short energetic title",
        "description": "Encouraging description",
        "subject": "${subject || 'General'}",
        "questions": [
          { "id": "unique_id", "type": "TEXT" or "MULTIPLE_CHOICE", "question": "The question?", "options": ["A", "B"] (if MC) }
        ]
      }
    `;

    // Generate Text manually because generateObject often fails on free HF API tiers
    const { text } = await generateText({
        model: huggingface('Qwen/Qwen2.5-72B-Instruct'),
        prompt: prompt,
    });

    const object = parseAiJson(text);

    // Save to DB
    const homework = await prisma.homework.create({
        data: {
            studentId,
            title: object.title,
            description: object.description,
            subject: subject || object.subject || 'Général',
            source: 'AI',
            status: 'PENDING',
            content: object, 
        }
    });

    revalidatePath('/student/homework');
    return { success: true, homeworkId: homework.id };
}


export async function submitHomeworkAnswers(homeworkId: string, answers: Record<string, string>) {
     const hw = await prisma.homework.findUnique({ where: { id: homeworkId } });
     if (!hw || !hw.content) throw new Error("Devoir introuvable");

     // Cast content to typed object
     const content = hw.content as any; 
     const questions = content.questions;

     // Prepare prompt for correction
     const correctionPrompt = `
        You are a gentle and encouraging tutor. Correct this student's homework.
        
        Original Questions: ${JSON.stringify(questions)}
        Student Answers: ${JSON.stringify(answers)}
        
        Language: French.
        Provide a score out of 100.
        For each question, determine if it is correct and explain why.

        RETURN ONLY A VALID JSON OBJECT. NO MARKDOWN.
        Structure:
        {
            "generalFeedback": "Global comment",
            "score": 85,
            "results": [
                { "questionId": "id", "isCorrect": true, "feedback": "Good job!", "correctAnswer": "Optional correct answer if wrong" }
            ]
        }
     `;

    const { text } = await generateText({
        model: huggingface('Qwen/Qwen2.5-72B-Instruct'),
        prompt: correctionPrompt,
    });

    const correctionData = parseAiJson(text);

    await prisma.homework.update({
        where: { id: homeworkId },
        data: {
            status: 'CORRECTED',
            answers: answers,
            correction: correctionData,
            score: correctionData.score,
            isCompleted: true // Legacy field sync
        }
    });

    revalidatePath(`/student/homework/${homeworkId}`);
}
