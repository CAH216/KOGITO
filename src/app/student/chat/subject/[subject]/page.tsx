import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { 
  ArrowLeft,
  MessageSquarePlus,
  MessageCircle,
  Clock,
  BookOpen,
  Sparkles,
  Search
} from 'lucide-react';
import { createNewSessionAction } from '@/app/actions/kogito-actions';
import StartSessionButton from './StartSessionButton';
import SessionItem from './SessionItem';

interface PageProps {
  params: Promise<{ subject: string }>;
}

export default async function SubjectPage({ params }: PageProps) {
  const { subject } = await params;
  const decodedSubject = decodeURIComponent(subject);
  
  const cookieStore = await cookies();
  const currentStudentId = cookieStore.get('currentStudentId')?.value;

  if (!currentStudentId) redirect('/profiles');

  const student = await prisma.student.findUnique({
    where: { id: currentStudentId },
    include: {
      kogitoProfile: {
        include: {
          sessions: {
            where: { subject: decodedSubject },
            orderBy: { startedAt: 'desc' },
            include: {
                messages: {
                    take: 1, 
                    orderBy: { createdAt: 'desc' }
                }
            }
          }
        }
      }
    }
  });

  if (!student) {
      redirect('/auth/login');
  }

  // Ensure profile exists if not already
  if (!student.kogitoProfile) {
     await prisma.kogitoStudentProfile.create({ data: { studentId: student.id } });
     // Re-fetch or just initialize empty
     // We can just proceed with empty array since we know it's new
  }

  const sessions = student.kogitoProfile?.sessions || [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* HEADER */}
      <div className="bg-white border-b border-indigo-100 shadow-sm sticky top-20 z-10 transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:h-20 flex items-center justify-between gap-4">
           <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
              <Link href="/student/chat" className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors shrink-0">
                  <ArrowLeft size={24} />
              </Link>
              <div className="overflow-hidden">
                  <h1 className="text-lg sm:text-2xl font-black text-slate-900 capitalize flex items-center gap-2 truncate">
                    <BookOpen className="text-indigo-600 w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                    <span className="truncate">{decodedSubject}</span>
                  </h1>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider truncate">
                     {sessions.length} Conversations
                  </p>
              </div>
           </div>
           
           <div className="shrink-0">
               <StartSessionButton subject={decodedSubject} />
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {sessions.length === 0 ? (
          <div className="text-center py-12 sm:py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm px-4">
             <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="text-indigo-600 w-10 h-10" />
             </div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">C'est calme ici...</h2>
             <p className="text-slate-500 max-w-md mx-auto mb-8">
               Tu n'as pas encore de conversation en {decodedSubject}. Clique sur "Nouvelle Conversation" pour commencer !
             </p>
          </div>
        ) : (
          <div className="space-y-6">
             {/* SEARCH (Visual Only for now) */}
             <div className="relative">
                <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Rechercher dans les conversations..." 
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-sm"
                />
             </div>

             <div className="grid gap-4">
                {sessions.map((session) => (
                   <SessionItem key={session.id} session={session} />
                ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
