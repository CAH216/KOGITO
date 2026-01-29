import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Users, GraduationCap, Eye, CheckCircle2, XCircle, MoreHorizontal } from 'lucide-react'
import { deleteSchool, updateSchoolStatus } from '@/app/actions/school-actions'

interface Props {
  searchParams: Promise<{ status?: string }>
}

export default async function SchoolsPage({ searchParams }: Props) {
  const params = await searchParams
  const statusFilter = (params.status?.toUpperCase() || 'ALL') as string

  const whereClause: any = {
      // type: 'SCHOOL' // Removed this restriction to see Agencies too
  }
  
  if (statusFilter !== 'ALL') {
      whereClause.status = statusFilter
  }

  const schools = await prisma.organization.findMany({
    where: whereClause,
    include: {
      _count: {
        select: { students: true, tutors: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Get counts for tabs
  const pendingCount = await prisma.organization.count({ where: { status: 'PENDING' } })
  const activeCount = await prisma.organization.count({ where: { status: 'ACTIVE' } })
  const allCount = await prisma.organization.count()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Gestion des Partenaires</h1>
           <p className="text-gray-500">Écoles et Agences inscrites sur la plateforme.</p>
        </div>
        <Link
          href="/admin/schools/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm w-full md:w-auto"
        >
          <Plus size={20} />
          Ajouter manuellement
        </Link>
      </div>

       {/* Tabs */}
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <Link
                    href="/admin/schools"
                    className={`
                        ${statusFilter === 'ALL'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
                        whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2
                    `}
                >
                    Tous
                    <span className="bg-gray-100 text-gray-900 ml-2 rounded-full py-0.5 px-2.5 text-xs font-medium inline-block">
                        {allCount}
                    </span>
                </Link>
                <Link
                    href="/admin/schools?status=PENDING"
                    className={`
                        ${statusFilter === 'PENDING'
                            ? 'border-orange-500 text-orange-600'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
                        whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2
                    `}
                >
                    En attente
                    {pendingCount > 0 && (
                        <span className="bg-orange-100 text-orange-600 ml-2 rounded-full py-0.5 px-2.5 text-xs font-medium inline-block animate-pulse">
                            {pendingCount}
                        </span>
                    )}
                </Link>
                <Link
                    href="/admin/schools?status=ACTIVE"
                    className={`
                        ${statusFilter === 'ACTIVE'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
                        whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2
                    `}
                >
                    Actifs
                    <span className="bg-green-100 text-green-600 ml-2 rounded-full py-0.5 px-2.5 text-xs font-medium inline-block">
                        {activeCount}
                    </span>
                </Link>
            </nav>
        </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 font-semibold text-gray-700">Organisation</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Statut</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-center">Membres</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schools.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Aucune organisation trouvée pour ce filtre.
                </td>
              </tr>
            ) : (
              schools.map((school) => (
                <tr key={school.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{school.name}</div>
                    <div className="text-xs text-gray-500">{school.contactEmail}</div>
                    <div className="text-xs font-mono text-gray-400 mt-1">
                      {school.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                      {school.type === 'SCHOOL' ? (
                          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">École</span>
                      ) : (
                          <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-700/10">Agence</span>
                      )}
                  </td>
                  <td className="px-6 py-4">
                     {school.status === 'PENDING' && (
                         <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                             En attente validation
                         </span>
                     )}
                     {school.status === 'ACTIVE' && (
                         <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                             Actif
                         </span>
                     )}
                     {school.status === 'SUSPENDED' && (
                         <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                             Suspendu
                         </span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col gap-1 items-center">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Users size={14} /> {school._count.students} élèves
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                            <GraduationCap size={14} /> {school._count.tutors} tuteurs
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        {school.status === 'PENDING' && (
                            <form action={updateSchoolStatus.bind(null, school.id, 'ACTIVE')}>
                                <button className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-full transition-colors" title="Valider">
                                    <CheckCircle2 size={18} />
                                </button>
                            </form>
                        )}
                        
                        <Link 
                            href={`/admin/schools/${school.id}`}
                            className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-full transition-colors"
                            title="Voir détails & Admins"
                        >
                            <Eye size={18} />
                        </Link>
                        
                        <form action={deleteSchool.bind(null, school.id)}>
                            <button className="text-red-400 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors" title="Supprimer">
                                <XCircle size={18} />
                            </button>
                        </form>
                    </div>
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
