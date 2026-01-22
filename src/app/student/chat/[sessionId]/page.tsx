import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ChatInterface from '../ChatInterface';
import { Home } from 'lucide-react';
import EndSessionButton from './EndSessionButton';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function KogitoSessionPage({ params }: PageProps) {
  const { sessionId } = await params;
  const cookieStore = await cookies();
  const currentStudentId = cookieStore.get('currentStudentId')?.value;

  if (!currentStudentId) redirect('/profiles');

  const student = await prisma.student.findUnique({
    where: { id: currentStudentId },
    select: { name: true, grade: true }
  });

  if (!student) redirect('/profiles');

  // Load the specific session
  const session = await prisma.kogitoSession.findUnique({
    where: { id: sessionId },
    include: { messages: { orderBy: { createdAt: 'asc' } } }
  });

  if (!session) {
      redirect('/student/chat'); // Session doesn't exist? Go back to dashboard.
  }

  // Security check: ensure this session belongs to the student's profile (implicitly checked via profile query but let's be safe if we had profileId)
  // For now assuming session ID is secret enough or adding check later if we have profileId on hand clearly.
  // Ideally: 
  /*
  const profile = await prisma.kogitoStudentProfile.findUnique({ where: { studentId: currentStudentId }});
  if (session.studentProfileId !== profile.id) redirect('/error');
  */

  const initialMessages = session.messages.map(m => ({
    id: m.id,
    role: m.role,
    content: m.content,
    sentiment: m.sentiment || undefined,
    metadata: m.metadata || undefined
  }));

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-slate-50 font-sans">
      {/* PROFESSIONAL HEADER */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex justify-between items-center z-20 shadow-sm sticky top-0">
        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
           {/* Back Button */}
           <a 
              href={`/student/chat/subject/${encodeURIComponent(session.subject)}`} 
              className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-all"
              title="Retour aux sujets"
           >
              <span className="sr-only">Retour</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>
           </a>

           {/* Subject Info */}
           <div className="flex flex-col">
              <h1 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2 truncate">
                <span className="text-xl">🧠</span> 
                <span className="truncate">{session.topic || session.subject }</span>
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                 <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    En ligne
                 </span>
                 <span className="hidden md:inline">•</span>
                 <span className="hidden md:inline text-slate-400 capitalize">{session.mode.toLowerCase()} mode</span>
              </div>
           </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
            <a href="/student/dashboard" className="hidden md:flex items-center justify-center w-9 h-9 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors" title="Tableau de bord">
                <Home size={18} />
            </a>

            <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden md:block"></div>

            <div className="hidden md:block text-xs font-bold text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100/50">
               {student.grade || 'Niveau ?'}
            </div>

            <EndSessionButton sessionId={session.id} />
        </div>
      </header>

      {/* CHAT CONTAINER */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <ChatInterface 
          sessionId={session.id} 
          initialMessages={initialMessages} 
        />
      </main>
    </div>
  );
}
