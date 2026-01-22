import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { redirect, notFound } from 'next/navigation';
import  { EditChildForm } from './EditChildForm'; 
import { DeleteChildButton } from './DeleteChildButton';

export default async function ManageChildPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) redirect('/auth/login');

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: { parent: { include: { user: true } } }
  });

  // Security Check: Ensure the user is the parent of this student
  if (!student || student.parent.user.email !== session.user.email) {
      notFound();
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
       
       <div className="flex items-center justify-between mb-8">
            <div>
                <Link href="/parent/children" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-2 text-sm font-medium transition-colors">
                    <ArrowLeft size={16} />
                    Retour
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Profil de {student.name}</h1>
            </div>
            
            <DeleteChildButton studentId={student.id} />
       </div>

       <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <EditChildForm student={student} />
       </div>

    </div>
  )
}
