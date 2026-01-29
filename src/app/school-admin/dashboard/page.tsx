import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Calendar, 
  MoreHorizontal, 
  ArrowUpRight, 
  Copy,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getSchoolNotifications } from "@/actions/school-reports-actions";

export default async function SchoolDashboard() {
  const session = await getServerSession(authOptions);
  
  // Fetch real data
  const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      include: { organization: true }
  });

  const notifications = user?.organizationId ? await getSchoolNotifications(user.organizationId) : [];

  if (!user?.organization) {
      return <div className="p-8">Erreur: Organisation non trouvée. Veuillez contacter le support.</div>;
  }

  const organization = user.organization;
  const organizationName = organization.name;
  
  // 1. Fetch Students Count
  const studentsCount = await prisma.student.count({
      where: { organizationId: organization.id }
  });

  // 2. Fetch Tutors Count
  const tutorsCount = await prisma.tutorProfile.count({
      where: { organizationId: organization.id }
  });

  // 3. Fetch Completed Sessions
  const completedSessions = await prisma.learningSession.count({
      where: {
          student: { organizationId: organization.id },
          status: 'COMPLETED'
      }
  });

  // 4. Analytics: Top Subjects (Aggregation from AI stats)
  // Since we don't have a direct aggregation yet, let's fetch recent sessions and count in memory for now
  // In production, use groupBy.
  const recentAiSessions = await prisma.kogitoSession.findMany({
      where: {
          studentProfile: {
              student: { organizationId: organization.id }
          }
      },
      select: { subject: true },
      take: 50,
      orderBy: { startedAt: 'desc' }
  });

  const subjectCounts: Record<string, number> = {};
  recentAiSessions.forEach(s => {
      // Normalize subject
      const sub = s.subject || 'Général';
      subjectCounts[sub] = (subjectCounts[sub] || 0) + 1;
  });

  const topSubjects = Object.entries(subjectCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5) // Top 5
        .map(([name, count]) => ({ name, count, percentage: Math.round((count / recentAiSessions.length) * 100) }));


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Vue d&apos;ensemble</h1>
           <p className="text-slate-500 mt-1">Bienvenue sur votre espace de gestion, {organizationName}.</p>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                Année Scolaire 2025-2026
            </span>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
                <Calendar size={16} />
                Exporter le rapport
            </button>
        </div>
      </div>

      {/* 2. Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
         <StatCard 
            title="Élèves Inscrits" 
            value={studentsCount.toString()} 
            trend="--" 
            trendUp={true} 
            icon={Users} 
            color="blue"
            description="Total"
         />
         <StatCard 
            title="Tuteurs Actifs" 
            value={tutorsCount.toString()} 
            trend="--" 
            trendUp={true} 
            icon={GraduationCap} 
            color="emerald"
            description="Total"
         />
         <StatCard 
            title="Sessions" 
            value={completedSessions.toString()} 
            trend="Completées" 
            trendUp={true} 
            icon={Clock} 
            color="violet"
            description="Total"
         />
         <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-5 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Copy size={64} />
            </div>
            <h3 className="text-blue-100 font-medium text-sm mb-1">Code Établissement</h3>
            <div className="flex items-baseline gap-2 mb-4">
               <span className="text-2xl font-mono font-bold tracking-wider">{organization.code || 'NO-CODE'}</span>
            </div>
            <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 backdrop-blur-sm">
               <Copy size={16} />
               Copier le code
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart Section (Subject Analytics) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-slate-900">Activité Pédagogique (Top Sujets)</h3>
                    <p className="text-xs text-slate-400">Basé sur les conversations IA des élèves</p>
                  </div>
              </div>
              
              {/* Simple Bar Chart Visualization */}
              <div className="space-y-5 h-64 overflow-y-auto pr-2">
                  {topSubjects.length > 0 ? topSubjects.map((subject, i) => (
                      <div key={i} className="space-y-1">
                          <div className="flex justify-between text-sm">
                              <span className="font-medium text-slate-700 flex items-center gap-2">
                                  <span className={`w-3 h-3 rounded-full ${['bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-pink-500', 'bg-emerald-500'][i % 5]}`}></span>
                                  {subject.name}
                              </span>
                              <span className="text-slate-500 font-medium">{subject.count} sessions</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                style={{ width: `${subject.percentage}%` }} 
                                className={`h-full rounded-full transition-all duration-1000 ${['bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-pink-500', 'bg-emerald-500'][i % 5]}`}
                              ></div>
                          </div>
                      </div>
                  )) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400">
                           <TrendingUp size={32} className="mb-2 opacity-50"/>
                           <p>Aucune donnée disponible pour le moment.</p>
                      </div>
                  )}
              </div>
          </div>

          {/* Recent Activity List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900">Dernières Notifications</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Tout voir</button>
              </div>
              
              <div className="space-y-6">
                  {notifications.length > 0 ? (
                      notifications.map((n: any) => {
                          const IconComponent = {
                              'Users': Users,
                              'Calendar': Calendar,
                              'GraduationCap': GraduationCap,
                              'AlertCircle': AlertCircle,
                              'CheckCircle': CheckCircle
                          }[n.icon as string] || Users;

                          return (
                            <ActivityItem 
                                key={n.id}
                                icon={IconComponent}
                                color={n.color}
                                title={n.title}
                                desc={n.desc}
                                time={new Date(n.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            />
                          );
                      })
                  ) : (
                      <p className="text-sm text-slate-500 text-center py-4">Aucune notification récente.</p>
                  )}
              </div>
          </div>

      </div>

      {/* Quick Actions Grid */}
      <div>
          <h3 className="font-bold text-slate-900 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <QuickActionCard title="Configurer le Cerveau" href="/school-admin/ai-rules" desc="Modifier les règles de l'IA" icon={AlertCircle} color="emerald" />
              <QuickActionCard title="Ajouter un élève" href="/school-admin/students" desc="Création manuelle de compte" icon={Users} color="blue" />
              <QuickActionCard title="Inviter des enseignants" href="/school-admin/teachers" desc="Envoi d'invitations par email" icon={GraduationCap} color="violet" />
              <QuickActionCard title="Générer un rapport" href="/school-admin/reports" desc="Statistiques de la semaine" icon={TrendingUp} color="amber" />
          </div>
      </div>

    </div>
  );
}

