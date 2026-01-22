import { huggingface } from '@ai-sdk/huggingface';
import { generateText } from 'ai';
import { prisma } from '@/lib/prisma';

export async function retrieveRelevantMemories(studentProfileId: string): Promise<string[]> {
  // Fetch top 10 memories by importance
  // In a real 'Revolutionary' system, we would use Vector Search (Embeddings) here
  // to find memories relevant to the *current* topic. 
  // For now, we fetch the most 'Important' pedagogical notes.
  
  const memories = await prisma.kogitoMemory.findMany({
    where: { studentProfileId },
    orderBy: { importance: 'desc' },
    take: 10
  });

  return memories.map(m => `- [${m.type}] ${m.value}`);
}

export async function analyzeAndPersistMemories(sessionId: string) {
  const session = await prisma.kogitoSession.findUnique({
    where: { id: sessionId },
    include: { messages: true, studentProfile: true }
  });

  if (!session || session.messages.length < 4) return; // Need enough context

  const history = session.messages.map(m => `${m.role}: ${m.content}`).join('\n');

  // Intelligent extraction via LLM
  const { text } = await generateText({
    model: huggingface('Qwen/Qwen2.5-72B-Instruct'),
    system: `
      You are the "Long-Term Memory Module" of an AI Tutor.
      Your goal is to extract PERSISTENT pedagogical facts about the student.
      
      Extract strictly JSON format:
      {
        "memories": [
           { "key": "short_slug", "value": "Fact string", "type": "PEDAGOGICAL|PERSONAL|STRATEGIC", "importance": 1-5 }
        ]
      }

      RULES:
      1. IGNORE temporary context (e.g., "he asked about question 3").
      2. CAPTURE patterns (e.g., "He confuses sine and cosine", "He loves car analogies", "He gets angry when corrected abruptly").
      3. IMPORTANCE: 5 = Critical learning blocker/enabler. 1 = Trivia.
    `,
    prompt: `Analyze this session and extract persistent memories:\n${history}`,
  });

  // Parse JSON (resilient parsing)
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      if (data.memories && Array.isArray(data.memories)) {
        for (const mem of data.memories) {
            // Check if similar memory exists to avoid dupes? 
            // For now, just create. We can clean up later.
            await prisma.kogitoMemory.create({
                data: {
                    studentProfileId: session.studentProfile.id,
                    key: mem.key,
                    value: mem.value,
                    type: mem.type,
                    importance: mem.importance
                }
            });
        }
      }
    }
  } catch (e) {
    console.error("Failed to parse memory JSON", e);
  }
}
