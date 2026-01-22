import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { 
  Clock, 
  ArrowRight,
  MessageCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import StudentSubjectSelector from './StudentSubjectSelector';
import CustomSubjectButton from './CustomSubjectButton';

export default async function ChatDashboard() {
  const cookieStore = await cookies();
  const currentStudentId = cookieStore.get('currentStudentId')?.value;

  if (!currentStudentId) redirect('/profiles');

  const student = await prisma.student.findUnique({
    where: { id: currentStudentId },
    include: {
        kogitoProfile: {
             include: {
                 sessions: {
                     orderBy: { startedAt: 'desc' },
                     take: 4
                 }
             }
        }
    }
  });

  if (!student) redirect('/profiles');

  const recentSessions = student.kogitoProfile?.sessions || [];

  // Fetch all distinct subjects (to show custom ones created by user)
  const distinctSubjects = await prisma.kogitoSession.findMany({
      where: {
        studentProfile: { studentId: currentStudentId }
      },
      select: { subject: true },
      distinct: ['subject']
  });

  const SUBJECTS = [
    { id: 'math', label: 'Mathématiques', iconName: 'math', color: 'bg-blue-500', gradient: 'from-blue-500 to-indigo-600', description: 'Algèbre, Géométrie, Calcul...' },
    { id: 'fr', label: 'Français', iconName: 'fr', color: 'bg-rose-500', gradient: 'from-rose-500 to-pink-600', description: 'Grammaire, Conjugaison, Lecture...' },
    { id: 'hist', label: 'Histoire-Géo', iconName: 'hist', color: 'bg-emerald-500', gradient: 'from-emerald-500 to-teal-600', description: 'Dates, Cartes, Évènements...' },
    { id: 'sci', label: 'Sciences', iconName: 'sci', color: 'bg-violet-500', gradient: 'from-violet-500 to-purple-600', description: 'SVT, Physique, Chimie...' },
    { id: 'eng', label: 'Anglais', iconName: 'eng', color: 'bg-orange-500', gradient: 'from-orange-500 to-amber-600', description: 'Vocabulaire, Verbes irréguliers...' },
  ] as const;

  const defaultLabels = new Set(SUBJECTS.map(s => s.label));
  
  // Custom subjects are those distinct subjects NOT in the default list
  const customSubjects = distinctSubjects
    .map(s => s.subject)
    .filter(s => !defaultLabels.has(s as any))
    .map(s => ({
        id: s,
        label: s,
        iconName: 'custom',
        color: 'bg-indigo-500',
        gradient: 'from-indigo-500 to-purple-600',
        description: 'Matière personnalisée'
    }));
    
  const displaySubjects = [...SUBJECTS, ...customSubjects];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
        
        <div className="mb-4">
            <Link href="/student/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 font-medium text-sm hover:shadow-md">
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Retour au tableau de bord</span>
                <span className="sm:hidden">Retour</span>
            </Link>
        </div>

        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-fade-in-down">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-indigo-600 p-2 rounded-xl">
                   <Sparkles className="text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-indigo-600 font-bold tracking-wide uppercase text-xs md:text-sm">Espace Apprentissage</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
              Bonjour, {student.name} ! 👋
            </h1>
            <p className="text-base md:text-lg text-slate-500 font-medium max-w-2xl">
              Kogito est prêt à t'aider. Choisis une matière pour commencer une nouvelle session ou reprends tes révisions.
            </p>
          </div>
          
          <div className="hidden md:block">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                 <div className="bg-green-100 p-3 rounded-full">
                    <Clock className="text-green-600 w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Temps d'étude auj.</p>
                    <p className="text-xl font-black text-slate-800">45 min</p>
                 </div>
              </div>
          </div>
        </header>

        {/* SECTION 1: START NEW */}
        <section className="animate-fade-in-up">
           <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-indigo-600 rounded-full"></div>
              Nouvelle Session
           </h2>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {displaySubjects.map((sub) => (
                  <StudentSubjectSelector 
                    key={sub.id} 
                    subject={sub.label}
                    gradient={sub.gradient}
                    iconName={sub.iconName}
                    description={sub.description}
                  />
              ))}
              <CustomSubjectButton />
           </div>
        </section>

        {/* SECTION 2: HISTORY */}
        {recentSessions.length > 0 && (
          <section className="animate-fade-in-up delay-100">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-1 h-8 bg-slate-300 rounded-full"></div>
                    Reprendre une conversation
                </h2>
                <button className="text-indigo-600 font-bold text-sm hover:underline">Voir tout l'historique</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentSessions.map((session) => (
                   <Link 
                      href={`/student/chat/${session.id}`} 
                      key={session.id}
                      className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex flex-col justify-between h-40"
                   >
                      <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                             <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                                ${session.subject.includes('Math') ? 'bg-blue-500' : 
                                  session.subject.includes('Fran') ? 'bg-rose-500' : 
                                  'bg-slate-500'}
                             `}>
                                {session.subject[0]}
                             </div>
                             <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                    {session.subject}
                                </h3>
                                <p className="text-slate-400 text-xs font-medium">
                                    {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(session.startedAt)}
                                </p>
                             </div>
                          </div>
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                              {session.mode}
                          </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                          <p className="text-slate-500 text-sm line-clamp-1 italic">
                             {session.topic ? `Sujet : ${session.topic}` : "Continuez votre discussion..."}
                          </p>
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <ArrowRight size={16} />
                          </div>
                      </div>
                   </Link>
                ))}
             </div>
          </section>
        )}
      </div>
    </div>
  );
}
