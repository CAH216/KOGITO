import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, Search, MoreHorizontal, GraduationCap, Mail } from "lucide-react";

export default async function TeachersPage() {
  const session = await getServerSession(authOptions);

  
  const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      include: { organization: true }
  });

  if (!user?.organization) {
      return <div>Erreur d&apos;organisation</div>;
  }

  // Fetch tutors associated with this organization
  const tutors = await prisma.tutorProfile.findMany({
      where: { organizationId: user.organization.id },
      include: {
          user: {
              select: { name: true, email: true, image: true }
          }
      },
      orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Enseignants et Tuteurs</h1>
          <p className="text-sm text-slate-500">L'équipe pédagogique de {user.organization.name}</p>
        </div>
        <Link 
            href="/school-admin/teachers/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
            <Plus size={18} />
            Inscrire un enseignant
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex gap-4">
              <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
              </div>
          </div>
          
          <div className="overflow-x-auto">
              {tutors.length === 0 ? (
                   <div className="p-12 text-center text-slate-500">
                      <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <GraduationCap className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="font-medium text-lg">Aucun enseignant</p>
                      <p className="text-sm">Invitez vos professeurs pour commencer.</p>
                  </div>
              ) : (
                  <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                          <tr>
                              <th className="px-6 py-3">Enseignant</th>
                              <th className="px-6 py-3">Matières</th>
                              <th className="px-6 py-3">Statut</th>
                              <th className="px-6 py-3">Sessions</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {tutors.map((tutor) => (
                              <tr key={tutor.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-3">
                                      <div className="flex items-center gap-3">
                                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs uppercase">
                                              {tutor.user?.name?.substring(0,2) || 'EN'}
                                          </div>
                                          <div>
                                              <p className="font-medium text-slate-900">{tutor.user?.name}</p>
                                              <p className="text-xs text-slate-500">{tutor.user?.email}</p>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-3 max-w-xs truncate">
                                      {tutor.subjects.length > 0 ? (
                                        <div className="flex gap-1 flex-wrap">
                                            {tutor.subjects.slice(0, 3).map((sub: string, i: number) => (
                                                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs">
                                                    {sub}
                                                </span>
                                            ))}
                                            {tutor.subjects.length > 3 && (
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md text-xs">
                                                    +{tutor.subjects.length - 3}
                                                </span>
                                            )}
                                        </div>
                                      ) : <span className="text-slate-400 italic">Aucune matière</span>}
                                  </td>
                                  <td className="px-6 py-3">
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          tutor.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                      }`}>
                                          {tutor.status === 'APPROVED' ? 'Actif' : 'En attente'}
                                      </span>
                                  </td>
                                  <td className="px-6 py-3 text-slate-600">
                                      0h dispensées
                                  </td>
                                  <td className="px-6 py-3 text-right">
                                      <button className="text-slate-400 hover:text-slate-600">
                                          <MoreHorizontal size={18} />
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              )}
          </div>
      </div>
    </div>
  );
}
