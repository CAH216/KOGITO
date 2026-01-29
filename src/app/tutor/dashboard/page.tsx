import { 
  TrendingUp, 
  Users, 
  Clock, 
  Star, 
  CalendarDays,
  MoreHorizontal,
  Video,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { getTutorProfile, getTutorDashboardStats } from '@/actions/tutor-actions';
import OnboardingDashboard from '../components/OnboardingDashboard';
import { redirect } from 'next/navigation';

export default async function TutorDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
      redirect('/auth/login');
  }

  const profile = await getTutorProfile(session.user.email);
  
  // REDIRECT TO ONBOARDING IF NOT APPROVED
  if (profile && profile.status !== 'APPROVED') {
      return <OnboardingDashboard tutorProfile={profile} userName={session.user.name} />;
  }

  const dashboardData = await getTutorDashboardStats(session.user.email);
  if (!dashboardData) return null;

  const { stats: realStats, upcomingSessions, pendingRequests } = dashboardData;
  
  // Format stats for display
  const stats = [
    { title: 'Revenus (Total)', value: `${realStats.totalEarnings.toFixed(2)} $`, change: 'Cumul', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Élèves Actifs', value: realStats.activeStudents.toString(), change: 'Total', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Heures Enseignées', value: `${realStats.totalHours}h`, change: 'Total', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Note Moyenne', value: realStats.rating > 0 ? `${realStats.rating.toFixed(1)}/5` : "Nouveau", change: 'Top 5%', icon: Star, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-500 mt-1">Bon retour {session.user.name}, voici ce qui se passe aujourd'hui.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors shadow-sm">
             Mettre à jour mes dispos
           </button>
           <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm shadow-blue-200">
             + Créer une session
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon size={22} className={stat.color} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column: Schedule */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
               <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                 <CalendarDays size={20} className="text-slate-400" />
                 Prochaines Sessions
               </h2>
               <Link href="/tutor/schedule" className="text-blue-600 text-sm font-medium hover:underline">
                 Tout voir
               </Link>
            </div>
            
            <div className="divide-y divide-slate-100">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                      {session.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{session.student}</h4>
                      <p className="text-sm text-slate-500">{session.subject}</p>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end gap-2">
                     <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock size={14} />
                        {new Date(session.startTime).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })} • {new Date(session.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                     </div>
                     {session.isToday ? (
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                           <Video size={16} /> Rejoindre
                        </button>
                     ) : (
                         <span className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                           Programmé
                         </span>
                     )}
                  </div>
                </div>
              ))}
              
              {upcomingSessions.length === 0 && (
                  <div className="p-8 text-center text-slate-500">
                      Aucune session prévue prochainement.
                  </div>
              )}
            </div>
          </div>

          {/* Quick Actions / Tips */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2">Augmentez votre visibilité ! 🚀</h3>
                  <p className="text-blue-100 mb-6 max-w-lg">
                      Complétez votre profil avec une photo professionnelle pour rassurer et attirer plus d'élèves.
                  </p>
                  <Link href="/tutor/settings" className="bg-white text-blue-600 px-5 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors inline-block">
                      Ajouter une photo
                  </Link>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                  <Star size={200} />
              </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
            
            {/* Pending Requests */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-5 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">Demandes en attente</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {pendingRequests.map((req) => (
                        <div key={req.id} className="p-5 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-sm text-slate-900">{req.student}</span>
                                <span className="text-xs text-slate-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-slate-500 mb-2 line-clamp-2">{req.message}</p>
                            <div className="flex gap-2 mt-3">
                                <button className="flex-1 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1">
                                    <CheckCircle size={14} /> Accepter
                                </button>
                                <button className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs rounded-lg hover:border-red-200 hover:text-red-500 transition-colors display-flex items-center">
                                    <XCircle size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {pendingRequests.length === 0 && (
                        <div className="p-5 text-center text-sm text-slate-500">
                            Aucune demande en attente.
                        </div>
                    )}
                    <div className="p-3 text-center">
                        <Link href="/tutor/requests" className="text-xs text-blue-600 hover:underline flex items-center justify-center gap-1">
                            Voir toutes les demandes <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Todo List - Keeping Static for now as no schema yet */}
             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-900 mb-4">A faire</h3>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="mt-0.5 w-4 h-4 rounded border border-slate-300 flex-shrink-0 cursor-pointer hover:border-blue-500"></div>
                        <span>Compléter mon profil (Bio)</span>
                    </li>
                </ul>
            </div>

        </div>
      </div>
    </div>
  )
}
