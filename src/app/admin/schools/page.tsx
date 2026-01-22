import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Users, GraduationCap } from 'lucide-react'
import { deleteSchool } from '@/app/actions/school-actions'

export default async function SchoolsPage() {
  const schools = await prisma.school.findMany({
    include: {
      _count: {
        select: { students: true, tutors: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Gestion des Établissements</h1>
           <p className="text-gray-500">Gérez les écoles partenaires et leurs accès.</p>
        </div>
        <Link
          href="/admin/schools/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm w-full md:w-auto"
        >
          <Plus size={20} />
          Ajouter une école
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 font-semibold text-gray-700">Nom & Code</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Contact</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-center">Élèves</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-center">Tuteurs</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schools.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Aucun établissement enregistré.
                </td>
              </tr>
            ) : (
              schools.map((school) => (
                <tr key={school.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{school.name}</div>
                    <div className="text-xs font-mono text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded mt-1 border border-indigo-100">
                      {school.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="text-sm">{school.contactEmail || '-'}</div>
                    <div className="text-xs text-gray-400">{school.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                      <Users size={14} />
                      {school._count.students}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium">
                      <GraduationCap size={14} />
                      {school._count.tutors}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={deleteSchool.bind(null, school.id)}>
                        <button className="text-red-500 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-3 py-1 rounded-md transition-colors">
                            Supprimer
                        </button>
                    </form>
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
