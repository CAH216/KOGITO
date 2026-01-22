'use client';

import { useState, useEffect } from 'react';
import { getAdminAnalytics } from '@/actions/admin-actions';
import { 
    BarChart3, 
    TrendingUp, 
    DollarSign, 
    Users
} from 'lucide-react';

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const res = await getAdminAnalytics();
            setData(res);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) return <div className="p-8 text-center">Chargement des statistiques...</div>
    if (!data) return <div className="p-8 text-center text-red-500">Erreur de chargement.</div>

    // Helper to get max value for chart scaling
    const getMax = (obj: Record<string, number>) => Math.max(...Object.values(obj), 1);
    
    return (
        <div className="space-y-8 animate-fade-in">
             <div>
                <h1 className="text-2xl font-bold text-slate-900">Analytiques</h1>
                <p className="text-slate-500">Performance de la plateforme pour ce mois.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Sessions Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <BarChart3 className="text-blue-600" size={20} />
                            Sessions par jour
                        </h2>
                    </div>
                    
                    <div className="h-64 flex items-end justify-between gap-2">
                        {Object.entries(data.sessionsByDay).map(([date, count]: any) => (
                            <div key={date} className="flex-1 flex flex-col items-center group">
                                <div 
                                    className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all relative"
                                    style={{ height: `${(count / getMax(data.sessionsByDay)) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {count} sessions
                                    </div>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-2 rotate-45 origin-left translate-y-2 truncate w-full">
                                    {date.slice(0, 5)}
                                </div>
                            </div>
                        ))}
                         {Object.keys(data.sessionsByDay).length === 0 && (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                                Aucune donnée pour ce mois.
                            </div>
                        )}
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="text-emerald-600" size={20} />
                            Revenus par jour
                        </h2>
                    </div>
                    
                    <div className="h-64 flex items-end justify-between gap-2">
                        {Object.entries(data.revenueByDay).map(([date, amount]: any) => (
                             <div key={date} className="flex-1 flex flex-col items-center group">
                                <div 
                                    className="w-full bg-emerald-500 rounded-t-sm hover:bg-emerald-600 transition-all relative"
                                    style={{ height: `${(amount / getMax(data.revenueByDay)) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {amount.toFixed(0)} €
                                    </div>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-2 rotate-45 origin-left translate-y-2 truncate w-full">
                                    {date.slice(0, 5)}
                                </div>
                            </div>
                        ))}
                        {Object.keys(data.revenueByDay).length === 0 && (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                                Aucune donnée pour ce mois.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
