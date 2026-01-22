import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { getTutorSchedule } from '@/actions/tutor-actions';
import { CalendarDays, Clock, User, Video, MapPin } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function SchedulePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
      redirect('/auth/login');
  }

  const sessions = await getTutorSchedule(session.user.email);

  // Group by Date
  const groupedSessions = sessions.reduce((acc, session) => {
      const dateKey = new Date(session.start).toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
      });
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(session);
      return acc;
  }, {} as Record<string, typeof sessions>);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in px-4 md:px-0">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <CalendarDays className="text-blue-600" />
                Mon Calendrier
            </h1>
            <p className="text-slate-500 mt-1">Gérez vos sessions de tutorat à venir.</p>
        </div>
        <Link href="/tutor/schedule/availability" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm w-full md:w-auto text-center">
            Gérer mes disponibilités
        </Link>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedSessions).length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <CalendarDays size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Aucune session prévue</h3>
                <p className="text-slate-500 mt-2">Vous n'avez pas de cours programmés pour le moment.</p>
            </div>
        ) : (
            Object.entries(groupedSessions).map(([date, daySessions]) => (
                <div key={date}>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                        {date}
                    </h3>
                    <div className="space-y-4">
                        {daySessions.map((session) => (
                            <div key={session.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                                <div className="flex items-start md:items-center gap-4">
                                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 shrink-0">
                                        <span className="text-xl font-bold">{new Date(session.start).getHours()}h</span>
                                        <span className="text-xs font-medium text-blue-500">
                                            {new Date(session.start).getMinutes().toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">{session.subject}</h4>
                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-1 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <User size={14} /> {session.studentName}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} /> 
                                                {Math.round((new Date(session.end).getTime() - new Date(session.start).getTime()) / (1000 * 60))} min
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-0 border-slate-100">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium
                                        ${session.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' : ''}
                                        ${session.status === 'REQUESTED' ? 'bg-orange-100 text-orange-700 animate-pulse' : ''}
                                        ${session.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : ''}
                                        ${session.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : ''}
                                    `}>
                                        {session.status === 'SCHEDULED' ? 'Prévu' : 
                                         session.status === 'REQUESTED' ? 'En attente' :
                                         session.status === 'COMPLETED' ? 'Terminé' : 'Annulé'}
                                    </div>
                                    
                                    {session.status === 'SCHEDULED' && (
                                        <Link 
                                            href={`/session/${session.id}`}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm"
                                        >
                                            <Video size={16} /> Rejoindre
                                        </Link>
                                    )}
                                    {session.status === 'REQUESTED' && (
                                        <Link 
                                            href={`/tutor/requests`}
                                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-all font-medium shadow-sm"
                                        >
                                             Voir
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  )
}
