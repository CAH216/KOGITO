import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, Search, MoreHorizontal, User } from "lucide-react";
import Link from "next/link";

export default async function StudentsPage() {
  const session = await getServerSession(authOptions);
  
  const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      include: { organization: true }
  });

  if (!user?.organization) {
      return <div>Erreur d&apos;organisation</div>;
  }

  const students = await prisma.student.findMany({
      where: { organizationId: user.organization.id },
      include: {
          parent: {
              include: {
                  user: {
                      select: { name: true, email: true }
                  }
              }
          }
      },
      orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Élèves</h1>
          <p className="text-sm text-slate-500">Liste des élèves inscrits dans votre établissement</p>
        </div>
        <Link 
            href="/school-admin/parents"
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition border border-slate-200"
        >
            <User size={18} />
            Gérer les Parents
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex gap-4">
              <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Rechercher un élève..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
              </div>
          </div>
          
          <div className="overflow-x-auto">
              {students.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                      <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <User className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="font-medium text-lg">Aucun élève inscrit</p>
                      <p className="text-sm">Commencez par ajouter des élèves à votre établissement.</p>
                  </div>
              ) : (
                  <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                          <tr>
                              <th className="px-6 py-3">Nom de l'élève</th>
                              <th className="px-6 py-3">Classe</th>
                              <th className="px-6 py-3">Parent</th>
                              <th className="px-6 py-3">Plan</th>
                              <th className="px-6 py-3">Date d'inscription</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {students.map((student) => (
                              <tr key={student.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-3 font-medium text-slate-900">
                                      {student.name}
                                  </td>
                                  <td className="px-6 py-3 text-slate-600">
                                      <span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold">
                                          {student.grade || 'Non assigné'}
                                      </span>
                                  </td>
                                  <td className="px-6 py-3">
                                      {student.parent?.user?.name || 'Inconnu'}
                                      <div className="text-xs text-slate-400">{student.parent?.user?.email}</div>
                                  </td>
                                  <td className="px-6 py-3">
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          student.plan === 'PREMIUM' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                      }`}>
                                          {student.plan}
                                      </span>
                                  </td>
                                  <td className="px-6 py-3 text-slate-500">
                                      {new Date(student.createdAt).toLocaleDateString()}
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
