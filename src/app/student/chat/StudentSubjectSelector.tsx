'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use standard router for client-side redirect after action
import { 
  Loader2, 
  ArrowRight,
  Calculator, 
  BookOpen, 
  Globe, 
  FlaskConical, 
  Languages,
  Sparkles
} from 'lucide-react';
import { createCustomSubjectAction } from '@/app/actions/kogito-actions';

// Map string keys to components
const ICON_MAP: Record<string, any> = {
  math: Calculator,
  fr: BookOpen,
  hist: Globe,
  sci: FlaskConical,
  eng: Languages,
  custom: Sparkles
};

interface SubjectProps {
  subject: string;
  gradient: string;
  iconName: string;
  description: string;
}

export default function StudentSubjectSelector({ subject, gradient, iconName, description }: SubjectProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const Icon = ICON_MAP[iconName] || Sparkles;

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);

    // Redirect to the Subject Page instead of creating a session immediately
    router.push(`/student/chat/subject/${encodeURIComponent(subject)}`);
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isLoading}
      className="group text-left relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all h-full flex flex-col justify-between"
    >
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient}`} />
      
      <div>
        <div className={`
           w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300
        `}>
          {isLoading ? <Loader2 className="animate-spin" /> : <Icon size={24} />}
        </div>
        
        <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">
          {subject}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4">
          {description}
        </p>
      </div>

      <div className="flex items-center text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-400 to-slate-600 group-hover:from-indigo-600 group-hover:to-purple-600 transition-all">
         Voir les cours
         <ArrowRight className="ml-2 w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors group-hover:translate-x-1" />
      </div>
    </button>
  );
}
