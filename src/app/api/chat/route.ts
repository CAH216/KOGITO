import { streamText } from 'ai';
import { createHuggingFace } from '@ai-sdk/huggingface';
import { checkAndIncrementQuota, incrementQuotaUsage } from '@/lib/quota-check';
import { cookies } from 'next/headers';

const hf = createHuggingFace({
  apiKey: process.env.HUGGINGFACE_API_KEY,
});

// Autoriser les edge functions pour une latence minimale
// export const runtime = 'edge'; // Disabled for debugging on Windows

const BASE_SOCRATIC_PROMPT = `
Tu es un tuteur IA pour des élèves du collège et lycée.
TA MISSION : Aider l'élève à comprendre par lui-même, SANS JAMAIS donner la réponse directe.

RÈGLES D'OR :
1. ANALYSE : Identifie le niveau et le sujet.
2. MÉTHODE SOCRATIQUE : Pose des questions guides.
3. ADAPTABILITÉ : Si l'élève bloque, donne un indice. Si c'est faux, encourage.
4. SÉCURITÉ : Ne fais jamais les devoirs à la place de l'élève.
`;

export async function POST(req: Request) {
  try {
    const { messages, tutorProfile } = await req.json();

    // --- QUOTA CHECK ---
    const cookieStore = await cookies();
    const studentId = cookieStore.get('currentStudentId')?.value;

    if (studentId) {
        // 1. Check if allowed
        const quotaCheck = await checkAndIncrementQuota(studentId, 'CHAT');
        if (!quotaCheck.allowed) {
            return new Response(JSON.stringify({ 
                error: quotaCheck.message,
                isQuotaError: true
            }), {
                status: 402, // Payment Required
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 2. Increment usage (Optimistic approach for stream)
        // Since we are starting the stream, we count it as 1 usage.
        await incrementQuotaUsage(studentId, 'CHAT');
    }
    // -------------------

    // Construction du System Prompt personnalisé
    let systemPrompt = BASE_SOCRATIC_PROMPT;
    
    if (tutorProfile) {
        systemPrompt += `\n\nTON IDENTITÉ ACTUELLE :
        - Ton Nom : ${tutorProfile.name}
        - Ton Style : ${tutorProfile.style || 'Bienveillant et Patient'}
        - Ton Ton : ${tutorProfile.tone || 'Amical et encourageant'}
        - Emoji signature : ${tutorProfile.emoji || '🎓'}
        Agis strictement selon ce persona.`;
    }

    console.log('Chat API called:', messages.length, 'Profile:', tutorProfile?.name);

    const coreMessages = messages.map((m: any) => ({
        role: m.role,
        content: m.content
    }));

    // Modèle vérifié et fonctionnel : Meta-Llama-3-8B-Instruct
    const result = await streamText({
      model: hf('Qwen/Qwen2.5-72B-Instruct'),
      system: systemPrompt,
      messages: coreMessages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Une erreur est survenue lors de la communication avec l\'IA.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}