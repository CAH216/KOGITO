'use client';

import { useState, useEffect } from 'react';
import { getAllTutors } from '@/actions/admin-actions';
import { 
    Search, 
    Filter, 
    MoreVertical, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Star
} from 'lucide-react';
import Image from 'next/image';

export default function AdminTutorsPage() {
    const [tutors, setTutors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function load() {
            setLoading(true);
            const data = await getAllTutors();
            setTutors(data);
            setLoading(false);
        }
        load();
    }, []);

    const filteredTutors = tutors.filter(t => 
        t.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestion des Tuteurs</h1>
                    <p className="text-slate-500">Gérez les inscriptions et les profils des professeurs.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1 w-full md:max-w-md">
                    <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Rechercher un tuteur..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <Filter size={16} /> Filters
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Tuteur</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Statut</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Matières</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Tarif</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Sessions</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center">Chargement...</td></tr>
                            ) : filteredTutors.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Aucun tuteur trouvé.</td></tr>
                            ) : (
                                filteredTutors.map((tutor) => (
                                    <tr key={tutor.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden relative">
                                                    {tutor.user.image ? (
                                                        <Image src={tutor.user.image} alt={tutor.user.name || 'T'} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                                            {tutor.user.name?.[0] || 'T'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{tutor.user.name}</div>
                                                    <div className="text-xs text-slate-500">{tutor.user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                                tutor.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                tutor.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {tutor.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {tutor.subjects.slice(0, 2).map((sub: string) => (
                                                    <span key={sub} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{sub}</span>
                                                ))}
                                                {tutor.subjects.length > 2 && <span className="text-xs text-slate-400">+{tutor.subjects.length - 2}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {tutor.hourlyRate} $/h
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {tutor._count.sessions}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-slate-600 p-2">
                                                <MoreVertical size={18} />
                                            </button>
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
