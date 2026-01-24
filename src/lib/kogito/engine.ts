import { huggingface } from '@ai-sdk/huggingface';
import { generateText, streamText } from 'ai';
import { prisma } from '@/lib/prisma';
import { KogitoContext, CognitiveStep, EmotionalState, KogitoStrategy } from './types';
import { retrieveRelevantMemories, analyzeAndPersistMemories } from './memory';
import { checkAndIncrementQuota, incrementQuotaUsage } from '@/lib/quota-check';

// The Core Manifesto of Kogito
const BASE_SYSTEM_PROMPT = `
Tu es Kogito, un Tuteur Socratique IA.
Ta mission : Guider l'élève sans donner la réponse, en étant clair, encourageant et visuel.

### RÈGLES D'OR :
1. **Méthode Socratique** : Pose des questions, ne donne pas la solution tout de suite.
2. **Clarté Absolue** : Fais des phrases courtes. Évite le jargon.
3. **Tableau Blanc** : Utilise-le pour DES SCHÉMAS SIMPLES (Géométrie, Listes, Connexions).

### GUIDE TECHNIQUE TABLEAU BLANC (SMART TEMPLATES) :
N'essaie PAS de dessiner pixel par pixel. Choisis un MODELE (template) parmi la liste ci-dessous.

FORMAT JSON:
:::WHITEBOARD
{
  "template": "NOM_DU_TEMPLATE",
  "params": { "variable": "valeur" },
  "explanation": "Texte court..."
}
:::

LES TEMPLATES DISPONIBLES :

1. **PYTHAGORE** (Pour triangle rectangle, trigonométrie)
   - \`params\`: { "a": "3cm", "b": "4cm", "c": "?", "title": "Triangle ABC" }
   - *Dessine un triangle rectangle parfait.*

2. **BALANCE** (Pour équations, égalités, poids)
   - \`params\`: { "left": "2x + 1", "right": "9" }
   - *Dessine une balance à deux plateaux.*

3. **ATOM** (Pour physique, chimie, structure)
   - \`params\`: { "center": "Noyau", "label": "Atome de Carbone" }
   - *Dessine un atome stylisé.*

4. **FREE** (Seulement si aucun template ne correspond)
   - Utilise le format classique "elements": [...] avec coordonnées manuelles.
   - Attention : (0,0) est en HAUT-GAUCHE.

EXEMPLE RÉPONSE :
"Regarde ce schéma pour le théorème :
:::WHITEBOARD
{
  "template": "PYTHAGORE",
  "params": { "a": "Côté A", "b": "Côté B", "c": "Hypoténuse" },
  "explanation": "L'hypoténuse est le côté le plus long."
}
:::"

IMPORTANT :
- Privilégie TOUJOURS un template. C'est plus joli et plus précis.
- Si tu utilises le mode FREE, fais très attention à ne pas superposer les éléments.

### INTERACTION :
- Si l'élève bloque -> Propose une analogie (Ex: "Imagine que c'est comme dans Minecraft...").
- Sois chaleureux mais concis.
`;

export async function createKogitoSession(studentId: string, subject: string) {
  // 1. Get or Create Profile
  let profile = await prisma.kogitoStudentProfile.findUnique({
    where: { studentId },
  });

  if (!profile) {
    profile = await prisma.kogitoStudentProfile.create({
      data: { studentId },
    });
  }

  // 2. Create Session
  const session = await prisma.kogitoSession.create({
    data: {
      studentProfileId: profile.id,
      subject,
      startedAt: new Date(),
    },
  });

  return session;
}

import { checkBadges } from './badges';

// ... existing imports ...

