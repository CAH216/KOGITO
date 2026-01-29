import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, Search, MoreHorizontal, User, Mail } from "lucide-react";
import Link from "next/link";

export default async function ParentsPage() {
  const session = await getServerSession(authOptions);
  
  const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      include: { organization: true }
  });

  if (!user?.organization) {
      return <div>Erreur d&apos;organisation</div>;
  }

  // Find parents who have children in this organization
  // OR parents who are explicitly linked to the organization (if we add that relation later)
  // For now, we find parents via their children enrolled in the org
  const parents = await prisma.parentProfile.findMany({
      where: {
          children: {
              some: {
                  organizationId: user.organization.id
              }
          }
      },
      include: {
          user: true,
          children: {
              where: { organizationId: user.organization.id }
          }
      }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Parents</h1>
          <p className="text-sm text-slate-500">Gérez les comptes parents liés à votre établissement</p>
        </div>
        <Link 
            href="/school-admin/parents/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
            <Plus size={18} />
            Ajouter une famille
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex gap-4">
              <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Rechercher un parent..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
              </div>
          </div>
          
          <div className="overflow-x-auto">
              {parents.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                      <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <User className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="font-medium text-lg">Aucun parent trouvé</p>
                      <p className="text-sm">Ajoutez des parents pour qu'ils puissent inscrire leurs enfants.</p>
                  </div>
              ) : (
                  <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                          <tr>
                              <th className="px-6 py-3">Nom du Parent</th>
                              <th className="px-6 py-3">Enfants inscrits</th>
                              <th className="px-6 py-3">Contact</th>
                              <th className="px-6 py-3">Date d'inscription</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {parents.map((parent) => (
                              <tr key={parent.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-3 font-medium text-slate-900">
                                      {parent.user.name}
                                  </td>
                                  <td className="px-6 py-3 text-slate-600">
                                      {parent.children.map(child => child.name).join(", ")}
                                  </td>
                                  <td className="px-6 py-3">
                                      <div className="flex items-center gap-1 text-slate-600">
                                          <Mail size={14} />
                                          {parent.user.email}
                                      </div>
                                      {parent.phoneNumber && (
                                          <div className="text-xs text-slate-400 mt-1">{parent.phoneNumber}</div>
                                      )}
                                  </td>
                                  <td className="px-6 py-3 text-slate-500">
                                      {new Date(parent.createdAt).toLocaleDateString()}
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