// Subcomponents

function StatCard({ title, value, trend, trendUp, icon: Icon, color, description }: any) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        violet: "bg-violet-50 text-violet-600",
        amber: "bg-amber-50 text-amber-600",
    }[color as string] || "bg-slate-50 text-slate-600"; // Type assertion for simple mapping

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-lg ${colorClasses}`}>
                    <Icon size={20} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {trendUp ? <TrendingUp size={12} /> : <div className="h-3 w-3 bg-red-400 rounded-full" />}
                    {trend}
                </div>
            </div>
            <div>
                <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                <p className="text-xs text-slate-400 mt-1">{description}</p>
            </div>
        </div>
    )
}

function ActivityItem({ icon: Icon, color, title, desc, time }: any) {
    const bgColors = {
        blue: "bg-blue-100 text-blue-600",
        emerald: "bg-emerald-100 text-emerald-600",
        amber: "bg-amber-100 text-amber-600",
        violet: "bg-violet-100 text-violet-600"
    }[color as string] || "bg-slate-100 text-slate-600";

    return (
        <div className="flex gap-4">
            <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${bgColors}`}>
                <Icon size={18} />
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                <p className="text-[10px] text-slate-400 mt-1">{time}</p>
            </div>
        </div>
    )
}

function QuickActionCard({ title, desc, href, icon: Icon, color }: any) {
    const colorClasses = {
        blue: "text-blue-600 bg-blue-50 group-hover:bg-blue-100",
        emerald: "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100",
        violet: "text-violet-600 bg-violet-50 group-hover:bg-violet-100",
        amber: "text-amber-600 bg-amber-50 group-hover:bg-amber-100",
        slate: "text-slate-600 bg-slate-50 group-hover:bg-slate-100",
    }[color as string] || "text-slate-600 bg-slate-50 group-hover:bg-slate-100";

    const Content = () => (
        <>
            <div className="flex items-center justify-between w-full mb-3">
                <div className={`p-2 rounded-lg transition-colors ${colorClasses}`}>
                    {Icon ? <Icon size={20} /> : <div className="h-5 w-5 bg-current rounded-full opacity-20" />}
                </div>
                <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div>
                 <span className="font-semibold text-slate-800 group-hover:text-blue-700 block mb-1">{title}</span>
                 <p className="text-xs text-slate-500 group-hover:text-slate-600">{desc}</p>
            </div>
        </>
    );

    if (href) {
        return (
            <Link href={href} className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left group h-full">
                <Content />
            </Link>
        );
    }

    return (
        <button className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left group h-full w-full">
            <Content />
        </button>
    )
}
