import ChangePasswordForm from '@/components/settings/ChangePasswordForm'
import EditProfileForm from '@/components/settings/EditProfileForm'
import { DeleteAccountSection } from '@/components/settings/DeleteAccountSection'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function ParentSettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/login')

  const user = await prisma.user.findUnique({
      where: { id: session.user.id }
  })

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-indigo-950">Paramètres</h1>
        <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Gérez vos préférences et la sécurité de votre compte.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Profil</h2>
            <EditProfileForm 
                initialName={user.name || ''} 
                initialImage={user.image} 
                allowPhoto={false} 
            />
        </section>
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Sécurité</h2>
            <ChangePasswordForm />
        </section>
      </div>

      <div className="mt-8">
        <DeleteAccountSection role="PARENT" />
      </div>
    </div>
  )
}
