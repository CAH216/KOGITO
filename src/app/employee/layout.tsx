import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import EmployeeSidebar from "./components/EmployeeSidebar";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
      redirect('/api/auth/signin')
  }

  // Optional: Add strict role check here if not handled by middleware
  if (session.user.role !== 'EMPLOYEE' && session.user.role !== 'ADMIN') {
      // Redirect unauthorized users (e.g., parents trying to access employee area)
      redirect('/dashboard') // or a 403 page
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <EmployeeSidebar user={session.user} />
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="p-4 md:p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
