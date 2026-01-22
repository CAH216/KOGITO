import { prisma } from '@/lib/prisma'
import { 
  Users, 
  FileCheck, 
  MessageSquare, 
  AlertCircle, 
  Clock, 
  CheckCircle2,
  Calendar,
  Building2
} from 'lucide-react';
import Link from 'next/link';

async function getStats() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [pendingTutors, activeSessions, schoolsCount, recentPendingTutors, recentLogs, verifiedCount] = await Promise.all([
        prisma.tutorProfile.count({ 
            where: { status: 'PENDING' } 
        }),
        prisma.learningSession.count({ 
            where: { 
                status: 'SCHEDULED',
                startTime: { gte: new Date() }
            } 
        }),
        prisma.school.count(),
        prisma.tutorProfile.findMany({
            where: { status: 'PENDING' },
            take: 5,
            include: { user: true }
        }),
        prisma.systemLog.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        }),
        prisma.tutorProfile.count({
            where: {
                status: 'APPROVED',
                updatedAt: { gte: oneWeekAgo }
            }
        })
    ]);
    
    // Weekly Goal: Validate 10 tutors
    const weeklyGoalTarget = 10;
    const weeklyGoalProgress = Math.min(Math.round((verifiedCount / weeklyGoalTarget) * 100), 100);

    return {
        pendingTutors,
        openTickets: await prisma.supportTicket.count({ where: { status: 'OPEN' } }),
        activeSessions, 
        schoolsCount,
        recentPendingTutors,
        recentLogs,
        weeklyGoal: {
            current: verifiedCount,
            target: weeklyGoalTarget,
            progress: weeklyGoalProgress
        }
    }
}

export default async function EmployeeDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500">Bienvenue dans votre espace de gestion Kogito.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Tuteurs à vérifier</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-slate-900">{stats.pendingTutors}</h3>
                    {stats.pendingTutors > 0 && <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Urgent</span>}
                </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
                <FileCheck className="w-6 h-6 text-blue-600" />
            </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Tickets Support</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-slate-900">{stats.openTickets}</h3>
                    {/* <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">-2 ajd</span> */}
                </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
             <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Sessions Actives</p>
                 <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-slate-900">{stats.activeSessions}</h3>
                </div>
            </div>
             <div className="p-3 bg-emerald-50 rounded-lg">
                <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
        </div>

         <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
             <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Écoles Partenaires</p>
                 <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-slate-900">{stats.schoolsCount}</h3>
                </div>
            </div>
             <div className="p-3 bg-indigo-50 rounded-lg">
                <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Section: Priority Tasks */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-semibold text-slate-900">Tâches Prioritaires</h3>
                    <Link href="/employee/tutors/verification" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Tout voir</Link>
                </div>
                <div className="divide-y divide-slate-100">
                    
                    {stats.recentPendingTutors.length > 0 ? (
                        stats.recentPendingTutors.map((tutor) => (
                             <div key={tutor.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                                <div className="mt-1">
                                    <AlertCircle className="w-5 h-5 text-orange-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h4 className="font-medium text-slate-900">Validation Dossier Tuteur</h4>
                                        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Nouveau</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Le profil de <span className="font-medium text-slate-900">{tutor.user.name}</span> ({tutor.subjects.join(', ')}) attend votre validation.
                                    </p>
                                    <div className="mt-2 flex gap-2">
                                        <Link href={`/employee/tutors/verification`} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-md font-medium hover:bg-blue-100 transition-colors">
                                            Examiner
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                         <div className="p-8 text-center text-slate-500 text-sm">
                            Toutes les tâches prioritaires ont été traitées.
                        </div>
                    )}
                    
                    {/* Placeholder for future systems - Preserved from mockup but marked simulated */}
                    {/* 
                    <div className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 opacity-75">
                         <div className="mt-1">
                            <Clock className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                             <div className="flex justify-between">
                                <h4 className="font-medium text-slate-900">Demande de contact École</h4>
                                <span className="text-xs text-slate-500">Simulation</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">
                                <span className="font-medium text-slate-900">Lycée Sainte-Marie</span> - Démo 50 licences.
                            </p>
                             <div className="mt-2 flex gap-2">
                                <button className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-md font-medium hover:bg-slate-50 transition-colors">Contacter</button>
                            </div>
                        </div>
                    </div>
                    */}

                </div>
            </div>
        </div>

        {/* Side Section: Notifications / Quick Stats */}
        <div className="space-y-6">
            <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
                <h3 className="font-bold text-lg mb-1">Objectif Hebdo</h3>
                <p className="text-blue-200 text-sm mb-4">Validations de profils ({stats.weeklyGoal.current}/{stats.weeklyGoal.target})</p>
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-bold">{stats.weeklyGoal.progress}%</span>
                    <span className="text-sm text-blue-200 mb-1">atteint</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${stats.weeklyGoal.progress}%` }}></div>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                    {stats.weeklyGoal.progress >= 100 
                        ? "Objectif atteint ! Bravo !" 
                        : `Plus que ${stats.weeklyGoal.target - stats.weeklyGoal.current} dossiers pour atteindre l'objectif.`}
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Activité Récente</h3>
                <div className="space-y-4">
                    {stats.recentLogs.length > 0 ? (
                        stats.recentLogs.map((log) => (
                            <div key={log.id} className="flex gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                                    ${log.level === 'INFO' ? 'bg-blue-100 text-blue-600' : ''}
                                    ${log.level === 'WARNING' ? 'bg-orange-100 text-orange-600' : ''}
                                    ${log.level === 'ERROR' ? 'bg-red-100 text-red-600' : ''}
                                    ${log.level === 'SECURITY' ? 'bg-purple-100 text-purple-600' : ''}
                                `}>
                                    {log.level[0]}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-900">
                                        {/* Try to parse standard messages or just show message */}
                                        {log.message}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {log.user?.name ? `${log.user.name} • ` : ''}
                                        {new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500 italic">Aucune activité récente.</p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