export async function processStudentMessage(
  sessionId: string, 
  userMessage: string,
  isPrivate: boolean = false,
  attachment?: string
) {
  // 1. Retrieve Context
  const session = await prisma.kogitoSession.findUnique({
    where: { id: sessionId },
    include: {
      studentProfile: {
         include: { student: true }
      },
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 20 // Context window
      },
    },
  });

  if (!session) throw new Error("Session not found");

  // QUOTA CHECK
  const quota = await checkAndIncrementQuota(session.studentProfile.student.id, 'CHAT');
  if (!quota.allowed) {
      throw new Error(quota.message || "Quota exceeded");
  }

  // Retrieve Long Term Memory
  const memories = await retrieveRelevantMemories(session.studentProfile.id);
  const memoryBlock = memories.length > 0 
    ? `\n### MÉMOIRE LONGUE DURÉE (Notes Pédagogiques):\n${memories.join('\n')}`
    : '';

  // Save User Message
  await prisma.kogitoMessage.create({
    data: {
      sessionId,
      role: 'user',
      content: userMessage,
      isPrivate: isPrivate,
      metadata: attachment ? { image: attachment } : undefined
    },
  });

  // 2. Construct Prompt with History
  const history = session.messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
  const visualContext = attachment ? "\n[NOTE SYSTÈME: L'élève a envoyé une image que tu ne peux pas voir pour l'instant. Demande-lui poliment de décrire ce qu'il y a dessus ou de lire l'énoncé. Ne dis pas 'je ne peux pas voir', dis 'Pour mieux t'aider avec cette image, peux-tu me lire ce qui est écrit ou me décrire la figure ?']" : "";
  
  const studentInfo = `
    Student First Name: ${session.studentProfile.student.name || 'Student'}
    Learning Style: ${session.studentProfile.learningStyle || 'Unknown'}
    Interests: ${JSON.stringify(session.studentProfile.interests || [])}
    Strengths: ${JSON.stringify(session.studentProfile.strengths || [])}
    Weaknesses: ${JSON.stringify(session.studentProfile.weaknesses || [])}
    Current Subject: ${session.subject}
    MODE: ${isPrivate ? 'CONFIDENCE / PRIVATE (Be extra reassuring, no judgment, this is a safe space)' : 'STANDARD'}
    ${memoryBlock}
    ${visualContext}
  `;

  // 3. AI Generation (The "Thinking" Phase could be a separate call, but we'll do 1 for now)
  const { text } = await generateText({
    model: huggingface('Qwen/Qwen2.5-72B-Instruct'), 
    system: `${BASE_SYSTEM_PROMPT}\n\nCONTEXT:\n${studentInfo}`,
    prompt: `Previous Conversation:\n${history}\n\nUser: ${userMessage}\n\nKogito:`,
  });

  // Extract Whiteboard JSON if present
  let cleanContent = text;
  let metadata: any = null;
  
  const whiteboardMatch = text.match(/:::WHITEBOARD([\s\S]*?):::/);
  if (whiteboardMatch) {
      try {
          const jsonStr = whiteboardMatch[1].trim();
          const whiteboardData = JSON.parse(jsonStr);
          metadata = { whiteboard: whiteboardData };
          // Remove from visible text
          cleanContent = text.replace(/:::WHITEBOARD[\s\S]*?:::/, '').trim();
      } catch (e) {
          console.error("Failed to parse whiteboard JSON", e);
      }
  }

  // 4. Save AI Response
  const savedMessage = await prisma.kogitoMessage.create({
    data: {
      sessionId,
      role: 'assistant',
      content: cleanContent, // Only text shown in bubble
      sentiment: 'NEUTRAL',
      step: 'REASONING', 
      strategy: 'SOCRATIC',
      metadata: metadata || undefined, // Store visual data
      isPrivate: isPrivate
    },
  });

  // 5. Background Process: Memory Update & Gamification
  // Run asynchronously without awaiting to speed up response
  (async () => {
    try {
        // Update Memory every 4 messages or if session is long
        if (session.messages.length % 4 === 0) {
            await analyzeAndPersistMemories(sessionId);
        }
    } catch (e) {
        console.error('Background memory update failed', e);
    }
  })();

  // 5. Check for Gamification Badges
  // Cast JSON to string array safely
  const currentBadges = (session.studentProfile.badges as string[]) || [];
  const newBadges = await checkBadges(session.studentProfile.id, currentBadges);

  // INCREMENT QUOTA
  await incrementQuotaUsage(session.studentProfile.student.id, 'CHAT');

  return { message: savedMessage, newBadges };
}
