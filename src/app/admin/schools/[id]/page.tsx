import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Building2, UserCog, Mail } from 'lucide-react'
import { notFound } from 'next/navigation'
import { AddAdminForm } from './AddAdminForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SchoolDetailsPage({ params }: PageProps) {
  const { id } = await params
  
  const school = await prisma.organization.findUnique({
    where: { id },
    include: {
      users: {
        where: { role: 'SCHOOL_ADMIN' }
      },
      _count: {
        select: { students: true, tutors: true }
      }
    }
  })

  if (!school) return notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
            href="/admin/schools" 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
        >
            <ArrowLeft size={20} />
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{school.code}</span>
                <span>•</span>
                <span>{school.contactEmail || "Pas d'email"}</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 size={20} className="text-indigo-600"/>
                    Informations
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 text-sm">
                    <div>
                        <dt className="text-gray-500">Adresse</dt>
                        <dd className="font-medium text-gray-900 mt-1">{school.address || "-"}</dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">Téléphone</dt>
                        <dd className="font-medium text-gray-900 mt-1">{school.phoneNumber || "-"}</dd>
                    </div>
                </dl>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{school._count.students}</div>
                        <div className="text-sm text-orange-800">Élèves inscrits</div>
                    </div>
                     <div className="p-4 bg-teal-50 rounded-lg">
                        <div className="text-2xl font-bold text-teal-600">{school._count.tutors}</div>
                        <div className="text-sm text-teal-800">Tuteurs rattachés</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Sidebar / Admins */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <UserCog size={20} className="text-purple-600"/>
                        Administrateurs
                    </h2>
                </div>

                <div className="space-y-4">
                    {school.users.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">Aucun administrateur configuré.</p>
                    ) : (
                        school.users.map(admin => (
                            <div key={admin.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-xs flex-none">
                                    {admin.name?.[0]?.toUpperCase() || 'A'}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-medium text-sm text-gray-900 truncate">{admin.name}</div>
                                    <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                                        <Mail size={10} />
                                        {admin.email}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    <div className="pt-2 border-t border-gray-100">
                        <AddAdminForm organizationId={school.id} />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}