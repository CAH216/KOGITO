'use client';

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

export default function SchoolDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Vue d&apos;ensemble</h1>
           <p className="text-slate-500 mt-1">Bienvenue sur votre espace de gestion, Lycée Montesquieu.</p>
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
            value="842" 
            trend="+12%" 
            trendUp={true} 
            icon={Users} 
            color="blue"
            description="vs. mois dernier"
         />
         <StatCard 
            title="Tuteurs Actifs" 
            value="35" 
            trend="+4" 
            trendUp={true} 
            icon={GraduationCap} 
            color="emerald"
            description="Nouveaux ce mois"
         />
         <StatCard 
            title="Heures de cours" 
            value="1,240h" 
            trend="+8%" 
            trendUp={true} 
            icon={Clock} 
            color="violet"
            description="Total ce semestre"
         />
         <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-5 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Copy size={64} />
            </div>
            <h3 className="text-blue-100 font-medium text-sm mb-1">Code Établissement</h3>
            <div className="flex items-baseline gap-2 mb-4">
               <span className="text-2xl font-mono font-bold tracking-wider">LM-2026-X8</span>
            </div>
            <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 backdrop-blur-sm">
               <Copy size={16} />
               Copier le code
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart Section (Mock) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900">Activité Pédagogique</h3>
                  <div className="flex gap-2">
                      <select className="text-sm border-slate-200 rounded-md text-slate-600 focus:ring-blue-500 focus:border-blue-500 bg-slate-50">
                          <option>7 derniers jours</option>
                          <option>30 derniers jours</option>
                      </select>
                  </div>
              </div>
              
              {/* Fake Chart Visual */}
              <div className="h-64 flex items-end gap-3 justify-between px-2">
                  {[40, 65, 45, 80, 55, 90, 75, 85, 60, 95, 80, 70].map((h, i) => (
                      <div key={i} className="w-full bg-slate-50 rounded-t-lg relative group">
                          <div 
                            className="bg-blue-600 w-full rounded-t-lg absolute bottom-0 transition-all duration-500 ease-out group-hover:bg-blue-500" 
                            style={{ height: `${h}%` }}
                          ></div>
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                              {h}h
                          </div>
                      </div>
                  ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium uppercase tracking-wide">
                  <span>Jan</span>
                  <span>Fev</span>
                  <span>Mar</span>
                  <span>Avr</span>
                  <span>Mai</span>
                  <span>Juin</span>
                  <span>Juil</span>
                  <span>Aou</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
              </div>
          </div>

          {/* Recent Activity List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900">Dernières Notifications</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Tout voir</button>
              </div>
              
              <div className="space-y-6">
                  <ActivityItem 
                     icon={Users}
                     color="blue"
                     title="Nouvelle inscription"
                     desc="Martin D. (3ème) a rejoint l'établissement"
                     time="Il y a 2h"
                  />
                  <ActivityItem 
                     icon={AlertCircle}
                     color="amber"
                     title="Signalement Absentéisme"
                     desc="3 élèves absents au cours de soutien Maths"
                     time="Il y a 5h"
                  />
                  <ActivityItem 
                     icon={CheckCircle}
                     color="emerald"
                     title="Tuteur Validé"
                     desc="Prof. Sarah L. est maintenant active"
                     time="Hier"
                  />
                   <ActivityItem 
                     icon={GraduationCap}
                     color="violet"
                     title="Nouveau groupe créé"
                     desc="Groupe 'Soutien Physique' ajouté"
                     time="Hier"
                  />
              </div>
          </div>

      </div>

      {/* Quick Actions Grid */}
      <div>
          <h3 className="font-bold text-slate-900 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <QuickActionCard title="Ajouter un élève" desc="Création manuelle de compte" icon={Users} color="slate" />
              <QuickActionCard title="Inviter des enseignants" desc="Envoi d'invitations par email" icon={GraduationCap} color="slate" />
              <QuickActionCard title="Générer un rapport" desc="Statistiques de la semaine" icon={TrendingUp} color="slate" />
              <QuickActionCard title="Gérer les classes" desc="Modification des groupes" icon={Users} color="slate" />
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

function QuickActionCard({ title, desc }: any) {
    return (
        <button className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left group">
            <div className="flex items-center justify-between w-full mb-2">
                <span className="font-semibold text-slate-800 group-hover:text-blue-700">{title}</span>
                <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-500" />
            </div>
            <p className="text-xs text-slate-500">{desc}</p>
        </button>
    )
}
