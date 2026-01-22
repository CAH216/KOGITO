import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Calendar, Clock, Video,  User, AlertCircle } from 'lucide-react';
import Link from 'next/link';

async function getData() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect('/auth/login');

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            parentProfile: {
                include: {
                    children: true
                }
            }
        }
    });

    if (!user?.parentProfile) redirect('/auth/login');

    const childrenIds = user.parentProfile.children.map(c => c.id);

    const sessions = await prisma.learningSession.findMany({
        where: {
            studentId: { in: childrenIds }
        },
        include: {
            student: true,
            tutor: {
                include: { user: true }
            }
        },
        orderBy: { startTime: 'asc' }
    });

    return { sessions, children: user.parentProfile.children };
}

export default async function ParentSchedulePage() {
    const { sessions } = await getData();

    const upcomingSessions = sessions.filter(s => new Date(s.startTime) >= new Date());
    const pastSessions = sessions.filter(s => new Date(s.startTime) < new Date()).reverse(); // Most recent past first

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Planning des cours</h1>
                    <p className="text-slate-500">Gérez l'emploi du temps de vos enfants.</p>
                </div>
                <Link 
                    href="/parent/tutors/search"
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                    + Nouveau cours
                </Link>
            </div>

            <div className="space-y-10">
                
                {/* UPCOMING */}
                <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Calendar className="text-indigo-600" />
                        À venir
                    </h2>

                    {upcomingSessions.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Calendar size={32} />
                            </div>
                            <p className="text-slate-500 font-medium">Aucun cours prévu prochainement.</p>
                            <Link href="/parent/tutors/search" className="text-indigo-600 font-bold hover:underline text-sm mt-2 block">
                                Réserver une séance
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {upcomingSessions.map(session => (
                                <SessionCard key={session.id} session={session} isUpcoming={true} />
                            ))}
                        </div>
                    )}
                </section>

                {/* PAST */}
                {pastSessions.length > 0 && (
                    <section>
                         <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Clock className="text-slate-400" />
                            Passés
                        </h2>
                        <div className="grid gap-4 opacity-75 hover:opacity-100 transition-opacity">
                            {pastSessions.map(session => (
                                <SessionCard key={session.id} session={session} isUpcoming={false} />
                            ))}
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
}

function SessionCard({ session, isUpcoming }: { session: any, isUpcoming: boolean }) {
    const startDate = new Date(session.startTime);
    const endDate = session.endTime ? new Date(session.endTime) : null;
    
    return (
        <div className={`bg-white p-5 rounded-2xl border flex flex-col md:flex-row md:items-center gap-6 group transition-all
            ${isUpcoming 
                ? 'border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-200' 
                : 'border-slate-100 bg-slate-50/50'
            }
        `}>
            {/* Date Badge */}
            <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl shrink-0 font-bold border
                 ${isUpcoming ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-100 text-slate-500 border-slate-200'}
            `}>
                <span className="text-2xl">{startDate.getDate()}</span>
                <span className="text-[10px] uppercase">{startDate.toLocaleDateString('fr-FR', { month: 'short' })}</span>
            </div>

            {/* Info */}
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-lg capitalize">{session.subject}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border
                        ${session.status === 'SCHEDULED' ? 'bg-sky-100 text-sky-700 border-sky-200' : ''}
                        ${session.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : ''}
                        ${session.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border-red-200' : ''}
                        ${session.status === 'REQUESTED' ? 'bg-amber-100 text-amber-700 border-amber-200' : ''}
                    `}>
                        {session.status === 'REQUESTED' ? 'En attente' : 
                         session.status === 'SCHEDULED' ? 'Confirmé' : 
                         session.status === 'COMPLETED' ? 'Terminé' : session.status}
                    </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                        <User size={14} />
                        Prof. {session.tutor.user.name}
                    </div>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        {endDate && ` - ${endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
                    </div>
                     <span className="hidden sm:inline text-slate-300">•</span>
                    <div className="flex items-center gap-1.5 font-medium text-slate-600">
                        Pour {session.student.name}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                {isUpcoming && session.status === 'SCHEDULED' && (
                     <Link href={`/interview/${session.id}`} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                        <Video size={16} />
                        Rejoindre
                    </Link>
                )}
                 {isUpcoming && session.status === 'REQUESTED' && (
                     <span className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg font-bold text-sm border border-amber-100">
                        <AlertCircle size={16} />
                        En attente
                    </span>
                )}
                {!isUpcoming && session.status === 'COMPLETED' && (
                    <button className="text-sm font-medium text-indigo-600 hover:underline">
                        Voir le bilan
                    </button>
                )}
            </div>
        </div>
    )
}