import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Brain, CheckCircle2, Clock, Zap } from 'lucide-react';
import { submitHomeworkAnswers } from '@/actions/homework-ai-actions';

export default async function HomeworkIdPage({
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    const { id } = await params;
    const cookieStore = await cookies();
    const studentId = cookieStore.get('currentStudentId')?.value;
    if (!studentId) redirect('/profiles');

    const homework = await prisma.homework.findUnique({
        where: { id },
    });

    if (!homework || homework.studentId !== studentId) {
        return notFound();
    }

    const isCorrected = homework.status === 'CORRECTED';
    const content = homework.content as any;
    const correction = homework.correction as any;
    
    // If not AI interactive content or simple tutor task without questions
    if (!content?.questions) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 text-center">
                <h1 className="text-2xl font-bold mb-4">{homework.title}</h1>
                <p>{homework.description}</p>
                <Link href="/student/homework" className="text-indigo-600 mt-4 block underline">Retour</Link>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen">
             <Link href="/student/homework" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium">
                  <ArrowLeft size={20} /> Retour aux devoirs
             </Link>

             <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="bg-indigo-600 text-white p-8">
                       <span className="bg-indigo-500/50 text-indigo-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block border border-indigo-400">
                           {homework.subject} Challenge
                       </span>
                       <h1 className="text-3xl font-black mb-2">{homework.title}</h1>
                       <p className="text-indigo-100">{homework.description}</p>

                       {isCorrected && (
                           <div className="mt-6 flex items-center gap-4">
                                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
                                    <div className="h-12 w-12 bg-white text-indigo-600 rounded-xl flex items-center justify-center font-black text-xl">
                                        {homework.score}%
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-bold opacity-80">Score Final</div>
                                        <div className="font-medium text-indigo-100">{correction?.results?.filter((r:any) => r.isCorrect).length} / {content.questions.length} correct</div>
                                    </div>
                                </div>
                           </div>
                       )}
                  </div>

                  <div className="p-8">
                      {isCorrected ? (
                          <div className="space-y-8">
                              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-indigo-900 mb-8">
                                  <h3 className="font-bold flex items-center gap-2 mb-2">
                                      <Zap className="text-yellow-500" /> Bilan de Kogito :
                                  </h3>
                                  <p>{correction.generalFeedback}</p>
                              </div>
                              
                              {content.questions.map((q: any, i: number) => {
                                  const result = correction.results.find((r:any) => r.questionId === q.id);
                                  const isCorrect = result?.isCorrect;
                                  
                                  return (
                                      <div key={q.id} className={`p-6 rounded-2xl border-l-4 ${isCorrect ? 'border-l-emerald-500 bg-emerald-50/30' : 'border-l-red-500 bg-red-50/30'}`}>
                                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Question {i+1}</div>
                                          <h3 className="text-lg font-bold text-slate-800 mb-3">{q.question}</h3>
                                          
                                          <div className="mb-4">
                                               <div className="text-sm font-medium text-slate-500 mb-1">Ta réponse :</div>
                                               <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-700 italic">
                                                    {(homework.answers as any)?.[q.id] || "Aucune réponse"}
                                               </div>
                                          </div>

                                          <div className={`mt-4 p-4 rounded-xl text-sm ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                               <div className="font-bold flex items-center gap-2 mb-1">
                                                   {isCorrect ? <CheckCircle2 size={16} /> : <Brain size={16} />}
                                                   {isCorrect ? "Excellent !" : "Aie, pas tout à fait."}
                                               </div>
                                               <p>{result?.feedback}</p>
                                               {!isCorrect && result?.correctAnswer && <p className="mt-2 font-mono bg-white/50 p-2 rounded">Réponse attendue : {result.correctAnswer}</p>}
                                          </div>
                                      </div>
                                  )
                              })}
                          </div>
                      ) : (
                          <form action={async (formData) => {
                              'use server';
                              const answers: Record<string, string> = {};
                              content.questions.forEach((q: any) => {
                                  answers[q.id] = formData.get(q.id) as string;
                              });
                              await submitHomeworkAnswers(homework.id, answers);
                          }}>
                              <div className="space-y-8 mb-8">
                                {content.questions.map((q: any, i: number) => (
                                    <div key={q.id}>
                                        <label className="block text-lg font-bold text-slate-800 mb-3">
                                            <span className="text-indigo-500 mr-2">{i+1}.</span>
                                            {q.question}
                                        </label>
                                        
                                        {q.type === 'MULTIPLE_CHOICE' ? (
                                            <div className="space-y-2">
                                                {q.options?.map((opt: string) => (
                                                    <label key={opt} className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all">
                                                        <input type="radio" name={q.id} value={opt} className="w-5 h-5 text-indigo-600 focus:ring-indigo-500" required />
                                                        <span className="text-slate-700 font-medium">{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <textarea 
                                                name={q.id} 
                                                rows={3} 
                                                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                                placeholder="Écris ta réponse ici..."
                                                required
                                            ></textarea>
                                        )}
                                    </div>
                                ))}
                              </div>

                              <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 transition-transform hover:-translate-y-1 active:translate-y-0">
                                  Envoyer mes réponses 🚀
                              </button>
                          </form>
                      )}
                  </div>
             </div>
        </div>
    )
}
