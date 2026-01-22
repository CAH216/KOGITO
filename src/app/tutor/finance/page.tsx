import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { getTutorFinancials } from '@/actions/tutor-actions';
import { Wallet, TrendingUp, Download, CreditCard, DollarSign } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function FinancePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
      redirect('/auth/login');
  }

  const financials = await getTutorFinancials(session.user.email);
  if (!financials) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Finances</h1>
        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2 w-full md:w-auto">
            <Download size={16} /> Exporter CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2 opacity-90">
                <Wallet className="w-5 h-5" />
                <span className="text-sm font-medium">Solde Disponible</span>
            </div>
            <div className="text-3xl font-bold mb-4">{financials.balance.toFixed(2)} €</div>
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-lg py-2 text-sm font-medium transition-colors">
                Demander un virement
            </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-slate-500">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">Revenus Totaux</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{financials.totalEarnings.toFixed(2)} €</div>
            <div className="text-sm text-green-600 mt-2 flex items-center gap-1">
                +0% <span className="text-slate-400">ce mois</span>
            </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-2 text-slate-500">
                <CreditCard className="w-5 h-5" />
                <span className="text-sm font-medium">Dernier virement</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">0.00 €</div>
            <div className="text-sm text-slate-400 mt-2">Aucun virement récent</div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Historique des transactions</h3>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                      <tr>
                          <th className="px-4 md:px-6 py-4 whitespace-nowrap">Date</th>
                          <th className="px-4 md:px-6 py-4">Élève</th>
                          <th className="hidden md:table-cell px-6 py-4">Cours</th>
                          <th className="hidden sm:table-cell px-6 py-4">Durée</th>
                          <th className="px-4 md:px-6 py-4 text-right">Montant</th>
                          <th className="hidden lg:table-cell px-6 py-4 text-center">Statut</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {financials.history.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</td>
                              <td className="px-4 md:px-6 py-4 font-medium text-slate-900">{tx.student}</td>
                              <td className="hidden md:table-cell px-6 py-4">{tx.subject}</td>
                              <td className="hidden sm:table-cell px-6 py-4">{tx.duration.toFixed(1)}h</td>
                              <td className="px-4 md:px-6 py-4 text-right font-bold text-slate-900">+{tx.amount.toFixed(2)} €</td>
                              <td className="hidden lg:table-cell px-6 py-4 text-center">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Payé
                                  </span>
                              </td>
                          </tr>
                      ))}
                      {financials.history.length === 0 && (
                          <tr>
                              <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                  Aucune transaction pour le moment.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  )
}
