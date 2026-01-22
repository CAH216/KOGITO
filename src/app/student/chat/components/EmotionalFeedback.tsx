'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Lightbulb, PartyPopper } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Emotional States for the UI
type EmotionalState = 'NEUTRAL' | 'ENCOURAGING' | 'CELEBRATING' | 'THINKING';

interface EmotionalFeedbackProps {
  state: EmotionalState;
  message?: string;
}

export function EmotionalFeedback({ state, message }: EmotionalFeedbackProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (state !== 'NEUTRAL') {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className={cn(
            "flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border-2 backdrop-blur-md",
            state === 'ENCOURAGING' && "bg-blue-50/90 border-blue-200 text-blue-700",
            state === 'CELEBRATING' && "bg-yellow-50/90 border-yellow-200 text-yellow-700",
            state === 'THINKING' && "bg-indigo-50/90 border-indigo-200 text-indigo-700"
          )}>
            <div className="p-2 bg-white rounded-full shadow-sm">
                {state === 'ENCOURAGING' && <Lightbulb className="w-5 h-5 text-blue-500" />}
                {state === 'CELEBRATING' && <PartyPopper className="w-5 h-5 text-yellow-500" />}
                {state === 'THINKING' && <Brain className="w-5 h-5 text-indigo-500" />}
            </div>
            <span className="font-bold text-sm">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper to determine state from message content context (simple heuristic for now)
export function analyzeIdeallySentiment(content: string): { state: EmotionalState, message?: string } {
  const lower = content.toLowerCase();
  
  if (lower.includes("bravo") || lower.includes("excellent") || lower.includes("super")) {
    return { state: 'CELEBRATING', message: "Tu gères ! Continue comme ça ! 🎉" };
  }
  if (lower.includes("essaie encore") || lower.includes("indice") || lower.includes("presque")) {
    return { state: 'ENCOURAGING', message: "Tu es sur la bonne voie, ne lâche rien ! 💪" };
  }
  if (lower.includes("réfléchissons") || lower.includes("imaginons")) {
    return { state: 'THINKING', message: "Utilisons notre logique... 🧠" };
  }
  
  return { state: 'NEUTRAL' };
}
