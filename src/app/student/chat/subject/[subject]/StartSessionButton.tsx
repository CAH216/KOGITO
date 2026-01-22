'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquarePlus, Loader2 } from 'lucide-react';
import { createNewSessionAction } from '@/app/actions/kogito-actions';

export default function StartSessionButton({ subject }: { subject: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
        const result = await createNewSessionAction(subject);
        if (result.success && result.sessionId) {
            router.push(`/student/chat/${result.sessionId}`);
        }
    } catch (e) {
        console.error(e);
        setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleStart}
      disabled={isLoading}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
    >
       {isLoading ? <Loader2 className="animate-spin" /> : <MessageSquarePlus size={20} />}
       <span className="hidden sm:inline">Nouvelle Conversation</span>
       <span className="sm:hidden">Nouveau</span>
    </button>
  );
}
