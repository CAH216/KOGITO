import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { getTutorStudents } from '@/actions/tutor-actions';
import { Users, GraduationCap, School as SchoolIcon, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function StudentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
      redirect('/auth/login');
  }

  const students = await getTutorStudents(session.user.email);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="text-blue-600" />
            Mes Élèves
        </h1>
        <div className="text-sm text-slate-500">
            {students.length} élève{students.length > 1 ? 's' : ''} actif{students.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
             <div key={student.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                 <div className="p-6">
                     <div className="flex items-start justify-between mb-4">
                         <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                             {student.name.substring(0, 2).toUpperCase()}
                         </div>
                         <Link href={`/tutor/messages?student=${student.id}`} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors">
                             Message
                         </Link>
                     </div>
                     
                     <h3 className="font-bold text-slate-900 text-lg mb-1">{student.name}</h3>
                     <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                         <GraduationCap size={14} /> {student.grade || 'Niveau non spécifié'}
                     </div>

                     <div className="space-y-2 text-sm">
                         <div className="flex items-center gap-2 text-slate-600">
                             <SchoolIcon size={14} className="text-slate-400" />
                             {student.school?.name || 'École non renseignée'}
                         </div>
                         <div className="flex items-center gap-2 text-slate-600">
                             <Clock size={14} className="text-slate-400" />
                             Dernier cours: {new Date(student.lastSession).toLocaleDateString()}
                         </div>
                          <div className="flex items-center gap-2 text-slate-600">
                             <CheckCircle size={14} className="text-slate-400" />
                             {student.totalSessions} session{student.totalSessions > 1 ? 's' : ''}
                         </div>
                     </div>
                 </div>
                 <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center bg-opacity-50">
                     <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Actif</span>
                     <Link href={`/tutor/students/${student.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                         Voir le dossier &rarr;
                     </Link>
                 </div>
             </div>
          ))}

          {students.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <Users size={48} className="mx-auto mb-4 text-slate-300" />
                  <p className="font-medium">Aucun élève pour le moment.</p>
                  <p className="text-sm mt-1">Vos futurs élèves apparaîtront ici après votre première session.</p>
              </div>
          )}
      </div>
    </div>
  )
}
