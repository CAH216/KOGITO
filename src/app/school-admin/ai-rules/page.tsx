import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AlertCircle, BrainCircuit } from "lucide-react";
import AIRuleForm from "./AIRuleForm";
import RuleList from "./RuleList";

export default async function AIRulesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  // Ensure user has an organization (School Admin)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { organizationId: true }
  });

  if (!user?.organizationId) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Vous n'êtes pas rattaché à une organisation.
        </div>
      </div>
    );
  }

  const rules = await prisma.aIInstruction.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
              
              <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Le Cerveau de l'Établissement</h1>
                    <p className="text-slate-500 mt-1">Configurez le comportement de l'IA pour vos élèves.</p>
                  </div>
              </div>
              
              <AIRuleForm />

              {/* Rules List Component */}
              <RuleList rules={rules} />

          </div>

          <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-700 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                  <BrainCircuit className="h-12 w-12 text-white/20 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Comment ça marche ?</h3>
                  <p className="text-sm text-blue-100 leading-relaxed mb-4">
                      Les règles que vous définissez ici sont injectées dans le "System Prompt" de l'IA pour tous les élèves de votre établissement.
                  </p>
                  <ul className="text-sm text-blue-100 space-y-2 list-disc pl-4">
                      <li>Définissez le ton (vouvoyer, tutoyer)</li>
                      <li>Interdisez certains sujets</li>
                      <li>Forcez une méthodologie (Socratique, Explicative...)</li>
                  </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <AlertCircle size={18} className="text-amber-500" />
                      Tests & Simulation
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                      Tester vos règles avant de les appliquer à tous les élèves.
                  </p>
                  <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition-colors">
                      Ouvrir le simulateur
                  </button>
              </div>
          </div>

      </div>
      
    </div>
  );
}
