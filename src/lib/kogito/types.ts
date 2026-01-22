
export type KogitoStrategy = 'STORYTELLING' | 'PROJECTION' | 'SOCRATIC' | 'DIRECT';

export type CognitiveStep = 
  | 'UNDERSTANDING' // Assessing what the student knows
  | 'HYPOTHESIS'    // Student is making a guess
  | 'REASONING'     // Student is explaining why
  | 'JUSTIFICATION' // Deepening the proof
  | 'RETRY'         // Correcting a mistake
  | 'MASTERY';      // Concept learned

export type EmotionalState = 
  | 'CONFIDENT'
  | 'FRUSTRATED'
  | 'CURIOUS'
  | 'BORED'
  | 'NEUTRAL';

export interface KogitoMemory {
  shortTerm: string[]; // Last few exchanges
  longTerm: string[];  // Key concepts from previous sessions
}

export interface KogitoContext {
  studentProfile: any; // Will match Prisma type
  currentSession: any; // Will match Prisma type
  history: any[];      // Previous messages
}

// --- WHITEBOARD TYPES ---
export type WhiteboardShape = 
  | { type: 'rect', x: number, y: number, width: number, height: number, color?: string, label?: string }
  | { type: 'circle', x: number, y: number, radius: number, color?: string, label?: string }
  | { type: 'line', x1: number, y1: number, x2: number, y2: number, color?: string, label?: string }
  | { type: 'text', x: number, y: number, content: string, fontSize?: number, color?: string };

export interface WhiteboardScene {
  elements: WhiteboardShape[];
  explanation?: string; // Optional voiceover text
}

