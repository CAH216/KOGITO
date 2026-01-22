import Link from 'next/link';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { 
  Calendar, 
  Clock, 
  Video, 
  Plus, 
  Trophy,
  BookOpen,
  CheckCircle,
  MoreHorizontal,
  Wallet,
  Sparkles
} from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';

// --- DATA FETCHING ---

async function getData() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect('/auth/login');

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            parentProfile: {
                include: {
                    children: {
                        include: {
                            sessions: { take: 1, orderBy: { startTime: 'desc' } } // For stats?
                        }
                    }
                }
            }
        }
    });

    if (!user || !user.parentProfile) redirect('/auth/login'); // Should not happen due to role check in layout

    const students = user.parentProfile.children;
    const cookieStore = await cookies();
    const currentStudentId = cookieStore.get('currentStudentId')?.value;

    const currentStudent = students.find(s => s.id === currentStudentId) || students[0];

    return { 
        user, 
        students, 
        currentStudent 
    };
}

export default async function ParentDashboard() {
  const { user, students, currentStudent } = await getData();

  // If no children, show onboarding state
  if (!students.length) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
              <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                  <Plus size={40} />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Bienvenue sur Kogito !</h1>
              <p className="text-slate-500 max-w-md mb-8">Pour commencer, ajoutez le profil de votre premier enfant afin de suivre ses progrès et réserver des cours.</p>
              <Link href="/parent/children" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200">
                  Ajouter un enfant
              </Link>
          </div>
      )
  }

  // --- SPECIFIC DATA FOR CURRENT STUDENT ---
  
  // 1. Next Scheduled Session
  const nextSession = await prisma.learningSession.findFirst({
      where: {
          studentId: currentStudent.id,
          status: 'SCHEDULED',
          startTime: { gte: new Date() }
      },
      orderBy: { startTime: 'asc' },
      include: { tutor: { include: { user: true } } }
  });

  // 2. Shared Victories (Kogito)
  const sharedSessions = await prisma.kogitoSession.findMany({
    where: { 
        studentProfile: { studentId: currentStudent.id },
        isSharedWithParent: true
    },
    orderBy: { sharedAt: 'desc' },
    take: 3
  });

  // 3. Learning Summaries (Kogito)
  const recentSummaries = await prisma.kogitoSession.findMany({
    where: { 
        studentProfile: { studentId: currentStudent.id },
        parentSummary: { not: null },
        isSharedWithParent: false
    },
    orderBy: { endedAt: 'desc' },
    take: 3
  });

  // 4. Stats (Hours Done)
  // TODO: Aggregate proper sum of duration
  const sessionsDone = await prisma.learningSession.count({
      where: { studentId: currentStudent.id, status: 'COMPLETED' }
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
             {currentStudent 
                ? `Tableau de bord de ${currentStudent.name}` 
                : "Bonjour, Parents 👋"
             }
          </h1>
          <p className="text-slate-500">
             Suivi détaillé de l&apos;activité scolaire
          </p>
        </div>
        <div className="flex gap-3">
             <Link 
                href="/parent/children"
                className="hidden md:inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
                Gérer les enfants
            </Link>
            <Link 
                href="/parent/tutors/search"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
            >
                <Plus size={20} />
                Réserver un cours
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main) */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* NEXT SESSION CARD */}
            {nextSession ? (
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-indigo-100 text-xs font-bold uppercase tracking-wider mb-2 border border-white/10">
                                    Prochain cours
                                </span>
                                <h2 className="text-3xl font-bold mb-1">{nextSession.subject}</h2>
                                <p className="text-indigo-100 flex items-center gap-2">
                                    avec {nextSession.tutor.user.name}
                                </p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-inner">
                                <Video className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6 items-center pt-6 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <Calendar className="w-5 h-5 text-indigo-200" />
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-200 font-medium">Date</p>
                                    <p className="font-bold">{new Date(nextSession.startTime).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <Clock className="w-5 h-5 text-indigo-200" />
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-200 font-medium">Heure</p>
                                    <p className="font-bold">
                                        {new Date(nextSession.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        {' - '}
                                        {nextSession.endTime ? new Date(nextSession.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '...'}
                                    </p>
                                </div>
                            </div>
                             <div className="flex-1 text-right">
                                {/* Link to specific session room or detail */}
                                 <Link href={`/interview/${nextSession.id}`} className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                                    Rejoindre la salle
                                 </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Calendar size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Aucun cours prévu</h3>
                    <p className="text-slate-500 mb-6">Planifiez le prochain cours pour {currentStudent.name} dès maintenant.</p>
                    <Link href="/parent/tutors/search" className="text-indigo-600 font-bold hover:underline">
                        Trouver un tuteur &rarr;
                    </Link>
                </div>
            )}

            {/* MUR DES FIERTÉS (Responsive Stack) */}
            <div className="space-y-6">
                
                {sharedSessions.length > 0 && (
                     <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="bg-white p-2 rounded-xl shadow-sm ring-1 ring-amber-100">
                                <Trophy className="text-amber-500 w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-900 text-lg">Le Mur des Fiertés</h3>
                                <p className="text-sm text-amber-700 font-medium">Victoires de {currentStudent.name}</p>
                            </div>
                        </div>

                        <div className="grid gap-4 relative z-10 sm:grid-cols-1">
                            {sharedSessions.map(session => (
                                <div key={session.id} className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
                                     <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-amber-200">
                                                Victoire
                                            </span>
                                            <span className="font-bold text-slate-900 capitalize text-lg">{session.subject}</span>
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-lg">
                                            {session.sharedAt ? new Date(session.sharedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'Récemment'}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                         <div className="w-1 bg-amber-200 rounded-full self-stretch min-h-[30px]"></div>
                                         <p className="text-slate-700 italic flex-1 text-sm md:text-base">
                                            "{session.parentSummary || "J'ai réussi cet exercice !"}"
                                         </p>
                                    </div>
                                    <div className="flex justify-end pt-2 border-t border-slate-50">
                                        <Link href={`/parent/messages`} className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                                            Féliciter {currentStudent.name} &rarr;
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                )}

                {/* SUIVI D'APPRENTISSAGE */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 p-2.5 rounded-xl">
                                <BookOpen className="text-indigo-600 w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Suivi d&apos;apprentissage</h3>
                                <p className="text-xs text-slate-500">Résumés automatiques par Kogito</p>
                            </div>
                        </div>
                        <span className="hidden sm:inline-block text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                            Dernières sessions
                        </span>
                    </div>

                    {recentSummaries.length === 0 && sharedSessions.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-20" />
                            <p className="font-medium">Aucune activité récente.</p>
                            <p className="text-xs mt-1 opacity-70">Les sessions partagées apparaîtront dans le Mur des Fiertés.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentSummaries.map(session => (
                                <div key={session.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-indigo-950 capitalize">{session.subject}</span>
                                        <span className="text-xs text-slate-500 font-medium">
                                            {session.endedAt ? new Date(session.endedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : 'Date inconnue'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
                                        {session.parentSummary}
                                    </p>
                                </div>
                            ))}
                            {recentSummaries.length === 0 && (
                                <p className="text-sm text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl">Pas d&apos;autres sessions récentes.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Children Grid - ALL CHILDREN */}
            <div>
                <div className="flex items-center justify-between mb-4 mt-8">
                    <h3 className="font-bold text-slate-900 text-lg">Vos Enfants</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {students.map(child => (
                        <ChildCard 
                            key={child.id}
                            id={child.id}
                            name={child.name}
                            grade={child.grade} 
                            isActive={child.id === currentStudent.id}
                        />
                    ))}
                     <Link href="/parent/children" className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer group h-full min-h-[140px]">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-indigo-100 transition-colors">
                            <Plus className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        </div>
                        <p className="font-bold text-slate-700 text-sm group-hover:text-indigo-700">Ajouter un enfant</p>
                    </Link>
                </div>
            </div>

        </div>

        {/* Right Column (Sidebar Widgets) */}
        <div className="space-y-6">

            {/* Wallet / Credit Widget */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                        <Wallet className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-slate-900">Solde Tuteur</h3>
                </div>
                
                <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-black text-slate-900">{user.parentProfile?.hoursBalance || 0}</span>
                    <span className="text-slate-500 font-medium">heures</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
                    <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(((user.parentProfile?.hoursBalance || 0) / 20) * 100, 100)}%` }}
                    ></div>
                </div>
                <p className="text-xs text-emerald-600 font-bold mb-5 flex items-center gap-1">
                    <Sparkles size={12} /> IA Kogito illimitée incluse
                </p>
                <Link href="/parent/billing" className="block w-full text-center py-3 border-2 border-slate-100 rounded-xl text-slate-700 font-bold hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors">
                    Recharger le compte
                </Link>
            </div>

            {/* Tutors Promo */}
            <div className="bg-indigo-950 rounded-3xl p-6 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MoreHorizontal className="w-6 h-6 text-indigo-300" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Besoin de renfort ?</h3>
                    <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
                        Des centaines de tuteurs qualifiés sont disponibles pour aider {currentStudent.name}.
                    </p>
                    <Link href="/parent/tutors/search" className="block w-full py-3 bg-white text-indigo-950 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
                        Trouver un tuteur
                    </Link>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

// --- SUBCOMPONENTS ---

function ChildCard({ id, name, grade, isActive }: { id: string, name: string, grade?: string | null, isActive: boolean }) {
    // We could add switching logic here via server action or client component
    // For now simple display
    return (
        <div className={`p-5 rounded-2xl border transition-all relative overflow-hidden group
            ${isActive 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
            }
        `}>
            {isActive && <div className="absolute top-3 right-3 text-indigo-200"><CheckCircle size={16} /></div>}
            
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                    ${isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600'}
                `}>
                    {name.charAt(0)}
                </div>
                <div>
                    <h4 className={`font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>{name}</h4>
                    <p className={`text-sm ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>{grade || 'Niveau inconnu'}</p>
                </div>
            </div>
        </div>
    )
}
