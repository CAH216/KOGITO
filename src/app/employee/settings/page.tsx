import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
import EditProfileForm from "@/components/settings/EditProfileForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/login')

  const user = await prisma.user.findUnique({
      where: { id: session.user.id }
  })

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-500 mt-1">Gérez votre profil administrateur et votre compte.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <section>
             <EditProfileForm 
                initialName={user.name || ''} 
                initialImage={user.image} 
                allowPhoto={true} 
            />
        </section>
        <section>
            <ChangePasswordForm />
        </section>
      </div>
    </div>
  )
}
