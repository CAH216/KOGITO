import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, User, Shield, Trash2, Mail } from 'lucide-react'
import { deleteUser } from '@/app/actions/user-actions'

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
           <p className="text-gray-500">Gérez les comptes utilisateurs (Employés, Parents, Tuteurs, Écoles).</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <Link
            href="/admin/users/employees/new"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm w-full md:w-auto"
            >
            <Plus size={20} />
            Ajouter un Employé
            </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 font-semibold text-gray-700">Utilisateur</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Rôle</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Inscription</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                            {user.name ? user.name[0].toUpperCase() : <User size={20} />}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">{user.name || 'Sans Nom'}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail size={12} />
                                {user.email}
                            </div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                          user.role === 'EMPLOYEE' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'SCHOOL_ADMIN' ? 'bg-orange-100 text-orange-800' :
                          user.role === 'TUTOR' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                     {user.role !== 'ADMIN' && (
                        <form action={deleteUser.bind(null, user.id)}>
                            <button className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg">
                                <Trash2 size={18} />
                            </button>
                        </form>
                     )}
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
