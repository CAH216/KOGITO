import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { getStudentDetailsForTutor } from '@/actions/tutor-actions';
import { User, Clock, Calendar, BookOpen, GraduationCap, School as SchoolIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface Props {
    params: Promise<{ studentId: string }>;
}

export default async function StudentDetailsPage({ params }: Props) {
  const { studentId } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
      redirect('/auth/login');
  }

  const data = await getStudentDetailsForTutor(session.user.email, studentId);
  
  if (!data) {
      return (
          <div className="p-8 text-center">
              <h2 className="text-xl font-bold text-slate-900">Étudiant introuvable ou accès non autorisé</h2>
              <Link href="/tutor/students" className="text-blue-600 hover:underline mt-4 inline-block">Retour à la liste</Link>
          </div>
      );
  }

  const { student, history } = data;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
        <Link href="/tutor/students" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 text-sm font-medium">
            <ArrowLeft size={16} className="mr-1" /> Retour aux élèves
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Student Profile Card */}
            <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
                    <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                        {student.name.substring(0, 2).toUpperCase()}
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">{student.name}</h1>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mt-2">
                        <GraduationCap size={14} />
                        {student.grade || 'Classe inconnue'}
                    </div>

                    <div className="mt-6 space-y-3 text-left">
                         <div className="flex items-center gap-3 text-sm text-slate-600 p-3 bg-slate-50 rounded-lg">
                             <SchoolIcon size={16} className="text-slate-400" />
                             <span className="font-medium">{student?.school?.name || 'École non renseignée'}</span>
                         </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Informations Parent</h3>
                    <div className="flex items-center gap-3">
                        {student.parent.user.image ? (
                             <img src={student.parent.user.image} alt={student.parent.user.name || ''} className="w-10 h-10 rounded-full" />
                        ) : (
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                                <User size={20} />
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-slate-900">{student.parent.user.name}</p>
                            <p className="text-xs text-slate-500">{student.parent.user.email}</p>
                        </div>
                    </div>
                    <Link href={`/tutor/messages?userId=${student.parent.user.id}`} className="mt-4 block w-full py-2 bg-white border border-slate-200 text-slate-700 font-medium text-sm text-center rounded-lg hover:bg-slate-50">
                        Envoyer un message
                    </Link>
                </div>
            </div>

            {/* History & Stats */}
            <div className="lg:col-span-2 space-y-6">
                
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <Clock size={18} className="text-slate-400" />
                            Historique des cours
                        </h2>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{history.length} sessions</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {history.map((session) => (
                            <div key={session.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex flex-col items-center justify-center border border-blue-100 flex-shrink-0">
                                        <span className="text-xs font-bold uppercase">{new Date(session.startTime).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                                        <span className="text-lg font-bold">{new Date(session.startTime).getDate()}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{session.subject}</h4>
                                        <p className="text-sm text-slate-500 line-clamp-1">{session.notes || "Aucune note de cours"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 sm:text-right">
                                     <div className="text-sm text-slate-600">
                                         <div className="flex items-center gap-1.5">
                                             <Clock size={14} />
                                             {session.endTime ? 
                                                Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60)) + ' min' 
                                                : 'N/A'}
                                         </div>
                                     </div>
                                     <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full
                                        ${session.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                                          session.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}
                                     `}>
                                         {session.status}
                                     </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    </div>
  )
}
