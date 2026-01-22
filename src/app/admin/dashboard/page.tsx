import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAdminDashboardStats, getRecentUsers } from "@/actions/admin-actions"
import { 
    Users, 
    GraduationCap, 
    TrendingUp, 
    DollarSign,
    MoreVertical,
    Calendar,
    CheckCircle2,
    AlertCircle
} from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  // Basic role protection
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const [statsData, recentUsers] = await Promise.all([
      getAdminDashboardStats(),
      getRecentUsers()
  ])

  const stats = [
    { 
        name: 'Total Utilisateurs', 
        value: statsData?.users.value.toString() || '0', 
        change: `${statsData?.users.change.toFixed(1)}%`, 
        type: (statsData?.users.change || 0) >= 0 ? 'increase' : 'decrease', 
        icon: Users, 
        color: 'text-blue-600', 
        bg: 'bg-blue-100' 
    },
    { 
        name: 'Tuteurs Actifs', 
        value: statsData?.tutors.value.toString() || '0', 
        change: `${statsData?.tutors.change.toFixed(1)}%`, 
        type: (statsData?.tutors.change || 0) >= 0 ? 'increase' : 'decrease', 
        icon: GraduationCap, 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-100' 
    },
    { 
        name: 'Sessions ce mois', 
        value: statsData?.sessions.value.toString() || '0', 
        change: `${statsData?.sessions.change.toFixed(1)}%`, 
        type: (statsData?.sessions.change || 0) >= 0 ? 'increase' : 'decrease', 
        icon: Calendar, 
        color: 'text-purple-600', 
        bg: 'bg-purple-100' 
    },
    { 
        name: 'Revenu Mensuel', 
        value: `${statsData?.revenue.value.toFixed(2)} €`, 
        change: `${statsData?.revenue.change.toFixed(1)}%`, 
        type: (statsData?.revenue.change || 0) >= 0 ? 'increase' : 'decrease', 
        icon: DollarSign, 
        color: 'text-indigo-600', 
        bg: 'bg-indigo-100' 
    },
  ]

  return (
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tableau de bord</h1>
                <p className="text-slate-500 mt-1">Bienvenue, {session.user.name}</p>
            </div>
            <div className="flex gap-3">
                <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                    Filtrer
                </button>
                <Link href="/admin/users/employees/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2">
                    <Users size={16} />
                    Ajouter un employé
                </Link>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            stat.type === 'increase' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                            {stat.change}
                        </span>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-slate-500">{stat.name}</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity / Users */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-900">Inscriptions Récentes</h2>
                    <Link href="/admin/users" className="text-blue-600 text-sm font-medium hover:text-blue-700">Tout voir</Link>
                </div>
                <div className="divide-y divide-slate-100">
                    {recentUsers.map((user, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                                    {user.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{user.name}</p>
                                    <p className="text-xs text-slate-500">{user.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    user.status === 'Actif' || user.status === 'APPROVED'
                                        ? 'bg-green-100 text-green-800' 
                                        : user.status === 'En attente' || user.status === 'PENDING'
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-red-100 text-red-800'
                                }`}>
                                    {user.status === 'APPROVED' ? 'Actif' : user.status === 'PENDING' ? 'En attente' : user.status}
                                </span>
                                <span className="hidden sm:block text-xs text-slate-400">{user.date}</span>
                                <button className="text-slate-400 hover:text-slate-600">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {recentUsers.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            Aucune inscription récente.
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions / System Status */}
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">État du Système</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-green-500 h-5 w-5" />
                                <span className="text-sm text-slate-700">Base de données</span>
                            </div>
                            <span className="text-xs font-medium text-green-600">Opérationnel</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-green-500 h-5 w-5" />
                                <span className="text-sm text-slate-700">API Serveur</span>
                            </div>
                            <span className="text-xs font-medium text-green-600">Opérationnel</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-green-500 h-5 w-5" />
                                <span className="text-sm text-slate-700">Service Email</span>
                            </div>
                            <span className="text-xs font-medium text-green-600">Opérationnel</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                    <h3 className="text-lg font-bold mb-2">Besoin d'aide ?</h3>
                    <p className="text-indigo-100 text-sm mb-4">Consultez la documentation technique ou contactez le support dédiée.</p>
                    <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg py-2 text-sm font-medium transition-colors">
                        Documentation
                    </button>
                </div>
            </div>
        </div>
      </div>
  )
}
