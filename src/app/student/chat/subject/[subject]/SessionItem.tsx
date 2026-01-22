'use client';

import Link from 'next/link';
import { Clock, MessageCircle, Trash2, Loader2 } from 'lucide-react';
import { deleteSessionAction } from '@/app/actions/kogito-actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SessionItemProps {
  session: {
    id: string;
    topic: string | null;
    startedAt: Date;
    mode: string;
    messages: { content: string }[];
  };
}

export default function SessionItem({ session }: SessionItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the chat
    e.stopPropagation();
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) return;

    setIsDeleting(true);
    const result = await deleteSessionAction(session.id);
    
    if (result.success) {
      router.refresh();
    } else {
      alert('Erreur lors de la suppression');
      setIsDeleting(false);
    }
  };

  if (isDeleting) {
      return (
          <div className="bg-white/50 rounded-2xl p-6 border border-slate-100 flex items-center justify-center h-[120px]">
              <Loader2 className="animate-spin text-indigo-600" />
          </div>
      );
  }

  return (
    <Link 
      href={`/student/chat/${session.id}`}
      className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all flex flex-col sm:flex-row gap-6 cursor-pointer relative"
    >
      <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                <Clock size={12} />
                {new Intl.DateTimeFormat('fr-FR', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }).format(new Date(session.startedAt))}
              </div>
              {session.mode !== 'STANDARD' && (
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                    {session.mode}
                </span>
              )}
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors mb-2">
              {session.topic || "Discussion"}
          </h3>
          
          <p className="text-slate-500 text-sm line-clamp-2">
            {session.messages[0] ? session.messages[0].content : "Aucun message"}
          </p>
      </div>

      <div className="flex items-center justify-end sm:border-l sm:border-slate-50 sm:pl-6 gap-2">
          {/* Delete Button */}
          <button 
            onClick={handleDelete}
            className="p-3 rounded-full text-slate-300 hover:bg-slate-100 hover:text-red-500 transition-all z-10"
            title="Supprimer la conversation"
          >
            <Trash2 size={20} />
          </button>
          
          <button className="bg-slate-50 text-slate-400 p-3 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
              <MessageCircle size={20} />
          </button>
      </div>
    </Link>
  );
}
