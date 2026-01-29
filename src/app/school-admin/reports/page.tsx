import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";
import { getSchoolReports } from "@/actions/school-reports-actions";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  
  const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      include: { organization: true }
  });

  const stats = user?.organizationId 
    ? await getSchoolReports(user.organizationId) 
    : { engagementRate: 0, totalHours: 0, avgRating: 0, reviewCount: 0 };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rapports et Statistiques</h1>
          <p className="text-sm text-slate-500">Analysez les performances de votre établissement</p>
        </div>
        <div className="flex gap-2">
            <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Ce mois</option>
                <option>Ce trimestre</option>
                <option>Cette année</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-500 text-sm font-medium mb-2">Taux d'engagement</h3>
              <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-900">{stats?.engagementRate}%</span>
                  <span className="text-sm text-emerald-600 font-medium mb-1 flex items-center">
                    <TrendingUp size={14} className="mr-0.5" /> --
                  </span>
              </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-500 text-sm font-medium mb-2">Heures totales</h3>
              <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-900">{stats?.totalHours}h</span>
                  <span className="text-sm text-emerald-600 font-medium mb-1 flex items-center">
                    <TrendingUp size={14} className="mr-0.5" /> --
                  </span>
              </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-500 text-sm font-medium mb-2">Satisfaction</h3>
              <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-900">{stats?.avgRating}/5</span>
                  <span className="text-sm text-slate-400 mb-1"> ({stats?.reviewCount} avis)</span>
              </div>
          </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 flex items-center justify-center flex-col text-center min-h-[400px]">
          <BarChart3 className="h-16 w-16 text-slate-200 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">Statistiques détaillées bientôt disponibles</h3>
          <p className="text-slate-500 max-w-md mt-2">
              Nous collectons actuellement les données pour générer des graphiques précis sur l'utilisation de l'IA et la progression des élèves.
          </p>
      </div>
    </div>
  );
}
