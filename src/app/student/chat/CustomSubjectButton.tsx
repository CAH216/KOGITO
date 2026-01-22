'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, ArrowRight } from 'lucide-react';

export default function CustomSubjectButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;

    setIsLoading(true);
    // Redirect to the dynamic subject page (it will be "created" upon first session)
    router.push(`/student/chat/subject/${encodeURIComponent(subjectName.trim())}`);
  };

  if (isEditing) {
     return (
        <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-indigo-200 shadow-sm flex flex-col justify-center h-full">
            <h3 className="font-bold text-slate-800 mb-4">Créer une matière</h3>
            <form onSubmit={handleSubmit}>
                <input 
                   type="text" 
                   autoFocus
                   placeholder="Ex: Philosophie, Latin..." 
                   className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                   value={subjectName}
                   onChange={e => setSubjectName(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !subjectName.trim()}
                  className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-bold flex items-center justify-center gap-2"
                >
                   {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                   Accéder
                </button>
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="mt-2 text-xs text-slate-400 font-medium hover:text-slate-600 text-center w-full"
                >
                   Annuler
                </button>
            </form>
        </div>
     )
  }

  return (
    <button 
      onClick={() => setIsEditing(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden bg-white/50 hover:bg-white rounded-2xl p-6 border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-all h-full flex flex-col justify-center items-center text-center cursor-pointer min-h-[220px]"
    >
      <div className={`
         w-16 h-16 rounded-full bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center mb-4 transition-colors duration-300
      `}>
          <Plus size={32} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
      </div>
      
      <h3 className="font-bold text-lg text-slate-400 group-hover:text-indigo-600 transition-colors">
        Autre Matière
      </h3>
      <p className="text-slate-400 text-xs mt-2 max-w-[150px]">
        Crée ton propre espace de révision personnalisé
      </p>
    </button>
  );
}
