import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, CheckCircle2, Clock, Sparkles, User, Filter, ArrowLeft, Plus } from 'lucide-react';
import AiHomeworkGenerator from './create/AiHomeworkGenerator';
import { toggleHomeworkStatus } from '@/actions/homework-actions';

export default async function StudentHomeworkPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const cookieStore = await cookies();
  const currentStudentId = cookieStore.get('currentStudentId')?.value;

  if (!currentStudentId) redirect('/profiles');

  const { filter } = await searchParams;
  const showCompleted = filter === 'completed';

  const homeworks = await prisma.homework.findMany({
    where: {
      studentId: currentStudentId,
      isCompleted: showCompleted ? true : false,
    },
    orderBy: { createdAt: 'desc' }, 
    include: {
      tutor: { include: { user: true } }
    }
  });

  // Fetch data for Generator (Subjects & Recent Chats)
  // 1. Subjects from past homeworks/sessions
  const distinctSubjects = await prisma.learningSession.findMany({
      where: { studentId: currentStudentId },
      select: { subject: true },
      distinct: ['subject']
  });
  const subjectsList = distinctSubjects.map(s => s.subject);

  // 2. Recent Kogito Sessions for "From Chat" mode
  const recentChats = await prisma.kogitoSession.findMany({
      where: { studentProfile: { studentId: currentStudentId } },
      orderBy: { startedAt: 'desc' },
      take: 5,
      select: { id: true, subject: true, topic: true, startedAt: true }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/student/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="text-slate-500" />
        </Link>
        <div>
            <h1 className="text-3xl font-black text-indigo-950 flex items-center gap-3">
                <BookOpen className="text-orange-500 h-8 w-8" />
                Devoirs & Missions
            </h1>
            <p className="text-slate-500 font-medium">Tes tâches pour progresser à ton rythme.</p>
        </div>
      </div>

      {/* Generator Section */}
      <div className="mb-12">
         <AiHomeworkGenerator subjects={subjectsList} sessions={recentChats} />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
         <Link 
            href="/student/homework" 
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap
            ${!showCompleted ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
         >
            <Clock size={16} />
            À Faire ({!showCompleted ? homeworks.length : '...'})
         </Link>
         <Link 
            href="/student/homework?filter=completed" 
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap
            ${showCompleted ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
         >
            <CheckCircle2 size={16} />
            Terminés
         </Link>
      </div>

      {/* Homework List */}
      <div className="space-y-4">
          {homeworks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      {showCompleted ? <CheckCircle2 size={32} /> : <BookOpen size={32} />}
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-1">
                      {showCompleted ? "Aucun devoir terminé" : "Rien à faire ! 🎉"}
                  </h3>
                  <p className="text-slate-400">
                      {showCompleted ? "Finis tes devoirs pour les voir ici." : "Profite de ton temps libre ou demande un défi à Kogito !"}
                  </p>
              </div>
          ) : (
              homeworks.map(hw => (
                  <div key={hw.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5 group items-start md:items-center">
                       
                       {/* Icon / Source */}
                       <div className={`h-14 w-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl
                            ${hw.source === 'AI' ? 'bg-violet-100 text-violet-600' : 'bg-orange-100 text-orange-600'}
                       `}>
                            {hw.source === 'AI' ? <Sparkles size={24} /> : <User size={24} />}
                       </div>

                       <div className="flex-1 min-w-0">
                           <div className="flex flex-wrap items-center gap-2 mb-1">
                               <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{hw.subject}</span>
                               {hw.source === 'AI' ? (
                                   <span className="bg-violet-50 text-violet-600 text-[10px] px-2 py-0.5 rounded-full font-bold border border-violet-100 flex items-center gap-1">
                                       <Sparkles size={10} /> Kogito Challenge
                                   </span>
                               ) : (
                                   <span className="bg-orange-50 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-bold border border-orange-100 flex items-center gap-1">
                                       <User size={10} /> {hw.tutor?.user.name || "Tuteur"}
                                   </span>
                               )}
                           </div>
                           <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-700 transition-colors">{hw.title}</h3>
                           {hw.description && <p className="text-slate-500 text-sm line-clamp-2">{hw.description}</p>}
                           
                           {hw.dueDate && (
                               <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-400">
                                   <Clock size={14} />
                                   Pour le {new Date(hw.dueDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                               </div>
                           )}
                       </div>

                       {/* Action */}
                       <div className="w-full md:w-auto flex flex-col items-center gap-2">
                            {/* If AI Homework, link to detail page */}
                            {hw.source === 'AI' || (hw.content as any)?.questions ? (
                                <Link 
                                    href={`/student/homework/${hw.id}`}
                                    className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2
                                    ${hw.isCompleted 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                        : 'bg-violet-600 text-white border-violet-600 hover:bg-violet-700 hover:-translate-y-0.5 shadow-md shadow-violet-200'}`}
                                >
                                    {hw.isCompleted ? (
                                        <>
                                            <div className="w-5 h-5 rounded-full border border-emerald-600 flex items-center justify-center text-[10px] font-bold">✓</div>
                                            Voir la correction
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-5 h-5 rounded border border-white/50 bg-white/20 flex items-center justify-center text-xs">GO</div>
                                            Commencer
                                        </>
                                    )}
                                </Link>
                            ) : (
                                !hw.isCompleted && (
                                    <form action={toggleHomeworkStatus.bind(null, hw.id, true)}>
                                        <button className="w-full md:w-auto whitespace-nowrap px-6 py-3 bg-white border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group/btn">
                                            <div className="w-5 h-5 rounded border-2 border-slate-300 group-hover/btn:border-emerald-500 flex items-center justify-center transition-colors"></div>
                                            Marquer fait
                                        </button>
                                    </form>
                                )
                            )}
                       </div>
                  </div>
              ))
          )}
      </div>
    </div>
  );
}
