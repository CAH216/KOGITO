import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Calendar, MessageCircle, BookOpen, Trophy, Video, Clock, ArrowRight, Star, Brain, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import OnboardingWrapper from '../components/OnboardingWrapper';
import KnowledgeGalaxy from './components/KnowledgeGalaxy';

// Helper to format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
};

// Helper for relative time
const getRelativeTime = (date: Date) => {
  const diff = date.getTime() - new Date().getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (minutes < 0) return "En cours";
  if (minutes < 60) return `Dans ${minutes} minutes`;
  if (hours < 24) return `Dans ${hours}h`;
  return formatDate(date);
};

export default async function StudentDashboard() {
  const cookieStore = await cookies();
  const currentStudentId = cookieStore.get('currentStudentId')?.value;

  if (!currentStudentId) {
    redirect('/profiles');
  }

  const student = await prisma.student.findUnique({
    where: { id: currentStudentId },
    select: { name: true, grade: true }
  });

  if (!student) {
    redirect('/profiles');
  }

  // Fetch Next Session & Upcoming
  const upcomingSessions = await prisma.learningSession.findMany({
    where: {
      studentId: currentStudentId,
      startTime: { gt: new Date() },
      status: 'SCHEDULED'
    },
    orderBy: { startTime: 'asc' },
    take: 5,
    include: {
      tutor: { include: { user: true } }
    }
  });
  
  const nextSession = upcomingSessions[0];

  // Fetch Homework
  const homeworks = await prisma.homework.findMany({
    where: { studentId: currentStudentId, isCompleted: false },
    orderBy: { dueDate: 'asc' },
    take: 3
  });

  // Fetch Kogito Mastery
  const kogitoProfile = await prisma.kogitoStudentProfile.findUnique({
    where: { studentId: currentStudentId },
    include: { 
        mastery: { 
            orderBy: { level: 'desc' },
            take: 4
        }
    }
  });

  // CHECK ONBOARDING STATUS
  // If profile doesn't exist or onboarding is not done, show Wizard
  if (!kogitoProfile || !kogitoProfile.onboardingDone) {
      return <OnboardingWrapper initialName={student.name || ''} />;
  }

  const masteryItems = kogitoProfile.mastery || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* 1. Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-indigo-950 capitalize">Coucou, {student.name} ! 👋</h1>
           <p className="text-indigo-600 font-medium text-lg mt-1">Prêt pour apprendre de nouvelles choses aujourd&apos;hui ?</p>
        </div>
        <div className="hidden md:block">
            <span className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-indigo-100 shadow-sm text-indigo-800 font-bold text-sm capitalize">
                📅  {formatDate(new Date())}
            </span>
        </div>
      </div>

{/* 2. Main Action Area: Next Session & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Next Session (Left - Big) */}
        <div className="lg:col-span-2">
            {nextSession ? (
                <div className="h-full bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-1 shadow-xl shadow-indigo-200 text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
                    
                    <div className="h-full flex flex-col justify-between bg-white/10 backdrop-blur-sm rounded-[20px] p-6 sm:p-8 relative z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-indigo-400/30 text-indigo-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                                    Prochain Cours
                                </span>
                                <span className="flex items-center gap-1 text-indigo-200 text-sm font-medium">
                                    <Clock size={14} />
                                    {getRelativeTime(nextSession.startTime)}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">{nextSession.subject}</h2>
                            <div className="text-indigo-100 text-lg flex items-center gap-2">
                                avec <span className="underline decoration-indigo-400 decoration-2 underline-offset-2 font-semibold">{nextSession.tutor.user.name}</span>
                            </div>
                        </div>

                        <Link href={`/session/${nextSession.id}`} className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 group">
                              <Video className="h-6 w-6" />
                              Rejoindre
                              <ArrowRight className="h-5 w-5 opacity-50 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                  </div>
                </div>
            ) : (
                <div className="h-full bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-1 shadow-xl shadow-teal-200 text-white overflow-hidden relative">
                    <div className="h-full bg-white/10 backdrop-blur-sm rounded-[20px] p-8 relative z-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                        <h2 className="text-2xl font-bold mb-2">Tout est calme ! 🌟</h2>
                        <p className="text-teal-100">Pas de cours prévu aujourd'hui. C'est le moment idéal pour explorer.</p>
                        </div>
                        <Link href="/student/chat" className="bg-white text-teal-600 hover:bg-teal-50 px-6 py-3 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-1 flex items-center gap-2">
                            <Brain size={20} />
                            Faire un défi IA
                        </Link>
                    </div>
                </div>
            )}
        </div>

        {/* Homework / Devoirs (Right - Vertical List) */}
        <div className="bg-white rounded-3xl p-6 border border-indigo-50 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="text-orange-500 h-5 w-5" />
                    Devoirs
                </h3>
                <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-md">{homeworks.length} à faire</span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-thumb-slate-200 pr-2">
                {homeworks.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">
                        <CheckCircle2 className="mx-auto h-8 w-8 mb-2 opacity-50" />
                        Aucun devoir ! 🎉
                    </div>
                ) : (
                    homeworks.map(hw => (
                        <div key={hw.id} className="p-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 transition-colors group cursor-pointer">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-slate-500 uppercase">{hw.subject}</span>
                                <span className="text-[10px] bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                                    {hw.dueDate ? formatDate(hw.dueDate).split(' ').slice(0,2).join(' ') : 'Sans date'}
                                </span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-orange-700 transition-colors line-clamp-2">{hw.title}</h4>
                        </div>
                    ))
                )}
            </div>
            
            <Link href="/student/homework" className="mt-4 text-center text-xs font-bold text-indigo-500 hover:text-indigo-700 py-2 border-t border-slate-100 block">
                Voir tout l'agenda →
            </Link>
        </div>

      </div>

      {/* --- KNOWLEDGE GALAXY --- */}
      <div>
         <div className="flex items-center justify-between mb-4 px-2">
             <h2 className="text-xl font-black text-indigo-950 flex items-center gap-2">
                <Sparkles className="text-purple-500" />
                La Galaxie du Savoir
             </h2>
             <p className="text-sm text-slate-500 hidden sm:block">Explore tes connaissances comme un univers !</p>
         </div>
         <KnowledgeGalaxy />
      </div>

      {/* 3. Grid Menu - Minimalist & Cool */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Chat AI - Promoted */}
          <Link href="/student/chat" className="group relative bg-gradient-to-tr from-violet-600 to-indigo-600 p-6 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-white overflow-hidden sm:col-span-2">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-colors"></div>
             
             <div className="relative z-10 flex items-start justify-between h-full">
                <div className="flex flex-col justify-between h-full">
                    <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-white/10">
                        <Brain size={28} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl mb-1 flex items-center gap-2">
                            Coach Kogito
                            <Sparkles size={18} className="text-yellow-300 animate-pulse" />
                        </h3>
                        <p className="text-indigo-100 text-sm font-medium pr-8">
                            Discute, pose tes questions et apprends sans stress !
                        </p>
                    </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/10 group-hover:rotate-12 transition-transform">
                    <ArrowRight size={24} />
                </div>
             </div>
          </Link>

          {/* Agenda / Upcoming Sessions List */}
          <div className="bg-white p-6 rounded-3xl border border-indigo-50 shadow-sm overflow-hidden flex flex-col">
             <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Calendar size={20} />
                </div>
                <h3 className="font-bold text-lg text-slate-800">Planning</h3>
             </div>
             
             <div className="space-y-3 flex-1 overflow-y-auto scrollbar-none">
                {upcomingSessions.length <= 1 ? (
                    <div className="text-sm text-slate-400 italic py-2">Rien d'autre de prévu cette semaine.</div>
                ) : (
                    upcomingSessions.slice(1).map(session => (
                        <div key={session.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="bg-slate-100 h-10 w-12 rounded-lg flex flex-col items-center justify-center text-xs font-bold text-slate-600">
                                <span>{new Date(session.startTime).getDate()}</span>
                                <span className="text-[10px] uppercase text-slate-400">{new Date(session.startTime).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 text-sm truncate">{session.subject}</p>
                                <p className="text-xs text-slate-500 truncate">{new Date(session.startTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})} • {session.tutor.user.name}</p>
                            </div>
                        </div>
                    ))
                )}
             </div>
             
             <Link href="/student/tutors" className="mt-3 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                <Calendar size={14} />
                Réserver un cours
             </Link>
          </div>

          {/* Trophies */}
          <Link href="/student/achievements" className="group bg-white p-6 rounded-3xl border border-indigo-50 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between">
             <div>
                <div className="h-14 w-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Trophy size={28} />
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-1">Succès</h3>
                <p className="text-slate-400 text-sm">Niveau {kogitoProfile?.level || 1}</p>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
                 <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${(kogitoProfile?.xp || 0) % 100}%` }}></div>
             </div>
          </Link>

      </div>

      {/* 4. Gamification Progress (Mastery) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-indigo-50 shadow-sm">
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                 <Zap className="text-yellow-400 fill-yellow-400" />
                 Tes Super-Pouvoirs (Maîtrise)
              </h2>
              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {masteryItems.length > 0 ? `${masteryItems.length} Compétences` : 'Niveau 1'}
              </span>
          </div>
          
          <div className="space-y-6">
              {masteryItems.length === 0 ? (
                  // Empty State
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-slate-300">
                          <Trophy size={20} />
                      </div>
                      <p className="text-slate-500 font-medium">Tes compétences apparaîtront ici.</p>
                      <p className="text-xs text-slate-400 mt-1">Discute avec Kogito pour les débloquer !</p>
                  </div>
              ) : (
                  // Dynamic Mastery List
                  masteryItems.map((item) => (
                    <div key={item.id}>
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                            <span className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${item.level > 80 ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span>
                                {item.conceptSlug || "Concept inconnu"}
                            </span>
                            <span className="text-indigo-600">{item.level}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                            <div 
                                className={`h-3 rounded-full transition-all duration-1000 ${item.level > 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                                style={{ width: `${item.level}%` }}
                            ></div>
                        </div>
                    </div>
                  ))
              )}
          </div>
      </div>

    </div>
  );
}
