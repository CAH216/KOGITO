import { prisma } from '@/lib/prisma';
import { BadgeCheck, Clock, XCircle, AlertCircle } from 'lucide-react';

export default async function EmployeeSessionsPage() {
    const sessions = await prisma.learningSession.findMany({
        include: {
            tutor: { include: { user: true } },
            student: true
        },
        orderBy: { startTime: 'desc' },
        take: 50 // Limit for now
    });

    return (
       <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Gestion des Sessions</h1>
                <div className="flex gap-2">
                     {/* Placeholder for filters */}
                     <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Tous les statuts</option>
                        <option>Planifié</option>
                        <option>Terminé</option>
                        <option>Annulé</option>
                     </select>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Étudiant</th>
                                <th className="px-6 py-4">Tuteur</th>
                                <th className="px-6 py-4">Sujet</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sessions.map(session => (
                                <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900">
                                                {new Date(session.startTime).toLocaleDateString('fr-FR')}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {new Date(session.startTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-slate-900 block">{session.student.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-700">{session.tutor.user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{session.subject}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                            session.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            session.status === 'SCHEDULED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            session.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-100' :
                                            'bg-orange-50 text-orange-700 border-orange-100'
                                        }`}>
                                            {session.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer">
                                        Détails
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {sessions.length === 0 && (
                    <div className="p-8 text-center text-slate-500">Aucune session trouvée.</div>
                )}
            </div>
       </div>
    );
}
