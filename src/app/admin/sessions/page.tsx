'use client';

import { useState, useEffect } from 'react';
import { getAllSessions } from '@/actions/admin-actions';
import { 
    Search, 
    Filter, 
    Calendar,
    Clock, 
    Video,
    CheckCircle,
    XCircle
} from 'lucide-react';

export default function AdminSessionsPage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const data = await getAllSessions();
            setSessions(data);
            setLoading(false);
        }
        load();
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sessions de Tutorat</h1>
                    <p className="text-slate-500">Vue globale sur tous les cours programmés et passés.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1 w-full md:max-w-md">
                    <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Rechercher une session..." 
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <Filter size={16} /> Date
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Date & Heure</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Matière</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Tuteur</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Élève</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Statut</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Prix</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center">Chargement...</td></tr>
                            ) : sessions.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Aucune session enregistrée.</td></tr>
                            ) : (
                                sessions.map((session) => (
                                    <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 text-slate-900 font-medium">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {new Date(session.startTime).toLocaleDateString('fr-FR')}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                    <Clock size={12} />
                                                    {new Date(session.startTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-800">
                                            {session.subject}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-blue-600">{session.tutor.user.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900">{session.student.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                                session.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                session.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                                                session.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                                {session.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {session.price ? `${session.price} €` : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
