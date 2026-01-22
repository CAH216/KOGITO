'use client';

import { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { endSessionAction } from '@/app/actions/kogito-actions';
import { useRouter } from 'next/navigation';

export default function EndSessionButton({ sessionId }: { sessionId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEndSession = async () => {
    if (!confirm("Veux-tu terminer cette session ? Cela générera un résumé pour tes parents et fermera la conversation.")) return;
    
    setIsLoading(true);
    const result = await endSessionAction(sessionId);
    
    if (result.success) {
       router.push(`/student/chat/subject/Mathématiques`); // Ideally go back to subject hub, but hard to know subject here without props. 
       // Better: Just refresh and show a completion state, or go to dashboard.
       router.push('/student/chat');
    } else {
        alert("Erreur lors de la clôture.");
        setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleEndSession}
      disabled={isLoading}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm shadow-green-200 disabled:opacity-50"
    >
      {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
      Terminer
    </button>
  );
}
