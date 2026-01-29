import { prisma } from '@/lib/prisma';
import { Building2, MapPin, Mail, Phone, Plus } from 'lucide-react';

export default async function EmployeeSchoolsPage() {
    const schools = await prisma.organization.findMany({
        where: { type: 'SCHOOL' },
        include: { _count: { select: { students: true, tutors: true } } }
    });

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Partenariats Écoles</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-100">
                    <Plus size={18} />
                    Nouvelle École
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schools.map(school => (
                    <div key={school.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-indigo-50 p-3 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                <Building2 className="text-indigo-600 h-6 w-6" />
                            </div>
                            <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                                {school.code}
                            </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{school.name}</h3>
                        <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                            <MapPin size={14} />
                            {school.city || 'Ville non spécifiée'}
                        </div>

                         <div className="space-y-2 mb-6">
                            {school.contactEmail ? (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Mail size={14} /> {school.contactEmail}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-slate-400 italic">
                                     <Mail size={14} /> Email non renseigné
                                </div>
                            )}
                            {school.phoneNumber ? (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Phone size={14} /> {school.phoneNumber}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-slate-400 italic">
                                    <Phone size={14} /> Tél non renseigné
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                            <div className="bg-slate-50 rounded-lg px-3 py-1.5 flex flex-col items-center flex-1">
                                <span className="text-lg font-bold text-slate-900">{school._count.students}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Élèves</span>
                            </div>
                            <div className="bg-slate-50 rounded-lg px-3 py-1.5 flex flex-col items-center flex-1">
                                <span className="text-lg font-bold text-slate-900">{school._count.tutors}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Tuteurs</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             {schools.length === 0 && (
                <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-xl">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                        <Building2 size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Aucune école partenaire</h3>
                    <p className="text-slate-500 mt-1 max-w-sm mx-auto">Ajoutez des établissements scolaires pour gérer les partenariats B2B.</p>
                </div>
            )}
        </div>
    )
}
