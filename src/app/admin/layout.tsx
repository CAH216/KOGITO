import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminSidebar from "./components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
      redirect('/api/auth/signin')
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar user={session.user} />
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="p-4 md:p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
