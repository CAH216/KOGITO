import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { getTutorRequests } from '@/actions/tutor-actions';
import { Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import RequestActions from '@/components/requests/RequestActions';

export default async function RequestPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
      redirect('/auth/login');
  }

  const requests = await getTutorRequests(session.user.email);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in px-4 md:px-0">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <MessageSquare className="text-blue-600" />
          Demandes de cours
      </h1>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {requests.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                    <MessageSquare size={24} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Aucune demande</h3>
                <p className="mt-1">Vous n avez pas de nouvelles demandes pour le moment.</p>
            </div>
        ) : (
            <div className="divide-y divide-slate-100">
                {requests.map((req) => (
                    <div key={req.id} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-900 text-lg">{req.student}</h3>
                                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold uppercase tracking-wide">
                                        {req.grade || 'N/A'}
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    Matière: <span className="text-blue-600">{req.subject}</span>
                                </p>
                                
                                {req.message && (
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-600 italic mb-3 relative">
                                        <span className="absolute -left-1 top-3 w-1 h-6 bg-blue-200 rounded-r"></span>
                                        "{req.message}"
                                    </div>
                                )}

                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                                        <Clock size={12} />
                                        Reçu le {new Date(req.createdAt).toLocaleDateString()} à {new Date(req.createdAt).toLocaleTimeString()}
                                    </span>
                                    {/* Additional metadata could go here */}
                                </div>
                            </div>
                            
                            <RequestActions requestId={req.id} />
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}
